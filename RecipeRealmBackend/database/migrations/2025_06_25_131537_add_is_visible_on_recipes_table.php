<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up()
    {
        Schema::table('recipes', function (Blueprint $table) {
            $table->enum('visible_on', ['welcome', 'home', 'both'])->default('home');
        });
    }

    public function down()
    {
        Schema::table('recipes', function (Blueprint $table) {
            $table->dropColumn('visible_on');
        });
    }
};
