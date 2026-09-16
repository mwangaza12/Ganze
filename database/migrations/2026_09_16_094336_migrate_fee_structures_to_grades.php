<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('fee_structures', function (Blueprint $table) {
            $table->dropForeign(['class_id']);
            $table->dropColumn('class_id');
        });

        Schema::table('fee_structures', function (Blueprint $table) {
            $table->foreignId('grade_id')->after('term_id')->constrained()->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('fee_structures', function (Blueprint $table) {
            $table->dropForeign(['grade_id']);
            $table->dropColumn('grade_id');
        });

        Schema::table('fee_structures', function (Blueprint $table) {
            $table->foreignId('class_id')->after('term_id')->constrained('classes')->onDelete('cascade');
        });
    }
};