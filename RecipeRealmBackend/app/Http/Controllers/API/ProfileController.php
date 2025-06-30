<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;

class ProfileController extends Controller
{
   public function show(Request $request)
{
    $user = $request->user();
    if (!$user) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }
    $user->load(['recipes', 'likedRecipes']);
    return new UserResource($user);
}

    public function uploadImage(Request $request)
{
    $request->validate(['image' => 'required|image|max:2048']);
    $path = $request->file('image')->store('profile-images', 'public');
    $user = $request->user();
    $user->update(['profileImage' => $path]);
    return response()->json(['image_url' => '/storage/' . $path]);
}

}