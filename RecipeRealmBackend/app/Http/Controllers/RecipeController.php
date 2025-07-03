<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\Rating;
use Illuminate\Support\Facades\Storage;


class RecipeController extends Controller
{
public function index(Request $request)
{
    try {
        $user = Auth::user();

        if (!$user) {
            // Public users see only welcome-visible recipes
            $recipes = Recipe::with(['category', 'region', 'reviews'])
                ->whereIn('visible_on', ['welcome', 'both'])
                ->get();
        } else {
            // Authenticated users see their own + home-visible recipes
            $recipes = Recipe::with(['user', 'category', 'region', 'ratings', 'favoritedBy', 'reviews'])
                ->where(function ($query) use ($user) {
                    $query->where('user_id', $user->id)
                          ->orWhereIn('visible_on', ['home', 'both']);
                })
                ->get();
        }

    

        return response()->json([
            'message' => 'Recipes fetched successfully',
            'recipes' => $recipes,
        ], 200);

    } catch (\Exception $e) {
        Log::error('Recipe fetch error: ' . $e->getMessage(), [
            'stack' => $e->getTraceAsString(),
        ]);

        return response()->json([
            'message' => 'Server error',
            'error' => $e->getMessage(),
        ], 500);
    }
}

 
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        

        try {
            // Initial validation
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'ingredients' => 'required|string',
                'steps' => 'required|string',
                'category_id' => 'required|exists:categories,id',
                'region_id' => 'required|exists:regions,id',
                'min_price' => 'required|numeric|min:0',
                'cook_time' => 'required|string',
                'prep_time' => 'required|string',
                'visible_on' => 'required|in:home,welcome,both',
                'image_path' => 'nullable|image|max:5120',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            // Validate JSON format for ingredients and steps
            $ingredients = json_decode($request->input('ingredients'), true);
            $steps = json_decode($request->input('steps'), true);

            $errors = [];
            if (json_last_error() !== JSON_ERROR_NONE || !is_array($ingredients) || empty($ingredients)) {
                $errors['ingredients'] = ['The ingredients must be a valid JSON array and cannot be empty.'];
            }
            if (json_last_error() !== JSON_ERROR_NONE || !is_array($steps) || empty($steps)) {
                $errors['steps'] = ['The steps must be a valid JSON array and cannot be empty.'];
            }

            if (!empty($errors)) {
                throw ValidationException::withMessages($errors);
            }

            $imagePath = null;

if ($request->hasFile('image_path')) {
    $image = $request->file('image_path');
    $imagePath = $image->store('recipes', 'public'); // stores in storage/app/public/recipes
}
     
$recipe = new Recipe();
$recipe->title = $request->input('title');
$recipe->description = $request->input('description');
$recipe->ingredients = json_encode($ingredients);
$recipe->steps = json_encode($steps);
$recipe->category_id = $request->input('category_id');
$recipe->region_id = $request->input('region_id');
$recipe->min_price = $request->input('min_price');
$recipe->cook_time = $request->input('cook_time');
$recipe->prep_time = $request->input('prep_time');
$recipe->visible_on = $request->input('visible_on');
$recipe->image_path = $imagePath;
$recipe->user_id = $user->id;
if ($imagePath) {
    $recipe->image_path = $imagePath;
}

$recipe->save();

    return response()->json([
    'message' => 'Recipe saved successfully',
    'recipe' => $recipe->load('region')
], 201);
        } catch (ValidationException $e) {
            Log::error('Validation error creating recipe: ' . $e->getMessage(), [
                'errors' => $e->errors(),
                'request' => $request->all(),
            ]);
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Failed to create recipe: ' . $e->getMessage(), [
                'request' => $request->all(),
                'stack' => $e->getTraceAsString(),
            ]);
            return response()->json(['message' => 'Server error: ' . $e->getMessage()], 500);
        }
    }

    public function userRecipes($userId)
    {
        try {
            return Recipe::with(['user', 'category', 'region', 'ratings', 'favoritedBy'])
                ->where('user_id', $userId)
                ->get();
        } catch (\Exception $e) {
            Log::error('User recipes fetch error: ' . $e->getMessage());
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }

public function likeRecipe(Request $request, Recipe $recipe)
{
    $user = $request->user();

    if (!$user) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    // Check if the recipe is already liked
    $wasLiked = $user->likedRecipes()->where('recipe_id', $recipe->id)->exists();

    // Toggle the like
    $user->likedRecipes()->toggle($recipe->id);

    // Refresh recipe relationships in case you need nested data
    $recipe->load('region');

    // Optional: Recalculate rating if you store rating separately

    \Log::debug('Like toggled', [
        'user_id' => $user->id,
        'recipe_id' => $recipe->id,
        'action' => $wasLiked ? 'unliked' : 'liked',
    ]);

    return response()->json([
        'message' => $wasLiked ? 'Unliked' : 'Liked',
        'liked' => !$wasLiked,
        'recipe' => [
            'id' => $recipe->id,
            'title' => $recipe->title,
            'image' => $recipe->image_path
                ? (str_starts_with($recipe->image_path, 'http')
                    ? $recipe->image_path
                    : asset('storage/' . $recipe->image_path))
                : asset('images/default-recipe.png'),
            'description' => $recipe->description,
            'rating' => $recipe->rating,
            'region' => optional($recipe->region)->name,
            'userId' => $recipe->user_id,
            'liked' => !$wasLiked,
        ],
    ]);
}


public function rate(Recipe $recipe, Request $request)
{
    $request->validate([
        'rating' => 'required|integer|min:1|max:5',
    ]);

    $user = $request->user();

    $rating = Rating::updateOrCreate(
        [
            'user_id' => $user->id,
            'recipe_id' => $recipe->id,
        ],
        [
            'score' => $request->rating  // ✅ Must match actual DB column name
        ]
    );

    return response()->json([
        'message' => 'Rated',
        'rating' => $rating->score  // Also update here to return the right field
    ]);
}

    public function destroy($id)
    {
        $recipe = Recipe::findOrFail($id);
        if ($recipe->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($recipe->image_path) {
            Storage::disk('public')->delete($recipe->image_path);
        }
        $recipe->delete();
        return response()->json(['message' => 'Recipe deleted successfully']);
    }
}