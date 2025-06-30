<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'bio' => $this->bio,
            'location' => $this->location,
            'profileImage' => $this->profileImage, // Assuming this is a column or accessor
            'joinDate' => $this->created_at, // Matches formattedJoinDate
            'stats' => [
                'recipes' => $this->recipes->count(),
                'likes' => $this->likedRecipes->count(), // Assuming a likedRecipes relationship
                'avgRating' => $this->recipes->avg('rating') ?? 0,
            ],
            'recipes' => $this->whenLoaded('recipes', function () {
                return $this->recipes->map(function ($recipe) {
                    return [
                        'id' => $recipe->id,
                        'title' => $recipe->title,
                        'image' => $recipe->image_path, // Adjust based on your column name
                        'description' => $recipe->description,
                        'rating' => $recipe->rating,
                        'region' => $recipe->region->name ?? null, // Adjust if region is a relationship
                        'userId' => $recipe->user_id,
                    ];
                });
            }),
            'likedRecipes' => $this->whenLoaded('likedRecipes', function () {
                return $this->likedRecipes->map(function ($recipe) {
                    return [
                        'id' => $recipe->id,
                        'title' => $recipe->title,
                        'image' => $recipe->image_path,
                        'description' => $recipe->description,
                        'rating' => $recipe->rating,
                        'region' => $recipe->region->name ?? null,
                        'userId' => $recipe->user_id,
                    ];
                });
            }),
        ];
    }
}
