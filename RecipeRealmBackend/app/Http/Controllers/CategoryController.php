<?php

namespace App\Http\Controllers;
use App\Models\Category;

use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function getCategories()
{
    return Category::select('id', 'name')->get();
}
}
