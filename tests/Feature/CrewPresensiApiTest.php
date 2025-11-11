<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Jadwal;
use App\Models\Presensi;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class CrewPresensiApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $crewKayu;
    protected $crewBesi;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create test users
        $this->crewKayu = User::factory()->create([
            'role' => 'crew_kayu',
            'name' => 'Test Crew Kayu',
            'email' => 'crew.kayu@test.com'
        ]);
        
        $this->crewBesi = User::factory()->create([
            'role' => 'crew_besi', 
            'name' => 'Test Crew Besi',
            'email' => 'crew.besi@test.com'
        ]);
    }

    public function test_crew_can_checkin_with_gps_location()
    {
        // Create schedule for today
        $jadwal = Jadwal::create([
            'id_user' => $this->crewKayu->id,
            'tanggal' => now()->format('Y-m-d'),
            'shift' => 'pagi',
            'jam_masuk' => '08:00:00',
            'jam_keluar' => '16:00:00',
            'status' => 'aktif'
        ]);

        $response = $this->actingAs($this->crewKayu)
            ->postJson('/api/presensi/checkin', [
                'id_jadwal' => $jadwal->id,
                'latitude' => -6.2088,
                'longitude' => 106.8456,
                'lokasi_presensi' => 'Area Kerja Crew Kayu'
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Check-in berhasil'
            ]);

        // Verify presensi record created
        $this->assertDatabaseHas('presensi', [
            'id_jadwal' => $jadwal->id,
            'id_user' => $this->crewKayu->id,
            'latitude' => -6.2088,
            'longitude' => 106.8456,
            'lokasi_presensi' => 'Area Kerja Crew Kayu'
        ]);
    }

    public function test_crew_can_checkout_after_checkin()
    {
        // Create schedule and presensi
        $jadwal = Jadwal::create([
            'id_user' => $this->crewBesi->id,
            'tanggal' => now()->format('Y-m-d'),
            'shift' => 'siang',
            'jam_masuk' => '14:00:00',
            'jam_keluar' => '22:00:00',
            'status' => 'aktif'
        ]);

        // First checkin
        $this->actingAs($this->crewBesi)
            ->postJson('/api/presensi/checkin', [
                'id_jadwal' => $jadwal->id,
                'latitude' => -6.2088,
                'longitude' => 106.8456,
                'lokasi_presensi' => 'Area Kerja Crew Besi'
            ]);

        // Then checkout
        $response = $this->actingAs($this->crewBesi)
            ->postJson('/api/presensi/checkout');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Check-out berhasil'
            ]);

        // Verify checkout time recorded
        $this->assertDatabaseHas('presensi', [
            'id_jadwal' => $jadwal->id,
            'id_user' => $this->crewBesi->id
        ]);
    }

    public function test_crew_cannot_checkin_without_schedule()
    {
        $response = $this->actingAs($this->crewKayu)
            ->postJson('/api/presensi/checkin', [
                'id_jadwal' => 999, // Non-existent schedule
                'latitude' => -6.2088,
                'longitude' => 106.8456
            ]);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Jadwal tidak ditemukan'
            ]);
    }

    public function test_crew_cannot_checkin_twice()
    {
        $jadwal = Jadwal::create([
            'id_user' => $this->crewKayu->id,
            'tanggal' => now()->format('Y-m-d'),
            'shift' => 'pagi',
            'jam_masuk' => '08:00:00',
            'jam_keluar' => '16:00:00',
            'status' => 'aktif'
        ]);

        // First checkin
        $this->actingAs($this->crewKayu)
            ->postJson('/api/presensi/checkin', [
                'id_jadwal' => $jadwal->id,
                'latitude' => -6.2088,
                'longitude' => 106.8456
            ]);

        // Second checkin attempt
        $response = $this->actingAs($this->crewKayu)
            ->postJson('/api/presensi/checkin', [
                'id_jadwal' => $jadwal->id,
                'latitude' => -6.2088,
                'longitude' => 106.8456
            ]);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Anda sudah melakukan check-in hari ini'
            ]);
    }

    public function test_today_status_api_returns_correct_data()
    {
        $jadwal = Jadwal::create([
            'id_user' => $this->crewKayu->id,
            'tanggal' => now()->format('Y-m-d'),
            'shift' => 'pagi',
            'jam_masuk' => '08:00:00',
            'jam_keluar' => '16:00:00',
            'status' => 'aktif'
        ]);

        $response = $this->actingAs($this->crewKayu)
            ->getJson('/api/presensi/today-status');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'schedule' => [
                    'id_jadwal',
                    'shift',
                    'jam_masuk',
                    'jam_keluar'
                ],
                'has_checkedin',
                'has_checkedout',
                'can_checkin',
                'can_checkout',
                'checkin_time',
                'checkout_time',
                'attendance_status'
            ]);
    }

    public function test_schedule_api_returns_monthly_data()
    {
        // Create multiple schedules for the month
        for ($i = 1; $i <= 5; $i++) {
            Jadwal::create([
                'id_user' => $this->crewBesi->id,
                'tanggal' => now()->startOfMonth()->addDays($i)->format('Y-m-d'),
                'shift' => $i % 2 == 0 ? 'pagi' : 'siang',
                'jam_masuk' => $i % 2 == 0 ? '08:00:00' : '14:00:00',
                'jam_keluar' => $i % 2 == 0 ? '16:00:00' : '22:00:00',
                'status' => 'aktif'
            ]);
        }

        $response = $this->actingAs($this->crewBesi)
            ->getJson('/api/schedules?' . http_build_query([
                'month' => now()->format('Y-m'),
                'view' => 'month'
            ]));

        $response->assertStatus(200)
            ->assertJsonCount(5, 'schedules');
    }

    public function test_gps_location_validation()
    {
        $jadwal = Jadwal::create([
            'id_user' => $this->crewKayu->id,
            'tanggal' => now()->format('Y-m-d'),
            'shift' => 'pagi',
            'jam_masuk' => '08:00:00',
            'jam_keluar' => '16:00:00',
            'status' => 'aktif'
        ]);

        // Test without GPS coordinates
        $response = $this->actingAs($this->crewKayu)
            ->postJson('/api/presensi/checkin', [
                'id_jadwal' => $jadwal->id
            ]);

        // Should still work but without location
        $response->assertStatus(200);
    }

    public function test_attendance_status_calculation()
    {
        $jadwal = Jadwal::create([
            'id_user' => $this->crewBesi->id,
            'tanggal' => now()->format('Y-m-d'),
            'shift' => 'pagi',
            'jam_masuk' => '08:00:00',
            'jam_keluar' => '16:00:00',
            'status' => 'aktif'
        ]);

        // Check-in on time
        $this->actingAs($this->crewBesi)
            ->postJson('/api/presensi/checkin', [
                'id_jadwal' => $jadwal->id,
                'latitude' => -6.2088,
                'longitude' => 106.8456
            ]);

        $response = $this->actingAs($this->crewBesi)
            ->getJson('/api/presensi/today-status');

        $response->assertStatus(200)
            ->assertJsonPath('attendance_status', 'hadir');
    }
}
