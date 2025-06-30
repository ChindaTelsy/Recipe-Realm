<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Region;
use Illuminate\Database\Seeder;

class RegionSeeder extends Seeder
{
    public function run(): void
    {
        $regions = [
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
            'none',
        ];

        foreach ($regions as $region) {
            Region::create(['name' => $region]);
        }
    }
}
