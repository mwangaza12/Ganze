<?php

namespace Database\Seeders;

use App\Models\ClassModel;
use App\Models\Stream;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Creates one demo class, one stream, and one demo student, matching
     * the real students/classes/streams schema.
     */
    public function run(): void
    {
        $class = ClassModel::firstOrCreate(
            ['name' => 'Form 1'],
            ['level' => 1, 'capacity' => 45]
        );

        $stream = Stream::firstOrCreate(
            ['class_id' => $class->id, 'name' => '1E'],
            ['capacity' => 45]
        );

        $user = User::firstOrCreate(
            ['email' => 'ADM0001@student.school.ke'],
            [
                'name' => 'John Doe',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_STUDENT,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        Student::firstOrCreate(
            ['admission_number' => 'ADM0001'],
            [
                'user_id' => $user->id,
                'first_name' => 'John',
                'last_name' => 'Doe',
                'gender' => 'male',
                'date_of_birth' => '2010-05-15',
                'admission_date' => now()->subYear(),
                'class_id' => $class->id,
                'stream_id' => $stream->id,
                'status' => 'active',
            ]
        );
    }
}