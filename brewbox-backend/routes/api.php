<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ContactController;

// Test route
Route::get('/test', function() {
    return response()->json(['message' => 'API is working']);
});

// use App\Services\SentimentAnalyzer;

// Route::get('/test-sentiment', function (SentimentAnalyzer $analyzer) {
//     $tests = [
//         'This coffee is absolutely amazing! Love it!',
//         'Terrible quality. Worst coffee ever.',
//         'It was okay, nothing special.',
//         'The aroma is wonderful and taste is perfect!',
//         'Bitter and burnt. Very disappointed.',
//     ];

//     $results = [];
//     foreach ($tests as $text) {
//         $score = $analyzer->analyze($text);
//         $results[] = [
//             'text' => $text,
//             'score' => $score,
//             'label' => $analyzer->getLabel($score),
//         ];
//     }

//     return response()->json($results);
// });

// Public routes
Route::post('/users/login', [AuthController::class, 'login']);
Route::post('/users', [AuthController::class, 'register']);
Route::post('/users/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/users/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/contact', [ContactController::class, 'store']);

// Products (public)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/top', [ProductController::class, 'getTopProducts']);
Route::get('/products/recommend', [ProductController::class, 'getRecommendedProducts']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::post('/products/{id}/notify', [ProductController::class, 'notifyWhenAvailable']);

// Protected routes (authenticated users)
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/users/logout', [AuthController::class, 'logout']);
    Route::get('/users/profile', [AuthController::class, 'profile']);
    Route::put('/users/profile', [AuthController::class, 'updateProfile']);

    // Reviews
    Route::post('/products/{id}/reviews', [ProductController::class, 'createReview']);

    // Orders
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/mine', [OrderController::class, 'getMyOrders']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);

    // Admin routes
    Route::middleware('admin')->group(function () {
        // Products
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);

        // Orders
        Route::get('/orders', [OrderController::class, 'index']);
        Route::put('/orders/{id}/deliver', [OrderController::class, 'updateToDelivered']);

        // Users
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        // Upload
        Route::post('/upload', [UploadController::class, 'upload']);
    });
});
