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
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('admission_number', 50)->unique();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->enum('gender', ['male', 'female']);
            $table->date('date_of_birth');
            $table->date('admission_date');
            $table->foreignId('class_id')->constrained()->onDelete('restrict');
            $table->foreignId('stream_id')->nullable()->constrained()->onDelete('set null');
            $table->string('birth_certificate_number', 50)->nullable();
            $table->text('medical_conditions')->nullable();
            $table->text('allergies')->nullable();
            $table->text('address')->nullable();
            $table->string('county')->nullable();
            $table->string('sub_county')->nullable();
            $table->enum('status', ['active', 'transferred', 'graduated', 'expelled', 'withdrawn'])->default('active');
            $table->text('photo')->nullable();
            $table->timestamps();
            $table->softDeletes();
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
