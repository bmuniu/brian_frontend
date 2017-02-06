<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index');
Route::get('/travel-plan/new', 'TravelPlanController@index');
Route::get('/travel-plan/my-plans', 'TravelPlanController@getMyTravelPlans');
Route::get('/travel-plan/plan-details/{plan_id}', 'TravelPlanController@loadMoreDetails');
Route::post('/travel-plan/plan-details/update-status', 'TravelPlanController@updateStatus');
Route::post('/travel-plan/save', 'TravelPlanController@save');
