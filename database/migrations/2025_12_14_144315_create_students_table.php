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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('date_of_birth');
            $table->string('parent_name');
            $table->string('parent_contact');
            $table->enum('form', ['1E','2E','3E','4E','1W','2W','3W','4W','1N','2N','3N','4N','1S','2S','3S','4S']);
            $table->string('parent_email');
            $table->string('previous_school');
            $table->integer('kcpe_marks');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
