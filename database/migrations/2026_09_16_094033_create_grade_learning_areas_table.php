<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grade_learning_areas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grade_id')->constrained()->onDelete('cascade');
            $table->foreignId('learning_area_id')->constrained()->onDelete('cascade');
            // Null = compulsory for every student in this grade.
            // Set = only for students on this pathway (Senior School only).
            $table->foreignId('pathway_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->onDelete('set null');
            $table->timestamps();

            $table->unique(['grade_id', 'learning_area_id', 'pathway_id'], 'grade_learning_area_pathway_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grade_learning_areas');
    }
};