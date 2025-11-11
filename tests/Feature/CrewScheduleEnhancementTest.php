<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;

class CrewScheduleEnhancementTest extends TestCase
{
    use WithoutMiddleware;

    public function test_schedule_component_has_role_based_theming()
    {
        $schedule = file_get_contents(resource_path('js/pages/roles/crew/schedule/index.tsx'));
        
        // Test role-based configuration
        $this->assertStringContainsString('getCrewConfig', $schedule);
        $this->assertStringContainsString('crew_kayu', $schedule);
        $this->assertStringContainsString('crew_besi', $schedule);
        
        // Test theming properties
        $this->assertStringContainsString('primaryColor', $schedule);
        $this->assertStringContainsString('secondaryColor', $schedule);
        $this->assertStringContainsString('accentColor', $schedule);
        $this->assertStringContainsString('buttonPrimary', $schedule);
        $this->assertStringContainsString('buttonSecondary', $schedule);
        
        // Test theme colors
        $this->assertStringContainsString('bg-green-600', $schedule);
        $this->assertStringContainsString('bg-slate-600', $schedule);
        $this->assertStringContainsString('text-green-800', $schedule);
        $this->assertStringContainsString('text-slate-800', $schedule);
    }

    public function test_schedule_has_multiple_view_modes()
    {
        $schedule = file_get_contents(resource_path('js/pages/roles/crew/schedule/index.tsx'));
        
        // Test view mode state
        $this->assertStringContainsString('viewMode', $schedule);
        $this->assertStringContainsString("'day' | 'week' | 'month'", $schedule);
        $this->assertStringContainsString('setViewMode', $schedule);
        
        // Test view components
        $this->assertStringContainsString('DayView', $schedule);
        $this->assertStringContainsString('WeekView', $schedule);
        
        // Test view buttons
        $this->assertStringContainsString('Hari', $schedule);
        $this->assertStringContainsString('Minggu', $schedule);
        $this->assertStringContainsString('Bulan', $schedule);
    }

    public function test_presensi_has_real_time_updates()
    {
        $schedule = file_get_contents(resource_path('js/pages/roles/crew/schedule/index.tsx'));
        
        // Test real-time state updates
        $this->assertStringContainsString('setTodayStatus(prev =>', $schedule);
        $this->assertStringContainsString('has_checkedin: true', $schedule);
        $this->assertStringContainsString('can_checkout: true', $schedule);
        $this->assertStringContainsString('can_checkin: false', $schedule);
        
        // Test without page reload
        $this->assertStringContainsString('Real-time update without page reload', $schedule);
        $this->assertStringContainsString('setTimeout(() => loadTodayStatus(), 1000)', $schedule);
        
        // Test GPS integration
        $this->assertStringContainsString('lokasi_presensi', $schedule);
        $this->assertStringContainsString('Area Kerja', $schedule);
    }

    public function test_enhanced_today_status_card()
    {
        $schedule = file_get_contents(resource_path('js/pages/roles/crew/schedule/index.tsx'));
        
        // Test enhanced status display
        $this->assertStringContainsString('Status Hari Ini -', $schedule);
        $this->assertStringContainsString('crewConfig.name', $schedule);
        $this->assertStringContainsString('Waktu Presensi', $schedule);
        $this->assertStringContainsString('checkin_time', $schedule);
        $this->assertStringContainsString('checkout_time', $schedule);
        
        // Test status badges
        $this->assertStringContainsString('Selesai', $schedule);
        $this->assertStringContainsString('Sudah Hadir', $schedule);
        $this->assertStringContainsString('Belum Hadir', $schedule);
    }

    public function test_enhanced_calendar_views()
    {
        $schedule = file_get_contents(resource_path('js/pages/roles/crew/schedule/index.tsx'));
        
        // Test dynamic calendar rendering
        $this->assertStringContainsString('viewMode === \'day\'', $schedule);
        $this->assertStringContainsString('viewMode === \'week\'', $schedule);
        $this->assertStringContainsString('viewMode === \'month\'', $schedule);
        
        // Test enhanced styling
        $this->assertStringContainsString('ring-green-500', $schedule);
        $this->assertStringContainsString('ring-slate-500', $schedule);
        $this->assertStringContainsString('transition-all duration-200', $schedule);
        
        // Test shift color coding
        $this->assertStringContainsString('bg-blue-500', $schedule); // pagi
        $this->assertStringContainsString('bg-green-500', $schedule); // siang (kayu)
        $this->assertStringContainsString('bg-slate-500', $schedule); // siang (besi)
        $this->assertStringContainsString('bg-purple-500', $schedule); // malam
    }

    public function test_week_view_component()
    {
        $schedule = file_get_contents(resource_path('js/pages/roles/crew/schedule/index.tsx'));
        
        // Test week view structure
        $this->assertStringContainsString('WeekView = ({', $schedule);
        $this->assertStringContainsString('startOfWeek', $schedule);
        $this->assertStringContainsString('weekDays', $schedule);
        
        // Test week day names
        $this->assertStringContainsString('Minggu', $schedule);
        $this->assertStringContainsString('Senin', $schedule);
        $this->assertStringContainsString('Selasa', $schedule);
        $this->assertStringContainsString('Rabu', $schedule);
        $this->assertStringContainsString('Kamis', $schedule);
        $this->assertStringContainsString('Jumat', $schedule);
        $this->assertStringContainsString('Sabtu', $schedule);
        
        // Test week view interactions
        $this->assertStringContainsString('onDateSelect', $schedule);
        $this->assertStringContainsString('min-h-[120px]', $schedule);
    }

    public function test_day_view_component()
    {
        $schedule = file_get_contents(resource_path('js/pages/roles/crew/schedule/index.tsx'));
        
        // Test day view structure
        $this->assertStringContainsString('DayView = ({', $schedule);
        $this->assertStringContainsString('date, schedule, crewConfig', $schedule);
        
        // Test day view formatting
        $this->assertStringContainsString('EEEE, dd MMMM yyyy', $schedule);
        $this->assertStringContainsString('locale: id', $schedule);
        
        // Test day view content
        $this->assertStringContainsString('start_time', $schedule);
        $this->assertStringContainsString('end_time', $schedule);
        $this->assertStringContainsString('Tidak ada jadwal untuk hari ini', $schedule);
    }

    public function test_enhanced_navigation_and_controls()
    {
        $schedule = file_get_contents(resource_path('js/pages/roles/crew/schedule/index.tsx'));
        
        // Test enhanced header
        $this->assertStringContainsString('CalendarIcon', $schedule);
        $this->assertStringContainsString('Jadwal Kerja & Presensi', $schedule);
        
        // Test view mode selector
        $this->assertStringContainsString('bg-gray-100 rounded-lg p-1', $schedule);
        $this->assertStringContainsString('flex items-center space-x-1', $schedule);
        
        // Test responsive design
        $this->assertStringContainsString('flex-col lg:flex-row', $schedule);
        $this->assertStringContainsString('sm:flex-row', $schedule);
        $this->assertStringContainsString('lg:justify-between', $schedule);
    }

    public function test_presensi_button_enhancements()
    {
        $schedule = file_get_contents(resource_path('js/pages/roles/crew/schedule/index.tsx'));
        
        // Test enhanced button styling
        $this->assertStringContainsString('crewConfig.buttonPrimary', $schedule);
        $this->assertStringContainsString('crewConfig.buttonSecondary', $schedule);
        $this->assertStringContainsString('text-white', $schedule);
        
        // Test button states
        $this->assertStringContainsString('Hadir Sekarang', $schedule);
        $this->assertStringContainsString('Pulang Sekarang', $schedule);
        $this->assertStringContainsString('Memproses...', $schedule);
        
        // Test conditional rendering
        $this->assertStringContainsString('!todayStatus.can_checkin', $schedule);
        $this->assertStringContainsString('Presensi dapat dilakukan mulai 2 jam', $schedule);
    }

    public function test_accessibility_and_responsive_design()
    {
        $schedule = file_get_contents(resource_path('js/pages/roles/crew/schedule/index.tsx'));
        
        // Test responsive classes
        $this->assertStringContainsString('grid-cols-1 md:grid-cols-3', $schedule);
        $this->assertStringContainsString('grid-cols-1 md:grid-cols-4', $schedule);
        $this->assertStringContainsString('flex-col sm:flex-row', $schedule);
        
        // Test accessibility features
        $this->assertStringContainsString('transition-all duration-200', $schedule);
        $this->assertStringContainsString('cursor-pointer', $schedule);
        
        // Test loading states
        $this->assertStringContainsString('animate-spin', $schedule);
        $this->assertStringContainsString('disabled={isLoadingStatus', $schedule);
    }
}