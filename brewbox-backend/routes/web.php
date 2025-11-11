<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::get('/', function () {
    return view('welcome');
});

// Add this for the named route
Route::get('/login', function () {
    return response()->json(['message' => 'Please login via API']);
})->name('login');

// CSRF Cookie route for Sanctum
Route::get('/sanctum/csrf-cookie', function() {
    return response()->json(['message' => 'CSRF cookie set']);
});
