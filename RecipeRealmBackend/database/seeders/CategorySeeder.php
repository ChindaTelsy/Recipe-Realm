<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'North West',
            'South West',
            'Littoral',
            'Centre',
            'Far North',
            'West',
            'South',
            'North',
            'East',
            'Adamawa',
            'West African',
            'Central African',
            'North African',
            'Vegetarian',
            'Quick & Easy',
            'Street Food',
            'International',
            'Snacks',
            'Breakfasts',
            'Desserts',
            'Drinks',
        ];

        foreach ($categories as $category) {
            Category::create(['name' => $category]);
        }
    }
}