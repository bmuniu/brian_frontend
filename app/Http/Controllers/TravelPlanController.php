<?php

namespace App\Http\Controllers;

use App\Department;
use App\Project;
use App\TravelPlan;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use Yajra\Datatables\Facades\Datatables;

class TravelPlanController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(){
        $projects = Project::all();
        $departments = Department::all();

        return view('travel-plans.create-travel-plan', [
            'projects' => $projects,
            'departments' => $departments
        ]);
    }

    public function getMyTravelPlans(){
        $plans = TravelPlan::where('created_by', Auth::user()->id);
        return Datatables::of($plans)
            ->make(true);
    }
    
    public function loadMoreDetails(Request $request){
        $plan_id = $request->plan_id;
        $travel_plan = TravelPlan::find($plan_id);

        $project = Project::find($travel_plan->project_id);
        $travel_plan->project_id = $project->project_name;

        $department = Department::find($travel_plan->department_id);
        $travel_plan->department_id = $department->department_name;

        return Response::json($travel_plan);
    }

    public function updateStatus(Request $request){
        try {
            $travel_plan = TravelPlan::find($request->plan_id);
            $travel_plan->status = $request->status;
            $travel_plan->save();
            
            return Response::json([
                'success' => true,
                'message' => 'Travel Plan status has been update'
            ]);
        } catch (QueryException $qe) {
            return Response::json([
                'success' => false,
                'message' => $qe->getMessage()
            ]);
        }
    }
}
