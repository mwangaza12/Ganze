<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('marks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->decimal('marks_obtained', 5, 2);
            $table->decimal('total_marks', 5, 2)->default(100);
            $table->string('grade', 5)->nullable(); // A, A-, B+, etc.
            $table->integer('points')->nullable(); // 12, 11, 10, etc.
            $table->integer('position')->nullable(); // Position in subject
            $table->text('remarks')->nullable();
            $table->foreignId('entered_by')->nullable()->constrained('teachers')->onDelete('set null');
            $table->timestamps();
            
            $table->unique(['exam_id', 'student_id', 'subject_id']);
            $table->index(['student_id', 'exam_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marks');
    }
};
