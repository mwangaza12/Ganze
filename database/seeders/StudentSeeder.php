<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('students')->insert([
            'name' => 'John Doe',
            'date_of_birth' => '2010-05-15',
            'parent_name' => 'Jane Doe',
            'parent_contact' => '0712345678',
            'parent_email' => 'doe@gmail.com',
            'previous_school' => 'Sunshine Primary',
            'kcpe_marks' => 350,
            'form' => '1E',
        ]);
    }
}
