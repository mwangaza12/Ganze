<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('education_level_id')->constrained()->onDelete('restrict');
            $table->string('name'); // "Grade 7", "Grade 10"
            $table->string('code', 20)->unique(); // "G7", "G10"
            $table->unsignedInteger('sequence')->default(0); // global order: PP1..Grade 12
            $table->unsignedInteger('capacity')->default(40);
            $table->boolean('has_pathways')->default(false); // true for Senior School grades
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};