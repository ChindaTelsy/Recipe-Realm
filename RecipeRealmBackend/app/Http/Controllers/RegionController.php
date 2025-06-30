<?php

namespace App\Http\Controllers;

use App\Models\Region;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RegionController extends Controller
{
    public function index()
    {
        try {
            $regions = Region::select('id', 'name')->get();
            if ($regions->isEmpty()) {
                Log::warning('No regions found in the database.');
                return response()->json(['message' => 'No regions available'], 404);
            }
            return response()->json($regions);
        } catch (\Exception $e) {
            Log::error('Error fetching regions: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Internal server error while fetching regions', 'error' => $e->getMessage()], 500);
        }
    }
}