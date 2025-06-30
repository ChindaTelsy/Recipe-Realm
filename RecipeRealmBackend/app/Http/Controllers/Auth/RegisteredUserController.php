<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    
    public function store(Request $request): JsonResponse
    {
      $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password),
    ]);


    event(new Registered($user));

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
      'user' => [
            'uid' => (string) $user->id,
            'name' => $user->name,
            'bio' => '',
            'joinDate' => $user->created_at->toISOString(),
            'profileImage' => null,
            'location' => '',
            'stats' => [
                'recipes' => 0,
                'likes' => 0,
                'avgRating' => 0,
            ],
            'recipes' => [],
            'likedRecipes' => [],
        ],
        'token' => $token,
    ], 201);
}
}
