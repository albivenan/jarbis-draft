<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;

class CrewRoleSpecificRoutesTest extends TestCase
{
    use WithoutMiddleware;

    public function test_crew_kayu_routes_exist_and_use_crew_components()
    {
        $router = app('router');
        
        // Test that crew-kayu routes exist
        $this->assertTrue($router->has('crew-kayu.dashboard'));
        $this->assertTrue($router->has('crew-kayu.profile'));
        $this->assertTrue($router->has('crew-kayu.schedule'));
        $this->assertTrue($router->has('crew-kayu.leave.index'));
        $this->assertTrue($router->has('crew-kayu.payroll.index'));
        $this->assertTrue($router->has('crew-kayu.accounts.index'));
    }

    public function test_crew_besi_routes_exist_and_use_crew_components()
    {
        $router = app('router');
        
        // Test that crew-besi routes exist
        $this->assertTrue($router->has('crew-besi.dashboard'));
        $this->assertTrue($router->has('crew-besi.profile'));
        $this->assertTrue($router->has('crew-besi.schedule'));
        $this->assertTrue($router->has('crew-besi.leave.index'));
        $this->assertTrue($router->has('crew-besi.payroll.index'));
        $this->assertTrue($router->has('crew-besi.accounts.index'));
    }

    public function test_route_url_patterns_are_role_specific()
    {
        $router = app('router');
        
        // Test crew-kayu route patterns
        $this->assertEquals('roles/crew-kayu', $router->getRoutes()->getByName('crew-kayu.dashboard')->uri());
        $this->assertEquals('roles/crew-kayu/profile', $router->getRoutes()->getByName('crew-kayu.profile')->uri());
        $this->assertEquals('roles/crew-kayu/schedule', $router->getRoutes()->getByName('crew-kayu.schedule')->uri());
        
        // Test crew-besi route patterns
        $this->assertEquals('roles/crew-besi', $router->getRoutes()->getByName('crew-besi.dashboard')->uri());
        $this->assertEquals('roles/crew-besi/profile', $router->getRoutes()->getByName('crew-besi.profile')->uri());
        $this->assertEquals('roles/crew-besi/schedule', $router->getRoutes()->getByName('crew-besi.schedule')->uri());
    }

    public function test_sidebar_menu_uses_role_specific_paths()
    {
        $sidebarMenu = file_get_contents(resource_path('js/config/sidebar-menu.ts'));
        
        // Test crew-kayu menu paths
        $this->assertStringContainsString('/roles/crew-kayu', $sidebarMenu);
        $this->assertStringContainsString('/roles/crew-kayu/profile', $sidebarMenu);
        $this->assertStringContainsString('/roles/crew-kayu/schedule', $sidebarMenu);
        
        // Test crew-besi menu paths
        $this->assertStringContainsString('/roles/crew-besi', $sidebarMenu);
        $this->assertStringContainsString('/roles/crew-besi/profile', $sidebarMenu);
        $this->assertStringContainsString('/roles/crew-besi/schedule', $sidebarMenu);
    }

    public function test_app_sidebar_uses_role_specific_paths()
    {
        $appSidebar = file_get_contents(resource_path('js/components/app-sidebar.tsx'));
        
        // Test that role mappings point to role-specific routes
        $this->assertStringContainsString("'crew_kayu': '/roles/crew-kayu'", $appSidebar);
        $this->assertStringContainsString("'crew_besi': '/roles/crew-besi'", $appSidebar);
    }

    public function test_crew_controller_handles_role_detection()
    {
        $controller = file_get_contents(app_path('Http/Controllers/CrewController.php'));
        
        // Test that controller has role detection logic
        $this->assertStringContainsString('getCrewConfig', $controller);
        $this->assertStringContainsString('crew_kayu', $controller);
        $this->assertStringContainsString('crew_besi', $controller);
        $this->assertStringContainsString('userRole', $controller);
    }

    public function test_crew_dashboard_supports_role_detection()
    {
        $dashboard = file_get_contents(resource_path('js/pages/roles/crew/dashboard.tsx'));
        
        // Test that dashboard has role detection capabilities
        $this->assertStringContainsString('getCrewConfig', $dashboard);
        $this->assertStringContainsString('auth.user.role', $dashboard);
        $this->assertStringContainsString('crewConfig', $dashboard);
        
        // Test that it supports different crew types
        $this->assertStringContainsString('crew_kayu', $dashboard);
        $this->assertStringContainsString('crew_besi', $dashboard);
        $this->assertStringContainsString('Crew Kayu', $dashboard);
        $this->assertStringContainsString('Crew Besi', $dashboard);
    }

    public function test_routes_use_crew_components_not_duplicates()
    {
        // Test that routes are configured to use crew components
        $webRoutes = file_get_contents(base_path('routes/web.php'));
        
        // Should use roles.crew components
        $this->assertStringContainsString('roles.crew.profile.index', $webRoutes);
        $this->assertStringContainsString('roles.crew.leave.index', $webRoutes);
        $this->assertStringContainsString('roles.crew.payroll.index', $webRoutes);
        $this->assertStringContainsString('roles.crew.accounts.index', $webRoutes);
        
        // Should NOT use duplicate components
        $this->assertStringNotContainsString('roles.crew-kayu.profile.index', $webRoutes);
        $this->assertStringNotContainsString('roles.crew-besi.profile.index', $webRoutes);
    }

    public function test_presensi_controller_uses_crew_component()
    {
        $controller = file_get_contents(app_path('Http/Controllers/PresensiController.php'));
        
        // Test that PresensiController uses crew schedule component
        $this->assertStringContainsString('roles.crew.schedule.index', $controller);
    }

    public function test_legacy_redirects_still_exist()
    {
        $router = app('router');
        
        // Test that legacy redirects for crew-besi still exist
        $this->assertTrue($router->has('crew-besi.presensi.redirect'));
        $this->assertTrue($router->has('crew-besi.cuti.redirect'));
    }

    public function test_crew_components_exist()
    {
        // Test that crew components exist and can be used by both roles
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