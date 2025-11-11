<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;

class CrewRouteNavigationTest extends TestCase
{
    use WithoutMiddleware;

    public function test_all_crew_routes_are_accessible()
    {
        $router = app('router');
        
        // Test crew-kayu routes
        $crewKayuRoutes = [
            'crew-kayu.dashboard',
            'crew-kayu.profile',
            'crew-kayu.schedule',
            'crew-kayu.leave.index',
            'crew-kayu.leave.form',
            'crew-kayu.leave.history',
            'crew-kayu.payroll.index',
            'crew-kayu.payroll.history',
            'crew-kayu.payroll.detail',
            'crew-kayu.accounts.index'
        ];

        foreach ($crewKayuRoutes as $routeName) {
            $this->assertTrue($router->has($routeName), "Route {$routeName} does not exist");
        }

        // Test crew-besi routes
        $crewBesiRoutes = [
            'crew-besi.dashboard',
            'crew-besi.profile',
            'crew-besi.schedule',
            'crew-besi.leave.index',
            'crew-besi.leave.form',
            'crew-besi.leave.history',
            'crew-besi.payroll.index',
            'crew-besi.payroll.history',
            'crew-besi.payroll.detail',
            'crew-besi.accounts.index'
        ];

        foreach ($crewBesiRoutes as $routeName) {
            $this->assertTrue($router->has($routeName), "Route {$routeName} does not exist");
        }
    }

    public function test_route_url_patterns_are_consistent()
    {
        $router = app('router');
        
        // Test that crew-kayu routes follow consistent patterns
        $this->assertEquals('roles/crew-kayu', $router->getRoutes()->getByName('crew-kayu.dashboard')->uri());
        $this->assertEquals('roles/crew-kayu/profile', $router->getRoutes()->getByName('crew-kayu.profile')->uri());
        $this->assertEquals('roles/crew-kayu/schedule', $router->getRoutes()->getByName('crew-kayu.schedule')->uri());
        $this->assertEquals('roles/crew-kayu/leave', $router->getRoutes()->getByName('crew-kayu.leave.index')->uri());
        $this->assertEquals('roles/crew-kayu/payroll', $router->getRoutes()->getByName('crew-kayu.payroll.index')->uri());
        $this->assertEquals('roles/crew-kayu/accounts', $router->getRoutes()->getByName('crew-kayu.accounts.index')->uri());

        // Test that crew-besi routes follow consistent patterns
        $this->assertEquals('roles/crew-besi', $router->getRoutes()->getByName('crew-besi.dashboard')->uri());
        $this->assertEquals('roles/crew-besi/profile', $router->getRoutes()->getByName('crew-besi.profile')->uri());
        $this->assertEquals('roles/crew-besi/schedule', $router->getRoutes()->getByName('crew-besi.schedule')->uri());
        $this->assertEquals('roles/crew-besi/leave', $router->getRoutes()->getByName('crew-besi.leave.index')->uri());
        $this->assertEquals('roles/crew-besi/payroll', $router->getRoutes()->getByName('crew-besi.payroll.index')->uri());
        $this->assertEquals('roles/crew-besi/accounts', $router->getRoutes()->getByName('crew-besi.accounts.index')->uri());
    }

    public function test_sidebar_navigation_reflects_new_structure()
    {
        $sidebarMenuPath = resource_path('js/config/sidebar-menu.ts');
        $content = file_get_contents($sidebarMenuPath);
        
        // Test crew-kayu navigation structure
        $this->assertStringContainsString("title: 'Dashboard'", $content);
        $this->assertStringContainsString("href: '/roles/crew-kayu'", $content);
        $this->assertStringContainsString("title: 'Profil'", $content);
        $this->assertStringContainsString("href: '/roles/crew-kayu/profile'", $content);
        $this->assertStringContainsString("title: 'Jadwal'", $content);
        $this->assertStringContainsString("href: '/roles/crew-kayu/schedule'", $content);
        $this->assertStringContainsString("title: 'Pengajuan Cuti'", $content);
        $this->assertStringContainsString("href: '/roles/crew-kayu/leave'", $content);
        $this->assertStringContainsString("title: 'Slip Gaji'", $content);
        $this->assertStringContainsString("href: '/roles/crew-kayu/payroll'", $content);
        $this->assertStringContainsString("title: 'Kelola Rekening'", $content);
        $this->assertStringContainsString("href: '/roles/crew-kayu/accounts'", $content);

        // Test crew-besi navigation structure
        $this->assertStringContainsString("href: '/roles/crew-besi'", $content);
        $this->assertStringContainsString("href: '/roles/crew-besi/profile'", $content);
        $this->assertStringContainsString("href: '/roles/crew-besi/schedule'", $content);
        $this->assertStringContainsString("href: '/roles/crew-besi/leave'", $content);
        $this->assertStringContainsString("href: '/roles/crew-besi/payroll'", $content);
        $this->assertStringContainsString("href: '/roles/crew-besi/accounts'", $content);
    }

    public function test_no_broken_links_in_navigation()
    {
        $router = app('router');
        $sidebarMenuPath = resource_path('js/config/sidebar-menu.ts');
        $content = file_get_contents($sidebarMenuPath);
        
        // Extract all href URLs from the sidebar menu
        preg_match_all("/href: '([^']+)'/", $content, $matches);
        $hrefs = $matches[1];
        
        // Filter for crew-related URLs
        $crewUrls = array_filter($hrefs, function($url) {
            return strpos($url, '/roles/crew-') === 0;
        });
        
        foreach ($crewUrls as $url) {
            // Convert URL to route name for testing
            $url = ltrim($url, '/');
            
            // Test that the URL pattern exists in routes
            $routeExists = false;
            foreach ($router->getRoutes() as $route) {
                if ($route->uri() === $url || $route->uri() === ltrim($url, '/')) {
                    $routeExists = true;
                    break;
                }
            }
            
            $this->assertTrue($routeExists, "No route found for URL: {$url}");
        }
    }

    public function test_legacy_route_redirects_work()
    {
        $router = app('router');
        
        // Test that legacy redirect routes exist
        $this->assertTrue($router->has('crew-besi.presensi.redirect'));
        $this->assertTrue($router->has('crew-besi.cuti.redirect'));
        
        // Test the redirect route patterns
        $presensiRoute = $router->getRoutes()->getByName('crew-besi.presensi.redirect');
        $cutiRoute = $router->getRoutes()->getByName('crew-besi.cuti.redirect');
        
        $this->assertEquals('roles/crew-besi/presensi', $presensiRoute->uri());
        $this->assertEquals('roles/crew-besi/cuti', $cutiRoute->uri());
    }

    public function test_route_middleware_consistency()
    {
        $router = app('router');
        
        // Get crew routes and check middleware consistency
        $crewRoutes = [
            'crew-kayu.dashboard',
            'crew-kayu.profile',
            'crew-kayu.schedule',
            'crew-besi.dashboard',
            'crew-besi.profile',
            'crew-besi.schedule'
        ];
        
        foreach ($crewRoutes as $routeName) {
            $route = $router->getRoutes()->getByName($routeName);
            $middleware = $route->middleware();
            
            // All crew routes should have auth middleware
            $this->assertContains('auth', $middleware, "Route {$routeName} missing auth middleware");
            
            // All crew routes should have role.permission middleware
            $hasRolePermission = false;
            foreach ($middleware as $m) {
                if (strpos($m, 'role.permission') !== false) {
                    $hasRolePermission = true;
                    break;
                }
            }
            $this->assertTrue($hasRolePermission, "Route {$routeName} missing role.permission middleware");
        }
    }

    public function test_route_naming_follows_conventions()
    {
        $router = app('router');
        
        // Test crew-kayu route naming conventions
        $crewKayuRoutes = $router->getRoutes()->getRoutesByName();
        $crewKayuRouteNames = array_filter(array_keys($crewKayuRoutes), function($name) {
            return strpos($name, 'crew-kayu.') === 0;
        });
        
        foreach ($crewKayuRouteNames as $routeName) {
            // Route names should follow crew-kayu.{feature}.{action} pattern
            $this->assertMatchesRegularExpression('/^crew-kayu\.[a-z]+(\.[a-z]+)?$/', $routeName);
        }
        
        // Test crew-besi route naming conventions
        $crewBesiRouteNames = array_filter(array_keys($crewKayuRoutes), function($name) {
            return strpos($name, 'crew-besi.') === 0;
        });
        
        foreach ($crewBesiRouteNames as $routeName) {
            // Route names should follow crew-besi.{feature}.{action} pattern
            $this->assertMatchesRegularExpression('/^crew-besi\.[a-z]+(\.[a-z]+)?$/', $routeName);
        }
    }

    public function test_navigation_menu_structure_consistency()
    {
        $sidebarMenuPath = resource_path('js/config/sidebar-menu.ts');
        $content = file_get_contents($sidebarMenuPath);
        
        // Test that both crew types have the same menu structure
        $crewKayuSection = $this->extractMenuSection($content, 'crew_kayu');
        $crewBesiSection = $this->extractMenuSection($content, 'crew_besi');
        
        $this->assertNotEmpty($crewKayuSection, 'crew_kayu menu section not found');
        $this->assertNotEmpty($crewBesiSection, 'crew_besi menu section not found');
        
        // Extract menu titles from both sections
        preg_match_all("/title: '([^']+)'/", $crewKayuSection, $kayuTitles);
        preg_match_all("/title: '([^']+)'/", $crewBesiSection, $besiTitles);
        
        // Both should have the same menu titles
        $this->assertEquals(sort($kayuTitles[1]), sort($besiTitles[1]), 'Menu titles are not consistent between crew types');
    }

    private function extractMenuSection($content, $sectionName)
    {
        $pattern = "/{$sectionName}:\s*\[(.*?)\]/s";
        preg_match($pattern, $content, $matches);
        return $matches[1] ?? '';
    }

    public function test_all_menu_links_have_corresponding_routes()
    {
        $router = app('router');
        $sidebarMenuPath = resource_path('js/config/sidebar-menu.ts');
        $content = file_get_contents($sidebarMenuPath);
        
        // Extract all crew-related hrefs
        preg_match_all("/href: '(\/roles\/crew-[^']+)'/", $content, $matches);
        $menuUrls = $matches[1];
        
        foreach ($menuUrls as $url) {
            $urlPath = ltrim($url, '/');
            
            // Check if there's a corresponding route
            $routeExists = false;
            foreach ($router->getRoutes() as $route) {
                if ($route->uri() === $urlPath) {
                    $routeExists = true;
                    break;
                }
            }
            
            $this->assertTrue($routeExists, "Menu link {$url} has no corresponding route");
        }
    }
}