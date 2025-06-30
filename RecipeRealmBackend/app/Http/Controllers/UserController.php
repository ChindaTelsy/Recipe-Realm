<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // Get all users
    public function index()
    {
        return User::with(['recipes', 'favoriteRecipes', 'ratings'])->get();
    }

    // Get a specific user by ID
    public function show($id)
    {
        $user = User::with(['recipes', 'favoriteRecipes', 'ratings'])->find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return $user;
    }

    // Create a new user
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json($user, 201);
    }

    // Update an existing user
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|string|min:6|confirmed',
        ]);

        if (isset($validated['name'])) $user->name = $validated['name'];
        if (isset($validated['email'])) $user->email = $validated['email'];
        if (isset($validated['password'])) $user->password = Hash::make($validated['password']);

        $user->save();

        return response()->json($user);
    }

// public function uploadProfileImage(Request $request)
// {
//     try {
//         $request->validate([
//             'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
//         ]);

//         $user = Auth::user();
//         if (!$user) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }

//         if ($user->image && Storage::disk('public')->exists($user->image)) {
//             Storage::disk('public')->delete($user->image);
//         }

//         // Compress and store the image
//         $image = Image::make($request->file('image'))->resize(300, 300, function ($constraint) {
//             $constraint->aspectRatio();
//             $constraint->upsize();
//         })->encode('jpg', 80);

//         $filename = 'profile_images/' . uniqid() . '.jpg';
//         Storage::disk('public')->put($filename, $image);

//         $user->image = $filename;
//         $user->save();

//         return response()->json([
//             'message' => 'Profile image uploaded successfully',
//             'image_url' => asset('storage/' . $filename),
//         ], 200);
//     } catch (\Illuminate\Validation\ValidationException $e) {
//         return response()->json([
//             'message' => 'Validation failed',
//             'errors' => $e->errors(),
//         ], 422);
//     } catch (\Throwable $e) {
//         Log::error('Profile image upload failed', [
//             'error' => $e->getMessage(),
//             'trace' => $e->getTraceAsString(),
//         ]);
//         return response()->json([
//             'message' => 'Failed to upload profile image',
//             'error' => $e->getMessage(),
//         ], 500);
//     }
// }


    // Delete a user
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
