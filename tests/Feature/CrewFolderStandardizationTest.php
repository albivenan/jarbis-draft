<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;

class CrewFolderStandardizationTest extends TestCase
{
    use WithoutMiddleware;

    public function test_crew_folder_structure_exists()
    {
        // Test that crew-kayu folder structure exists
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-kayu')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-kayu/accounts')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-kayu/leave')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-kayu/payroll')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-kayu/profile')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-kayu/schedule')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-kayu/dashboard.tsx')));

        // Test that crew-besi folder structure exists
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-besi')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-besi/accounts')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-besi/leave')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-besi/payroll')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-besi/profile')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-besi/schedule')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-besi/dashboard.tsx')));
    }

    public function test_crew_components_have_index_files()
    {
        // Test crew-kayu index files
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-kayu/accounts/index.tsx')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-kayu/leave/index.tsx')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-kayu/payroll/index.tsx')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-kayu/profile/index.tsx')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-kayu/schedule/index.tsx')));

        // Test crew-besi index files
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-besi/accounts/index.tsx')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-besi/leave/index.tsx')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-besi/payroll/index.tsx')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-besi/profile/index.tsx')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-besi/schedule/index.tsx')));
    }

    public function test_crew_leave_structure_is_standardized()
    {
        // Test crew-kayu leave structure
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-kayu/leave/form.tsx')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-kayu/leave/history.tsx')));

        // Test crew-besi leave structure (migrated from cuti.tsx)
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-besi/leave/form.tsx')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-besi/leave/history.tsx')));
    }

    public function test_crew_payroll_structure_is_standardized()
    {
        // Test crew-kayu payroll structure
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-kayu/payroll/history.tsx')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-kayu/payroll/detail')));

        // Test crew-besi payroll structure
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-besi/payroll/history.tsx')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-besi/payroll/detail')));
    }

    public function test_crew_besi_presensi_integration()
    {
        // Test that crew-besi schedule includes integrated presensi functionality
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-besi/schedule/index.tsx')));
        
        // Test that old presensi.tsx file no longer exists (should have been integrated)
        $this->assertFalse(file_exists(resource_path('js/pages/roles/crew-besi/presensi.tsx')));
        
        // Test that old cuti.tsx file no longer exists (should have been migrated to leave)
        $this->assertFalse(file_exists(resource_path('js/pages/roles/crew-besi/cuti.tsx')));
    }

    public function test_crew_route_naming_is_consistent()
    {
        // Test that route names follow consistent patterns
        $router = app('router');
        
        $this->assertTrue($router->has('crew-kayu.dashboard'));
        $this->assertTrue($router->has('crew-besi.dashboard'));
        
        $this->assertTrue($router->has('crew-kayu.profile'));
        $this->assertTrue($router->has('crew-besi.profile'));
        
        $this->assertTrue($router->has('crew-kayu.schedule'));
        $this->assertTrue($router->has('crew-besi.schedule'));
        
        $this->assertTrue($router->has('crew-kayu.leave.index'));
        $this->assertTrue($router->has('crew-besi.leave.index'));
        
        $this->assertTrue($router->has('crew-kayu.payroll.index'));
        $this->assertTrue($router->has('crew-besi.payroll.index'));
        
        $this->assertTrue($router->has('crew-kayu.accounts.index'));
        $this->assertTrue($router->has('crew-besi.accounts.index'));
    }

    public function test_sidebar_menu_configuration_is_consistent()
    {
        // Read the sidebar menu configuration
        $sidebarMenuPath = resource_path('js/config/sidebar-menu.ts');
        $this->assertTrue(file_exists($sidebarMenuPath));
        
        $content = file_get_contents($sidebarMenuPath);
        
        // Test that both crew types have menu configurations
        $this->assertStringContainsString('crew_kayu:', $content);
        $this->assertStringContainsString('crew_besi:', $content);
        
        // Test that both have consistent menu structure
        $this->assertStringContainsString('/roles/crew-kayu', $content);
        $this->assertStringContainsString('/roles/crew-besi', $content);
        
        // Test that both have the same menu items
        $this->assertStringContainsString('/roles/crew-kayu/profile', $content);
        $this->assertStringContainsString('/roles/crew-besi/profile', $content);
        
        $this->assertStringContainsString('/roles/crew-kayu/schedule', $content);
        $this->assertStringContainsString('/roles/crew-besi/schedule', $content);
        
        $this->assertStringContainsString('/roles/crew-kayu/leave', $content);
        $this->assertStringContainsString('/roles/crew-besi/leave', $content);
        
        $this->assertStringContainsString('/roles/crew-kayu/payroll', $content);
        $this->assertStringContainsString('/roles/crew-besi/payroll', $content);
        
        $this->assertStringContainsString('/roles/crew-kayu/accounts', $content);
        $this->assertStringContainsString('/roles/crew-besi/accounts', $content);
    }

    public function test_legacy_routes_are_handled()
    {
        // Test that legacy route redirects exist in web.php
        $webRoutesPath = base_path('routes/web.php');
        $this->assertTrue(file_exists($webRoutesPath));
        
        $content = file_get_contents($webRoutesPath);
        
        // Test that legacy presensi route redirect exists
        $this->assertStringContainsString('crew-besi/presensi', $content);
        $this->assertStringContainsString('crew-besi.schedule', $content);
        
        // Test that legacy cuti route redirect exists
        $this->assertStringContainsString('crew-besi/cuti', $content);
        $this->assertStringContainsString('crew-besi.leave', $content);
    }
}