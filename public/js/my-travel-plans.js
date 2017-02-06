$(function () {
    $('#my-travel-plans > tbody').on('click', 'tr', function(event){
        if(event.ctrlKey) {
            $(this).toggleClass('info');
        }
        else {
            if ( $(this).hasClass('info') ) {
                $('#my-travel-plans > tbody > tr').removeClass('info');
            }
            else {
                $('#my-travel-plans > tbody > tr').removeClass('info');
                $(this).toggleClass('info');
            }
        }
    });
});

$('#my-travel-plans').DataTable({
    processing: true,
    serverSide: true,
    ajax: 'travel-plan/my-plans',
    columns: [
        {data: 'id', name: 'id'},
        {data: 'name', name: 'name'},
        {data: 'grade', name: 'grade'},
        {data: 'institution', name: 'institution'},
        {data: 'venue', name: 'venue'}
    ]
});

$('button.load-more-details').on('click', function () {
    var selected = $('tr.info').length;
    if(selected){
        var plan_id = $('tr.info > td:first').text();

        // load travel plan details
        $.ajax({
            url: 'travel-plan/plan-details/'+plan_id,
            type: 'get',
            dataType: 'json',
            beforeSend: function () {
                $('#more-details').addClass('loading');
            },
            success: function (data) {
                $('#more-details').removeClass('loading');

                $('#plan_name > b').text(data.name);
                var ul = '<ul class=list-group>';

                ul += '<li class="list-group-item">Project: <b>' + data.project_id + '</b></li>';
                ul += '<li class="list-group-item">Grade: <b>' + data.grade + '</b></li>';
                ul += '<li class="list-group-item">Insurance: <b>' + data.institution + '</b></li>';
                ul += '<li class="list-group-item">Venue: <b>' + data.venue + '</b></li>';
                ul += '<li class="list-group-item">Start Date: <b>' + data.start_date + '</b></li>';
                ul += '<li class="list-group-item">End Date: <b>' + data.end_date + '</b></li>';
                ul += '<li class="list-group-item">Days Away: <b>' + data.days_away + '</b></li>';
                ul += '<li class="list-group-item">Justification: <b>' + data.justification + '</b></li>';
                ul += '<li class="list-group-item">Budget Line: <b>' + data.budget_line + '</b></li>';
                ul += '<li class="list-group-item">Percentage of Travel Budget spent: <b>' + data.travel_budget_percentage * 100 + '%</b></li>';
                ul += '<li class="list-group-item">Applicable Quarter: <b>' + data.applicable_quarter + '</b></li>';
                ul += '<li class="list-group-item">Department: <b>' + data.department_id + '</b></li>';
                ul += '<li class="list-group-item">Budget Balance At: <b>' + data.budget_balance_at + ' ('+data.travel_budget_balance+')</b></li>';
                ul += '<li class="list-group-item">Total Allocated Travel Budget for the year: <b>' + data.total_travel_budget + '</b></li>';
                ul += '<li class="list-group-item">Regional Office of the mission destination: <b>' + data.regional_office_of_mission_destination + '</b></li>';
                ul += '<li class="list-group-item">Status: <b>' + data.status + '</b></li>';

                ul += '</ul>';
                $('#plan-details').html(ul);
            }
        });

    } else {
        alert('You must select at lease one travel plan');
    }
});

$('button.update-status').on('click', function () {
    var selected = $('tr.info').length;
    var plan_id = $('tr.info > td:first').text();
    
    if(selected){
        // open modal
        $('#update-status-modal').modal('show')

        $('#modal-plan-id').val(plan_id);

        // get current status
        $.ajax({
            url: 'travel-plan/plan-details/'+plan_id,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $('select[name="status"]').val(data.status);
            }
        });
    } else {
        alert('Please select a travel plan first!');
    }
});

$('form#update-status-form').on('submit', function (e) {
    e.preventDefault();

    $.ajax({
        url: 'travel-plan/plan-details/update-status',
        type: 'post',
        data: $(this).serialize(),
        dataType: 'json',
        success: function (data) {
            if(data.success){
                $('#update-status-modal').modal('hide');

                var alert = '<div class="alert alert-success"><button class="close" data-dismiss="alert">&times;</button>';
                alert += '<strong>Success!</strong> ' + data.message;
                alert += '</div>';
                $('div#feedback').html(alert);
            }
        }
    });
});