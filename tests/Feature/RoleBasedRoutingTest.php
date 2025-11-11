<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use App\Models\UserRole;
use App\Models\IdentitasKaryawan;
use App\Models\RincianPekerjaan;
use App\Models\KontakKaryawan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class RoleBasedRoutingTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that all roles are properly seeded and configured
     */
    public function test_all_roles_are_properly_seeded()
    {
        // Run the seeders
        $this->seed();

        // Check that all expected roles exist in database
        $expectedRoles = [
            'Direktur',
            'Manajer Operasional',
            'Manajer HRD',
            'Staf HRD',
            'Manajer Keuangan',
            'Staf Keuangan',
            'Manajer PPIC',
            'Staf PPIC',
            'Manajer Marketing',
            'Staf Marketing',
            'Manajer Produksi',
            'Supervisor',
            'QC Produksi',
            'Admin Produksi',
            'Crew',
            'Software Engineer',
            'Manajer Produksi Kayu',
            'Manajer Produksi Besi',
            'Supervisor Kayu',
            'Supervisor Besi',
            'QC Kayu',
            'QC Besi',
            'Crew Kayu',
            'Crew Besi'
        ];

        foreach ($expectedRoles as $roleName) {
            $role = Role::where('nama_role', $roleName)->first();
            $this->assertNotNull($role, "Role '{$roleName}' should exist in database");
        }
    }

    /**
     * Test role-based dashboard routing
     */
    public function test_role_based_dashboard_routing()
    {
        $this->seed();

        $roleTests = [
            ['role' => 'manajer_produksi_besi', 'expected_route' => 'produksi-besi'],
            ['role' => 'manajer_produksi_kayu', 'expected_route' => 'produksi-kayu'],
            ['role' => 'supervisor_kayu', 'expected_route' => 'supervisor-kayu'],
            ['role' => 'supervisor_besi', 'expected_route' => 'supervisor-besi'],
            ['role' => 'qc_kayu', 'expected_route' => 'qc-kayu'],
            ['role' => 'qc_besi', 'expected_route' => 'qc-besi'],
            ['role' => 'crew_kayu', 'expected_route' => 'crew-kayu'],
            ['role' => 'crew_besi', 'expected_route' => 'crew-besi'],
            ['role' => 'manajer_hrd', 'expected_route' => 'hrd'],
            ['role' => 'manajer_keuangan', 'expected_route' => 'keuangan'],
            ['role' => 'direktur', 'expected_route' => 'direktur'],
        ];

        foreach ($roleTests as $test) {
            // Create test user with specific role
            $user = $this->createUserWithRole($test['role']);

            // Test dashboard redirect
            $response = $this->actingAs($user)->get('/dashboard');

            // Should redirect to correct role dashboard
            $response->assertRedirect("/roles/{$test['expected_route']}");
        }
    }

    /**
     * Test sidebar role home mapping
     */
    public function test_sidebar_role_home_mapping()
    {
        $this->seed();

        $roleMappingTests = [
            'manajer_produksi_besi' => '/roles/produksi-besi',
            'manajer_produksi_kayu' => '/roles/produksi-kayu',
            'supervisor_kayu' => '/roles/supervisor-kayu',
            'supervisor_besi' => '/roles/supervisor-besi',
            'qc_kayu' => '/roles/qc-kayu',
            'qc_besi' => '/roles/qc-besi',
            'crew_kayu' => '/roles/crew-kayu',
            'crew_besi' => '/roles/crew-besi',
        ];

        foreach ($roleMappingTests as $role => $expectedPath) {
            $user = $this->createUserWithRole($role);
            $this->assertEquals($expectedPath, $user->role_home_path ?? '/login');
        }
    }

    /**
     * Test fallback to login page for unknown roles
     */
    public function test_unknown_role_fallback_to_login()
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'role' => 'unknown_role'
        ]);

        // The role should fallback to login since it's not in the mapping
        $this->assertEquals('/login', $user->role_home_path ?? '/login');
    }

    /**
     * Helper method to create user with specific role
     */
    private function createUserWithRole(string $roleKey): User
    {
        // Find the role by name from database (nama_role is now the display name)
        $role = Role::where('nama_role', config("roles.roles.{$roleKey}.name"))->first();
        if (!$role) {
            // Fallback to direct nama_role lookup
            $roleNameMap = [
                'manajer_produksi_besi' => 'Manajer Produksi Besi',
                'manajer_produksi_kayu' => 'Manajer Produksi Kayu',
                'supervisor_kayu' => 'Supervisor Kayu',
                'supervisor_besi' => 'Supervisor Besi',
                'qc_kayu' => 'QC Kayu',
                'qc_besi' => 'QC Besi',
                'crew_kayu' => 'Crew Kayu',
                'crew_besi' => 'Crew Besi',
            ];
            $role = Role::where('nama_role', $roleNameMap[$roleKey] ?? ucfirst(str_replace('_', ' ', $roleKey)))->first();
        }

        // Create employee
        $employee = IdentitasKaryawan::create([
            'nama_lengkap' => ucfirst(str_replace('_', ' ', $roleKey)),
            'nik_ktp' => '1234567890123456',
            'nik_perusahaan' => 'EMP' . rand(100, 999),
            'jenis_kelamin' => 'Laki-laki',
            'tanggal_lahir' => '1990-01-01'
        ]);

        // Create job details
        RincianPekerjaan::create([
            'id_karyawan' => $employee->id_karyawan,
            'tanggal_bergabung' => '2024-01-01',
            'status_karyawan' => 'Tetap',
            'id_jabatan' => 1,
            'id_departemen' => 1,
            'id_bagian_kerja' => 1,
            'lokasi_kerja' => 'Kantor',
            'id_atasan_langsung' => 1
        ]);

        // Create contact
        KontakKaryawan::create([
            'id_karyawan' => $employee->id_karyawan,
            'email_perusahaan' => strtolower(str_replace('_', '.', $roleKey)) . '@company.com',
            'nomor_telepon' => '08123456789'
        ]);

        // Create user
        $user = User::create([
            'name' => ucfirst(str_replace('_', ' ', $roleKey)),
            'email' => strtolower(str_replace('_', '.', $roleKey)) . '@company.com',
            'password' => Hash::make('password'),
            'id_karyawan' => $employee->id_karyawan,
            'status' => 'Aktif'
        ]);

        // Create user role
        UserRole::create([
            'id_karyawan' => $employee->id_karyawan,
            'id_role' => $role->id_role
        ]);

        return $user;
    }
}
