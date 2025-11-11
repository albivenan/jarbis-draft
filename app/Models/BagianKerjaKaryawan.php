<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BagianKerjaKaryawan extends Model
{
    use HasFactory;

    protected $table = 'bagian_kerja_karyawan';
    protected $primaryKey = 'id_bagian_kerja';
    public $incrementing = true; // Assuming it's auto-incrementing
    protected $keyType = 'int'; // Assuming primary key is integer
}
