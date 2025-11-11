<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $table = 'roles';
    protected $primaryKey = 'id_role';
    public $timestamps = false;

    protected $fillable = [
        'nama_role',
        'deskripsi_role'
    ];

    // Relationships
    public function userRoles()
    {
        return $this->hasMany(UserRole::class, 'id_role', 'id_role');
    }

    /**
     * Get the role key from config based on nama_role
     */
    public function getRoleKeyAttribute()
    {
        $roles = config('roles.roles');
        foreach ($roles as $key => $role) {
            if (isset($role['name']) && strtolower($role['name']) === strtolower($this->nama_role)) {
                return $role['route'] ?? strtolower(str_replace(' ', '-', $this->nama_role));
            }
        }
        return strtolower(str_replace(' ', '-', $this->nama_role));
    }
}