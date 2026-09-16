<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendance', function (Blueprint $table) {
            $table->dropIndex(['date', 'class_id']);
            $table->dropForeign(['class_id']);
            $table->dropColumn('class_id');
        });

        Schema::table('attendance', function (Blueprint $table) {
            $table->foreignId('grade_id')->after('student_id')->constrained()->onDelete('cascade');
            $table->index(['date', 'grade_id']);
        });
    }

    public function down(): void
    {
        Schema::table('attendance', function (Blueprint $table) {
            $table->dropIndex(['date', 'grade_id']);
            $table->dropForeign(['grade_id']);
            $table->dropColumn('grade_id');
        });

        Schema::table('attendance', function (Blueprint $table) {
            $table->foreignId('class_id')->after('student_id')->constrained('classes')->onDelete('cascade');
            $table->index(['date', 'class_id']);
        });
    }
};