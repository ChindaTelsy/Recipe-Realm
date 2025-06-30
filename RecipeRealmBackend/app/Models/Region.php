<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Region extends Model
{

    use HasFactory;

    protected $fillable = ['name'];

        // Region.php
    public function recipes(): HasMany
    {
        return $this->hasMany(Recipe::class);
    }

}
