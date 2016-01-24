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
    return view('layout');
});

Route::get('/partials/index', function () {
    return view('partials.index');
});

Route::get('/partials/{url}', function ($url) {
    return view('partials.perfil.view');
});
Route::get('/partials/{url}/perfil', function ($url) {
    return view('partials.users.view');
});
Route::get('/partials/{url}/perfil/edit', function ($url) {
    return view('partials.users.edit');
});
Route::get('/partials/{url}/fotos', function ($url) {
    return view('partials.users.fotos');
});
Route::get('/partials/{url}/eventos', function ($url) {
    return view('partials.users.calendario');
});
Route::get('/partials/{url}/proximoseventos', function ($url) {
    return view('partials.users.eventos');
});

Route::get('/partials/{category}/{action?}', function ($category, $action = 'index') {
    return view(join('.', ['partials', $category, $action]));
});

Route::get('/partials/{category}/{action}/{id}', function ($category, $action = 'index', $id) {
    return view(join('.', ['partials', $category, $action]));
});


Route::group(['prefix' => 'api'], function() {
    Route::post('user/login', 'UserController@login');
    Route::get('user/getByToken', 'UserController@getByToken');
    Route::get('user/usersAdmin', 'UserController@usersAdmin');
    //Route::get('perfil/fromUrl', 'UserController@findByUrl');


    Route::resource('post', 'PostController');
    Route::resource('user', 'UserController');
    Route::resource('perfil', 'DashboardController');
    Route::resource('foto', 'FotoController');
    Route::get('eventos/proximos', [
        'as' => 'eventos.proximos',
        'uses' => 'EventosController@proximos',
    ]);
    Route::get('eventos/asistidos', [
        'as' => 'eventos.asistidos',
        'uses' => 'EventosController@asistidos',
    ]);
    Route::resource('eventos', 'EventosController');
});
/* Route::post('/api/user/login', 'UserController@login');
  Route::get('/api/user/getByToken', 'UserController@getByToken');

  Route::resource('/api/post', 'PostController');
  Route::resource('/api/user', 'UserController'); */

Route::any('{undefinedRoute}', function ($undefinedRoute) {
    return view('layout');
})->where('undefinedRoute', '([A-z\d-\/_.]+)?');

// Using different syntax for Blade to avoid conflicts with Jade.
Blade::setContentTags('<%', '%>');
Blade::setEscapedContentTags('<%%', '%%>');
