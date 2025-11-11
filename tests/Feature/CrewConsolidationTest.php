<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;

class CrewConsolidationTest extends TestCase
{
    use WithoutMiddleware;

    public function test_consolidated_crew_routes_exist()
    {
        $router = app('router');
        
        // Test that new consolidated routes exist
        $this->assertTrue($router->has('crew.dashboard'));
        $this->assertTrue($router->has('crew.profile'));
        $this->assertTrue($router->has('crew.schedule'));
        $this->assertTrue($router->has('crew.leave.index'));
        $this->assertTrue($router->has('crew.payroll.index'));
        $this->assertTrue($router->has('crew.accounts.index'));
    }

    public function test_legacy_redirects_are_configured()
    {
        $router = app('router');
        
        // Test crew-kayu redirects
        $this->assertTrue($router->has('crew-kayu.dashboard.redirect'));
        $this->assertTrue($router->has('crew-kayu.profile.redirect'));
        $this->assertTrue($router->has('crew-kayu.schedule.redirect'));
        
        // Test crew-besi redirects
        $this->assertTrue($router->has('crew-besi.dashboard.redirect'));
        $this->assertTrue($router->has('crew-besi.profile.redirect'));
        $this->assertTrue($router->has('crew-besi.schedule.redirect'));
    }

    public function test_consolidated_crew_dashboard_component_exists()
    {
        // Test that the enhanced crew dashboard exists
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew/dashboard.tsx')));
        
        $content = file_get_contents(resource_path('js/pages/roles/crew/dashboard.tsx'));
        
        // Test that it contains role detection logic
        $this->assertStringContainsString('getCrewConfig', $content);
        $this->assertStringContainsString('crew_kayu', $content);
        $this->assertStringContainsString('crew_besi', $content);
        $this->assertStringContainsString('TreePine', $content);
        $this->assertStringContainsString('HardHat', $content);
    }

    public function test_crew_controller_exists_and_configured()
    {
        // Test that CrewController exists
        $this->assertTrue(file_exists(app_path('Http/Controllers/CrewController.php')));
        
        $content = file_get_contents(app_path('Http/Controllers/CrewController.php'));
        
        // Test that it contains role-based configuration
        $this->assertStringContainsString('getCrewConfig', $content);
        $this->assertStringContainsString('crew_kayu', $content);
        $this->assertStringContainsString('crew_besi', $content);
    }

    public function test_sidebar_menu_uses_consolidated_routes()
    {
        $sidebarMenu = file_get_contents(resource_path('js/config/sidebar-menu.ts'));
        
        // Test that crew menus point to consolidated routes
        $this->assertStringContainsString('/roles/crew', $sidebarMenu);
        
        // Should not contain old specific routes in menu
        $this->assertStringNotContainsString('/roles/crew-kayu', $sidebarMenu);
        $this->assertStringNotContainsString('/roles/crew-besi', $sidebarMenu);
    }

    public function test_app_sidebar_uses_consolidated_routes()
    {
        $appSidebar = file_get_contents(resource_path('js/components/app-sidebar.tsx'));
        
        // Test that role mappings point to consolidated crew route
        $this->assertStringContainsString("'crew_kayu': '/roles/crew'", $appSidebar);
        $this->assertStringContainsString("'crew_besi': '/roles/crew'", $appSidebar);
    }

    public function test_presensi_controller_uses_consolidated_component()
    {
        $controller = file_get_contents(app_path('Http/Controllers/PresensiController.php'));
        
        // Test that PresensiController uses consolidated crew schedule component
        $this->assertStringContainsString('roles.crew.schedule.index', $controller);
    }

    public function test_route_url_patterns_are_consistent()
    {
        $router = app('router');
        
        // Test consolidated route patterns (Laravel strips prefix from URI)
        $this->assertEquals('crew', $router->getRoutes()->getByName('crew.dashboard')->uri());
        $this->assertEquals('crew/profile', $router->getRoutes()->getByName('crew.profile')->uri());
        $this->assertEquals('crew/schedule', $router->getRoutes()->getByName('crew.schedule')->uri());
        $this->assertEquals('crew/leave', $router->getRoutes()->getByName('crew.leave.index')->uri());
        $this->assertEquals('crew/payroll', $router->getRoutes()->getByName('crew.payroll.index')->uri());
        $this->assertEquals('crew/accounts', $router->getRoutes()->getByName('crew.accounts.index')->uri());
    }

    public function test_crew_components_support_role_detection()
    {
        $dashboard = file_get_contents(resource_path('js/pages/roles/crew/dashboard.tsx'));
        
        // Test that dashboard supports dynamic theming
        $this->assertStringContainsString('crewConfig', $dashboard);
        $this->assertStringContainsString('primaryColor', $dashboard);
        $this->assertStringContainsString('secondaryColor', $dashboard);
        $this->assertStringContainsString('accentColor', $dashboard);
        
        // Test that it handles different crew types
        $this->assertStringContainsString('Crew Kayu', $dashboard);
        $this->assertStringContainsString('Crew Besi', $dashboard);
    }

    public function test_consolidation_maintains_functionality()
    {
        // Test that all required crew components still exist
        $requiredComponents = [
            'js/pages/roles/crew/dashboard.tsx',
            'js/pages/roles/crew/profile/index.tsx',
            'js/pages/roles/crew/schedule/index.tsx',
            'js/pages/roles/crew/leave/index.tsx',
            'js/pages/roles/crew/payroll/index.tsx',
            'js/pages/roles/crew/accounts/index.tsx'
        ];

        foreach ($requiredComponents as $component) {
            $this->assertTrue(file_exists(resource_path($component)), "Component {$component} should exist");
        }
    }
}