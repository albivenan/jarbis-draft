<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DashboardModule extends Model
{
    use HasFactory;

    protected $table = 'dashboard_modules';

    protected $fillable = [
        'nama_modul',
        'deskripsi',
        'icon',
        'route',
        'role',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
