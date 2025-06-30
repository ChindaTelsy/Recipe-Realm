<?php

namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use App\Models\User; // Add this import
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
  public function store(Request $request): JsonResponse
    {
       $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    

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
    ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}
