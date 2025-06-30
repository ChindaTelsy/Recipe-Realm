<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'       => $this->id,
            'name'     => $this->name,
            'email'    => $this->email,
            'bio'      => $this->bio,
            'location' => $this->location,
            'profileImage' => $this->profileImage,
            'joinDate'     => $this->created_at?->toISOString(),

            'stats' => [
                'recipes'   => $this->recipes->count(),
                'likes'     => $this->likedRecipes->count(),
                'avgRating' => $this->recipes->avg('rating') ?? 0,
            ],

            'recipes' => $this->whenLoaded('recipes', function () {
                return $this->recipes->map(function ($recipe) {
                    return [
                        'id'          => $recipe->id,
                        'title'       => $recipe->title,
                        'image'       => $recipe->image_path 
                                            ? (str_starts_with($recipe->image_path, 'http') 
                                                ? $recipe->image_path 
                                                : asset('storage/' . $recipe->image_path)) 
                                            : null,
                        'description' => $recipe->description,
                        'rating'      => $recipe->rating,
                        'region'      => optional($recipe->region)->name,
                        'userId'      => $recipe->user_id,
                    ];
                });
            }),

            'likedRecipes' => $this->whenLoaded('likedRecipes', function () {
                return $this->likedRecipes->map(function ($recipe) {
                    return [
                        'id'          => $recipe->id,
                        'title'       => $recipe->title,
                        'image'       => $recipe->image_path 
                                            ? (str_starts_with($recipe->image_path, 'http') 
                                                ? $recipe->image_path 
                                                : asset('storage/' . $recipe->image_path)) 
                                            : null,
                        'description' => $recipe->description,
                        'rating'      => $recipe->rating,
                        'region'      => optional($recipe->region)->name,
                        'userId'      => $recipe->user_id,
                    ];
                });
            }),
        ];
    }
}
