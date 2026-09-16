<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('marks', function (Blueprint $table) {
            $table->dropUnique(['exam_id', 'student_id', 'subject_id']);
            $table->dropForeign(['subject_id']);
            $table->dropColumn('subject_id');
        });

        Schema::table('marks', function (Blueprint $table) {
            $table->foreignId('learning_area_id')->after('student_id')->constrained()->onDelete('cascade');
            $table->unique(['exam_id', 'student_id', 'learning_area_id'], 'marks_exam_student_area_unique');
        });
    }

    public function down(): void
    {
        Schema::table('marks', function (Blueprint $table) {
            $table->dropUnique('marks_exam_student_area_unique');
            $table->dropForeign(['learning_area_id']);
            $table->dropColumn('learning_area_id');
        });

        Schema::table('marks', function (Blueprint $table) {
            $table->foreignId('subject_id')->after('student_id')->constrained('subjects')->onDelete('cascade');
            $table->unique(['exam_id', 'student_id', 'subject_id']);
        });
    }
};