<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use HasFactory;

    protected $table = 'user_roles';
    protected $primaryKey = 'id_user_role';
    public $timestamps = false;

    protected $fillable = [
        'id_karyawan',
        'id_role'
    ];

    // Relationships
    public function identitasKaryawan()
    {
        return $this->belongsTo(IdentitasKaryawan::class, 'id_karyawan', 'id_karyawan');
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'id_role', 'id_role');
    }
}