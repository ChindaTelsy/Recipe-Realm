<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::table('recipes', function (Blueprint $table) {
        $table->string('cook_time')->nullable();
    });
}
};
