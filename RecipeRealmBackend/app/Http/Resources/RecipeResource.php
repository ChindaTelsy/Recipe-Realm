<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RecipeResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'description' => $this->description,
            'image' => $this->image ? asset($this->image) : null,
            'ingredients' => is_string($this->ingredients) 
                ? json_decode($this->ingredients, true) 
                : $this->ingredients,
            'steps'       => is_string($this->steps) 
                ? json_decode($this->steps, true) 
                : $this->steps,
            'rating'      => $this->rating ?? 0,
            'region'      => optional($this->region)->name ?? 'unknown',
            'userId'      => $this->user_id,
            'liked'       => true, // you can adjust this dynamically if needed
            'createdAt'   => $this->created_at?->toISOString(),
        ];
    }
}
