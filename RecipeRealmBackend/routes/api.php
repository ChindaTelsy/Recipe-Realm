<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\API\ProfileController;


Route::middleware('auth:sanctum')->get('/users', [UserController::class, 'index']);
Route::get('/regions', [RegionController::class, 'index']);
Route::middleware('auth:sanctum')->delete('/recipes/{id}', [RecipeController::class, 'destroy']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/recipes/{recipe}/like', [RecipeController::class, 'likeRecipe']);
    Route::post('/recipes/{recipe}/rate', [RecipeController::class, 'rate']);
});
Route::middleware('auth:sanctum')->get('/profile', [ProfileController::class, 'show']);
Route::middleware('auth:sanctum')->post('/profile/upload-image', [ProfileController::class, 'uploadImage']);

Route::get('/recipes', [RecipeController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'getCategories']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/recipes', [RecipeController::class, 'store']);
    Route::get('/users/{userId}/recipes', [RecipeController::class, 'userRecipes']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
