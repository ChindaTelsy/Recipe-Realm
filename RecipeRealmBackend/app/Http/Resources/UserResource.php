<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
public function toArray($request)
    {
        // Get liked recipe IDs for convenience
        $likedIds = $this->likedRecipes->pluck('id')->toArray();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'bio' => $this->bio,
            'location' => $this->location,
            'profileImage' => $this->profileImage,
            'joinDate' => $this->created_at?->toISOString(),

            'stats' => [
                'recipes' => $this->recipes->count(),
                'likes' => $this->likedRecipes->count(),
                'avgRating' => $this->recipes->avg('rating') ?? 0,
            ],

            'likedIds' => $likedIds,

            // Use RecipeResource to keep structure consistent
            'recipes' => RecipeResource::collection(
                $this->whenLoaded('recipes')
            ),

            'likedRecipes' => RecipeResource::collection(
                $this->whenLoaded('likedRecipes')
            ),
        ];
    }
}

