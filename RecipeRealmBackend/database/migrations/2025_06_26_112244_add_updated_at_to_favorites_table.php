<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::table('favorites', function (Blueprint $table) {
        $table->timestamp('updated_at')->nullable();
    });
}
};
