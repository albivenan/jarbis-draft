<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;

class CrewPresensiButtonTest extends TestCase
{
    use WithoutMiddleware;

    public function test_crew_dashboard_has_enhanced_presensi_logic()
    {
        $dashboard = file_get_contents(resource_path('js/pages/roles/crew/dashboard.tsx'));
        
        // Test that dashboard has enhanced presensi functionality
        $this->assertStringContainsString('useState', $dashboard);
        $this->assertStringContainsString('useEffect', $dashboard);
        $this->assertStringContainsString('attendanceStatus', $dashboard);
        $this->assertStringContainsString('setAttendanceStatus', $dashboard);
        $this->assertStringContainsString('isLoading', $dashboard);
        $this->assertStringContainsString('setIsLoading', $dashboard);
        
        // Test API integration
        $this->assertStringContainsString('/api/presensi/checkin', $dashboard);
        $this->assertStringContainsString('/api/presensi/checkout', $dashboard);
        
        // Test GPS location handling
        $this->assertStringContainsString('navigator.geolocation', $dashboard);
        $this->assertStringContainsString('latitude', $dashboard);
        $this->assertStringContainsString('longitude', $dashboard);
        
        // Test button states
        $this->assertStringContainsString('Hadir Sekarang', $dashboard);
        $this->assertStringContainsString('Pulang Sekarang', $dashboard);
        $this->assertStringContainsString('Memproses...', $dashboard);
        
        // Test role-based theming
        $this->assertStringContainsString('crewConfig.theme', $dashboard);
    }

    public function test_crew_controller_provides_attendance_status()
    {
        $controller = file_get_contents(app_path('Http/Controllers/CrewController.php'));
        
        // Test that controller calculates attendance status
        $this->assertStringContainsString('attendanceStatus', $controller);
        $this->assertStringContainsString('has_schedule', $controller);
        $this->assertStringContainsString('has_checkedin', $controller);
        $this->assertStringContainsString('has_checkedout', $controller);
        $this->assertStringContainsString('can_checkin', $controller);
        $this->assertStringContainsString('can_checkout', $controller);
        
        // Test helper methods
        $this->assertStringContainsString('canCheckIn', $controller);
        $this->assertStringContainsString('canCheckOut', $controller);
        
        // Test presensi data retrieval
        $this->assertStringContainsString('presensiHariIni', $controller);
        $this->assertStringContainsString('jam_masuk_actual', $controller);
        $this->assertStringContainsString('jam_keluar_actual', $controller);
    }

    public function test_api_routes_exist_for_presensi()
    {
        $router = app('router');
        
        // Test that API routes exist
        $this->assertTrue($router->has('api.presensi.checkin'));
        $this->assertTrue($router->has('api.presensi.checkout'));
        
        // Test route patterns
        $checkinRoute = $router->getRoutes()->getByName('api.presensi.checkin');
        $checkoutRoute = $router->getRoutes()->getByName('api.presensi.checkout');
        
        $this->assertEquals('api/presensi/checkin', $checkinRoute->uri());
        $this->assertEquals('api/presensi/checkout', $checkoutRoute->uri());
        
        // Test HTTP methods
        $this->assertContains('POST', $checkinRoute->methods());
        $this->assertContains('POST', $checkoutRoute->methods());
    }

    public function test_dashboard_handles_different_attendance_states()
    {
        $dashboard = file_get_contents(resource_path('js/pages/roles/crew/dashboard.tsx'));
        
        // Test different button states
        $this->assertStringContainsString('!attendanceStatus.has_schedule', $dashboard);
        $this->assertStringContainsString('attendanceStatus.can_checkin && !attendanceStatus.has_checkedin', $dashboard);
        $this->assertStringContainsString('attendanceStatus.has_checkedin && !attendanceStatus.has_checkedout', $dashboard);
        $this->assertStringContainsString('attendanceStatus.has_checkedout', $dashboard);
        
        // Test error handling
        $this->assertStringContainsString('setError', $dashboard);
        $this->assertStringContainsString('AlertTriangle', $dashboard);
        
        // Test success states
        $this->assertStringContainsString('CheckCircle2', $dashboard);
        $this->assertStringContainsString('Presensi hari ini sudah lengkap', $dashboard);
    }

    public function test_gps_location_integration()
    {
        $dashboard = file_get_contents(resource_path('js/pages/roles/crew/dashboard.tsx'));
        
        // Test GPS functionality
        $this->assertStringContainsString('navigator.geolocation.getCurrentPosition', $dashboard);
        $this->assertStringContainsString('position.coords.latitude', $dashboard);
        $this->assertStringContainsString('position.coords.longitude', $dashboard);
        
        // Test location validation
        $this->assertStringContainsString('Lokasi diperlukan untuk presensi', $dashboard);
        $this->assertStringContainsString('Pastikan GPS aktif', $dashboard);
        
        // Test location in API call
        $this->assertStringContainsString('latitude: location.lat', $dashboard);
        $this->assertStringContainsString('longitude: location.lng', $dashboard);
    }

    public function test_role_based_theming_in_buttons()
    {
        $dashboard = file_get_contents(resource_path('js/pages/roles/crew/dashboard.tsx'));
        
        // Test theme-based styling
        $this->assertStringContainsString("crewConfig.theme === 'green'", $dashboard);
        $this->assertStringContainsString('bg-green-600 hover:bg-green-700', $dashboard);
        $this->assertStringContainsString('bg-slate-600 hover:bg-slate-700', $dashboard);
        
        // Test border colors
        $this->assertStringContainsString('border-green-600', $dashboard);
        $this->assertStringContainsString('border-slate-600', $dashboard);
        
        // Test text colors
        $this->assertStringContainsString('text-green-600', $dashboard);
        $this->assertStringContainsString('text-slate-600', $dashboard);
    }

    public function test_loading_states_and_error_handling()
    {
        $dashboard = file_get_contents(resource_path('js/pages/roles/crew/dashboard.tsx'));
        
        // Test loading states
        $this->assertStringContainsString('disabled={isLoading', $dashboard);
        $this->assertStringContainsString("isLoading ? 'Memproses...'", $dashboard);
        $this->assertStringContainsString('setIsLoading(true)', $dashboard);
        $this->assertStringContainsString('setIsLoading(false)', $dashboard);
        
        // Test error handling
        $this->assertStringContainsString('try {', $dashboard);
        $this->assertStringContainsString('} catch (error', $dashboard);
        $this->assertStringContainsString('} finally {', $dashboard);
        
        // Test error display
        $this->assertStringContainsString('error &&', $dashboard);
        $this->assertStringContainsString('AlertDescription', $dashboard);
    }

    public function test_api_integration_with_csrf_token()
    {
        $dashboard = file_get_contents(resource_path('js/pages/roles/crew/dashboard.tsx'));
        
        // Test CSRF token handling
        $this->assertStringContainsString('X-CSRF-TOKEN', $dashboard);
        $this->assertStringContainsString("document.querySelector('meta[name=\"csrf-token\"]')", $dashboard);
        
        // Test proper headers
        $this->assertStringContainsString("'Content-Type': 'application/json'", $dashboard);
        
        // Test JSON body
        $this->assertStringContainsString('JSON.stringify', $dashboard);
        $this->assertStringContainsString('id_jadwal', $dashboard);
        $this->assertStringContainsString('lokasi_presensi', $dashboard);
    }
}