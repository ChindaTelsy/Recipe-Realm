<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\Rating;
use App\Models\Category;
use App\Models\Region;

class Recipe extends Model
{
    use HasFactory;

  protected $fillable = [
        'title',
        'description',
        'ingredients',
        'steps',
        'category_id',
        'region_id',
        'min_price',
        'cook_time',
        'prep_time',
        'image_path',
        'user_id',
        'visible_on',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }

    public function reviews()
{
    return $this->hasMany(Review::class);
}

public function getImagePathAttribute($value)
{
    return $value ? asset('storage/' . $value) : null;
}

}
