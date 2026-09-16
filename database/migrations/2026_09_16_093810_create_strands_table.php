<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('strands', function (Blueprint $table) {
            $table->id();
            $table->foreignId('learning_area_id')->constrained()->onDelete('cascade');
            $table->foreignId('grade_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('code', 30)->nullable();
            $table->unsignedInteger('sequence')->default(0);
            $table->timestamps();

            $table->unique(['learning_area_id', 'grade_id', 'name'], 'strands_area_grade_name_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('strands');
    }
};