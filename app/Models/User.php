<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    /**
     * The roles that are available in the system.
     *
     * @var array<string>
     */
    public const ROLES = [
        'admin' => 'Administrator',
        'direktur' => 'Direktur',
        'hrd' => 'HRD',
        'finance' => 'Finance',
        'ppic' => 'PPIC',
        'employee' => 'Employee',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'id_karyawan',
        'last_login_at',
        'last_login_ip',
        'employment_status',
    ];

    // Relationships untuk sistem role hybrid (user_roles + users.role)
    public function userRoles()
    {
        return $this->hasMany(UserRole::class, 'id_karyawan', 'id_karyawan');
    }
    
    public function identitasKaryawan()
    {
        return $this->hasOne(IdentitasKaryawan::class, 'id_karyawan', 'id_karyawan');
    }

    public function rincianPekerjaan()
    {
        return $this->hasOne(RincianPekerjaan::class, 'id_karyawan', 'id_karyawan');
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'id_karyawan', 'id_role');
    }

    // Get role with a hybrid system: user_roles > users.role > IdentitasKaryawan->getRole()
    public function getRoleAttribute($value)
    {
        // Priority 1: Check the new user_roles table first.
        if ($this->id_karyawan) {
            $userRole = $this->userRoles()->first(); // No need to eager load role, just need id_role
            if ($userRole && $userRole->id_role) {
                $roleKey = self::getRoleKeyFromId($userRole->id_role);
                if ($roleKey) {
                    return $roleKey;
                }
            }
        }

        // Priority 2: Fallback to the old enum value in the users table.
        if ($value && $value !== 'crew') {
            return $value;
        }

        // Priority 3: Fallback to a legacy method in IdentitasKaryawan (if it exists).
        if ($this->identitasKaryawan && method_exists($this->identitasKaryawan, 'getRole')) {
            $legacyRole = $this->identitasKaryawan->getRole();
            if ($legacyRole && $legacyRole !== 'crew') {
                return $legacyRole;
            }
        }

        // Default fallback.
        return 'crew';
    }

    /**
     * Maps a role ID to its string key representation.
     * Kept as a static private function for clarity and potential reuse.
     */
    private static function getRoleKeyFromId($roleId): ?string
    {
        $roleMapping = [
            1 => 'direktur',
            2 => 'manajer_hrd',
            3 => 'staf_hrd',
            4 => 'manajer_marketing',
            5 => 'staf_marketing',
            6 => 'manajer_keuangan',
            7 => 'staf_keuangan',
            8 => 'manajer_ppic',
            9 => 'staf_ppic',
            10 => 'software_engineer',
            11 => 'manajer_produksi_kayu',
            12 => 'supervisor_kayu',
            13 => 'qc_kayu',
            14 => 'crew_kayu',
            15 => 'manajer_produksi_besi',
            16 => 'supervisor_besi',
            17 => 'qc_besi',
            18 => 'crew_besi'
        ];
        
        return $roleMapping[$roleId] ?? null;
    }

    // Helper methods for role checking
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isDirector(): bool
    {
        return $this->role === 'direktur';
    }

    public function isHRD(): bool
    {
        return $this->role === 'hrd';
    }

    public function isFinance(): bool
    {
        return $this->role === 'finance';
    }

    public function isPPIC(): bool
    {
        return $this->role === 'ppic';
    }

    public function isEmployee(): bool
    {
        return $this->role === 'employee';
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */

    /**
     * Scope a query to only include users with a specific role.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $role
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeRole($query, $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Check if the user has a specific role.
     *
     * @param  string  $role
     * @return bool
     */
    public function hasRole($role)
    {
        return $this->role === $role;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
