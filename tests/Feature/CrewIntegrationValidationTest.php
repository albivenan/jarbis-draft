<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;

class CrewIntegrationValidationTest extends TestCase
{
    use WithoutMiddleware;

    public function test_presensi_controller_renders_correct_components()
    {
        // Test that the PresensiController showSchedulePage method renders the correct components
        $controllerPath = app_path('Http/Controllers/PresensiController.php');
        $this->assertTrue(file_exists($controllerPath));
        
        $content = file_get_contents($controllerPath);
        
        // Test that the controller now uses dynamic component selection
        $this->assertStringContainsString('crew_kayu', $content);
        $this->assertStringContainsString('crew_besi', $content);
        $this->assertStringContainsString('roles.crew-kayu.schedule.index', $content);
        $this->assertStringContainsString('roles.crew-besi.schedule.index', $content);
    }

    public function test_all_required_schedule_components_exist()
    {
        // Test that both crew schedule components exist
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-kayu/schedule/index.tsx')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-besi/schedule/index.tsx')));
    }

    public function test_no_orphaned_files_exist()
    {
        // Test that old files that should have been removed/migrated don't exist
        $this->assertFalse(file_exists(resource_path('js/pages/roles/crew-besi/cuti.tsx')));
        $this->assertFalse(file_exists(resource_path('js/pages/roles/crew-besi/presensi.tsx')));
        $this->assertFalse(file_exists(resource_path('js/pages/roles/crew-kayu/cuti.tsx')));
        $this->assertFalse(file_exists(resource_path('js/pages/roles/crew-kayu/presensi.tsx')));
    }

    public function test_legacy_redirects_are_properly_configured()
    {
        $webRoutesPath = base_path('routes/web.php');
        $content = file_get_contents($webRoutesPath);
        
        // Test that legacy redirects exist and point to correct routes
        $this->assertStringContainsString('crew-besi/presensi', $content);
        $this->assertStringContainsString('crew-besi.schedule', $content);
        $this->assertStringContainsString('crew-besi/cuti', $content);
        $this->assertStringContainsString('crew-besi.leave.index', $content);
        
        // Test that redirect messages are informative
        $this->assertStringContainsString('Presensi functionality has been integrated into the schedule page', $content);
        $this->assertStringContainsString('Leave requests have been moved to the new leave management section', $content);
    }

    public function test_component_imports_are_clean()
    {
        // Test crew-kayu dashboard for clean imports
        $kayuDashboard = resource_path('js/pages/roles/crew-kayu/dashboard.tsx');
        $this->assertTrue(file_exists($kayuDashboard));
        
        $content = file_get_contents($kayuDashboard);
        
        // Should not contain unused imports
        $this->assertStringNotContainsString('Zap', $content);
        $this->assertStringNotContainsString('Wrench', $content);
        $this->assertStringNotContainsString('TrendingUp', $content);
        
        // Should contain required imports
        $this->assertStringContainsString('TreePine', $content);
        $this->assertStringContainsString('User', $content);
        $this->assertStringContainsString('Calendar', $content);
        
        // Test crew-besi dashboard for clean imports
        $besiDashboard = resource_path('js/pages/roles/crew-besi/dashboard.tsx');
        $this->assertTrue(file_exists($besiDashboard));
        
        $besiContent = file_get_contents($besiDashboard);
        
        // Should not contain unused imports
        $this->assertStringNotContainsString('Zap', $besiContent);
        $this->assertStringNotContainsString('TrendingUp', $besiContent);
        
        // Should contain required imports
        $this->assertStringContainsString('HardHat', $besiContent);
        $this->assertStringContainsString('Wrench', $besiContent);
        $this->assertStringContainsString('Settings', $besiContent);
    }

    public function test_typescript_interfaces_are_properly_defined()
    {
        // Test that PageProps interfaces include index signature
        $kayuDashboard = file_get_contents(resource_path('js/pages/roles/crew-kayu/dashboard.tsx'));
        $besiDashboard = file_get_contents(resource_path('js/pages/roles/crew-besi/dashboard.tsx'));
        
        $this->assertStringContainsString('[key: string]: any', $kayuDashboard);
        $this->assertStringContainsString('[key: string]: any', $besiDashboard);
    }

    public function test_folder_structure_consistency()
    {
        $crewTypes = ['crew-kayu', 'crew-besi'];
        $requiredFolders = ['accounts', 'leave', 'payroll', 'profile', 'schedule'];
        $requiredFiles = ['dashboard.tsx'];
        
        foreach ($crewTypes as $crewType) {
            $basePath = resource_path("js/pages/roles/{$crewType}");
            
            // Test that base folder exists
            $this->assertTrue(is_dir($basePath), "Base folder for {$crewType} should exist");
            
            // Test that required subfolders exist
            foreach ($requiredFolders as $folder) {
                $folderPath = "{$basePath}/{$folder}";
                $this->assertTrue(is_dir($folderPath), "Folder {$folder} should exist for {$crewType}");
                
                // Test that index.tsx exists in each subfolder
                $indexPath = "{$folderPath}/index.tsx";
                $this->assertTrue(file_exists($indexPath), "Index file should exist in {$crewType}/{$folder}");
            }
            
            // Test that required files exist
            foreach ($requiredFiles as $file) {
                $filePath = "{$basePath}/{$file}";
                $this->assertTrue(file_exists($filePath), "File {$file} should exist for {$crewType}");
            }
        }
    }

    public function test_integration_completeness()
    {
        // This test validates that the integration is complete and no critical pieces are missing
        
        // 1. Route configuration
        $router = app('router');
        $this->assertTrue($router->has('crew-kayu.dashboard'));
        $this->assertTrue($router->has('crew-besi.dashboard'));
        $this->assertTrue($router->has('crew-kayu.schedule'));
        $this->assertTrue($router->has('crew-besi.schedule'));
        
        // 2. Component files
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-kayu/dashboard.tsx')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-besi/dashboard.tsx')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-kayu/schedule/index.tsx')));
        $this->assertTrue(file_exists(resource_path('js/pages/roles/crew-besi/schedule/index.tsx')));
        
        // 3. Menu configuration
        $sidebarMenu = file_get_contents(resource_path('js/config/sidebar-menu.ts'));
        $this->assertStringContainsString('crew_kayu:', $sidebarMenu);
        $this->assertStringContainsString('crew_besi:', $sidebarMenu);
        
        // 4. Controller integration
        $controller = file_get_contents(app_path('Http/Controllers/PresensiController.php'));
        $this->assertStringContainsString('match($role)', $controller);
        
        // 5. Legacy support
        $this->assertTrue($router->has('crew-besi.presensi.redirect'));
        $this->assertTrue($router->has('crew-besi.cuti.redirect'));
    }
}