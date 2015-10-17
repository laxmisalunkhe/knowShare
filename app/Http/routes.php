<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::post('/register','RegistrationController@create');
Route::post('/login','LoginController@auth');
Route::get('logout','LoginController@logout');
Route::post('/updateSeeker','RegistrationController@updateKnowSeeker');
Route::post('/updateTrainer','RegistrationController@updateTrainer');
Route::get('/getCategories','CategoriesController@index');
Route::get('/user/profile','LoginController@getCurrentUser');
