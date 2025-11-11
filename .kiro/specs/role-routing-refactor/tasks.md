# Implementation Plan

- [x] 1. Preparation and Backup





  - Create backup of critical files before making any changes
  - Document current state for rollback reference
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_


- [x] 1.1 Create backup of routes file

  - Copy `routes/web.php` to `routes/web.php.backup`
  - Verify backup file exists and is readable
  - _Requirements: 6.1, 6.2_


- [x] 1.2 Document current controller structure

  - List all controller folders in `app/Http/Controllers/` that start with "Manajer"
  - Save list to temporary file for reference
  - _Requirements: 5.1, 5.2, 5.3_


- [x] 1.3 Document current frontend structure

  - List all role folders in `resources/js/pages/roles/` that start with "manajer-" or "staf-"
  - Save list to temporary file for reference
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 2. Migrate Controller Namespaces and Folders





  - Move controller folders from Manajer* to department names
  - Update namespace declarations in all controller files
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 2.1 Move ManajerHrd to Hrd controller folder


  - Move `app/Http/Controllers/ManajerHrd/` to `app/Http/Controllers/Hrd/`
  - Update namespace in all PHP files from `App\Http\Controllers\ManajerHrd` to `App\Http\Controllers\Hrd`
  - _Requirements: 5.1, 5.2, 5.5_


- [x] 2.2 Move ManajerMarketing to Marketing controller folder

  - Move `app/Http/Controllers/ManajerMarketing/` to `app/Http/Controllers/Marketing/`
  - Update namespace in all PHP files from `App\Http\Controllers\ManajerMarketing` to `App\Http\Controllers\Marketing`
  - _Requirements: 5.1, 5.2, 5.5_

- [x] 2.3 Move ManajerPpic to Ppic controller folder


  - Move `app/Http/Controllers/ManajerPpic/` to `app/Http/Controllers/Ppic/`
  - Update namespace in all PHP files from `App\Http\Controllers\ManajerPpic` to `App\Http\Controllers\Ppic`
  - _Requirements: 5.1, 5.2, 5.5_

- [x] 2.4 Merge ManajerKeuangan into existing Keuangan controller folder


  - Move all files from `app/Http/Controllers/ManajerKeuangan/` to `app/Http/Controllers/Keuangan/`
  - Update namespace in moved files from `App\Http\Controllers\ManajerKeuangan` to `App\Http\Controllers\Keuangan`
  - Resolve any file conflicts by merging or renaming
  - _Requirements: 5.1, 5.2, 5.5_

- [x] 3. Migrate Frontend Folder Structure - HRD





  - Move HRD folders and delete staf-hrd
  - Update all import paths in moved files
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 7.1_

- [x] 3.1 Move manajer-hrd to hrd folder


  - Move `resources/js/pages/roles/manajer-hrd/` to `resources/js/pages/roles/hrd/`
  - Verify all subfolders and files are moved correctly
  - _Requirements: 2.1, 2.2, 2.4, 7.1_



- [ ] 3.2 Delete staf-hrd folder
  - Delete `resources/js/pages/roles/staf-hrd/` folder completely
  - Verify folder is removed
  - _Requirements: 2.2, 2.3, 7.1_

- [x] 4. Migrate Frontend Folder Structure - Marketing





  - Merge manajer-marketing with existing marketing folder
  - _Requirements: 2.1, 2.2, 2.4, 7.2_


- [x] 4.1 Merge manajer-marketing into marketing folder

  - Copy all files from `resources/js/pages/roles/manajer-marketing/` to `resources/js/pages/roles/marketing/`
  - Resolve conflicts by keeping more complete version
  - Delete `resources/js/pages/roles/manajer-marketing/` after merge
  - _Requirements: 2.1, 2.2, 2.4, 7.2_

- [ ] 5. Migrate Frontend Folder Structure - PPIC
  - Move PPIC folders and delete staf-ppic
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 7.3_

- [ ] 5.1 Move manajer-ppic to ppic folder
  - Move `resources/js/pages/roles/manajer-ppic/` to `resources/js/pages/roles/ppic/`
  - Verify all subfolders and files are moved correctly
  - _Requirements: 2.1, 2.2, 2.4, 7.3_

- [ ] 5.2 Delete staf-ppic folder
  - Delete `resources/js/pages/roles/staf-ppic/` folder completely
  - Verify folder is removed
  - _Requirements: 2.2, 2.3, 7.3_

- [ ] 6. Migrate Frontend Folder Structure - Keuangan
  - Rename Keuangan to lowercase and delete staf-keuangan
  - _Requirements: 2.1, 2.2, 2.3, 2.5, 7.4_

- [ ] 6.1 Rename Keuangan to keuangan folder
  - Rename `resources/js/pages/roles/Keuangan/` to `resources/js/pages/roles/keuangan/`
  - Verify all subfolders and files are accessible
  - _Requirements: 2.1, 2.5, 7.4_

- [ ] 6.2 Delete staf-keuangan folder if exists
  - Delete `resources/js/pages/roles/staf-keuangan/` folder if it exists
  - Verify folder is removed
  - _Requirements: 2.2, 2.3, 7.4_

- [ ] 7. Migrate Frontend Folder Structure - Operasional
  - Move manajer-operasional to operasional
  - _Requirements: 2.1, 2.2, 2.4, 7.5_

- [ ] 7.1 Move manajer-operasional to operasional folder
  - Move `resources/js/pages/roles/manajer-operasional/` to `resources/js/pages/roles/operasional/`
  - Verify all files are moved correctly
  - _Requirements: 2.1, 2.2, 2.4, 7.5_

- [ ] 8. Migrate Frontend Folder Structure - Produksi (Shared)
  - Move manajer-produksi to produksi as shared folder
  - _Requirements: 2.1, 2.2, 2.4, 3.2, 7.6_

- [ ] 8.1 Move manajer-produksi to produksi folder
  - Move `resources/js/pages/roles/manajer-produksi/` to `resources/js/pages/roles/produksi/`
  - Verify this folder will be shared by Manajer Produksi Besi and Manajer Produksi Kayu
  - _Requirements: 2.1, 2.2, 2.4, 3.2, 7.6_

- [x] 9. Migrate Frontend Folder Structure - Produksi Besi




  - Move produksi besi folders and delete staf
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 7.7_

- [x] 9.1 Move manajer-produksi-besi to produksi-besi folder


  - Move `resources/js/pages/roles/manajer-produksi-besi/` to `resources/js/pages/roles/produksi-besi/`
  - Verify all subfolders and files are moved correctly
  - _Requirements: 2.1, 2.2, 2.4, 7.7_

- [x] 9.2 Delete staf-produksi-besi folder


  - Delete `resources/js/pages/roles/staf-produksi-besi/` folder completely
  - Verify folder is removed
  - _Requirements: 2.2, 2.3, 7.7_

- [x] 10. Migrate Frontend Folder Structure - Produksi Kayu





  - Move produksi kayu folders and delete staf
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 7.8_


- [x] 10.1 Move manajer-produksi-kayu to produksi-kayu folder

  - Move `resources/js/pages/roles/manajer-produksi-kayu/` to `resources/js/pages/roles/produksi-kayu/`
  - Verify all subfolders and files are moved correctly
  - _Requirements: 2.1, 2.2, 2.4, 7.8_

- [x] 10.2 Delete staf-produksi-kayu folder


  - Delete `resources/js/pages/roles/staf-produksi-kayu/` folder completely
  - Verify folder is removed
  - _Requirements: 2.2, 2.3, 7.8_

- [x] 11. Create Shared QC Folder




  - Merge qc-besi and qc-kayu into single qc folder
  - _Requirements: 2.1, 2.2, 2.4, 3.1, 7.9_

- [x] 11.1 Create qc folder and merge content


  - Create `resources/js/pages/roles/qc/` folder
  - Copy all files from `resources/js/pages/roles/qc-besi/` to `qc/`
  - Merge files from `resources/js/pages/roles/qc-kayu/` into `qc/`, resolving conflicts
  - Delete `qc-besi/` and `qc-kayu/` folders after merge
  - _Requirements: 2.1, 2.2, 2.4, 3.1, 7.9_

- [x] 12. Create Shared Supervisor Folder




  - Merge supervisor-besi and supervisor-kayu into single supervisor folder
  - _Requirements: 2.1, 2.2, 2.4, 3.3, 7.10_

- [x] 12.1 Create supervisor folder and merge content


  - Create `resources/js/pages/roles/supervisor/` folder
  - Copy all files from `resources/js/pages/roles/supervisor-besi/` to `supervisor/`
  - Merge files from `resources/js/pages/roles/supervisor-kayu/` into `supervisor/`, resolving conflicts
  - Delete `supervisor-besi/` and `supervisor-kayu/` folders after merge
  - _Requirements: 2.1, 2.2, 2.4, 3.3, 7.10_

- [x] 13. Update Route Imports in web.php





  - Update all controller imports to use new namespaces
  - _Requirements: 5.3, 5.4_

- [x] 13.1 Update HRD controller imports


  - Change `use App\Http\Controllers\ManajerHrd\` to `use App\Http\Controllers\Hrd\`
  - Verify all HRD controller references are updated
  - _Requirements: 5.3_

- [x] 13.2 Update Marketing controller imports


  - Change `use App\Http\Controllers\ManajerMarketing\` to `use App\Http\Controllers\Marketing\`
  - Verify all Marketing controller references are updated
  - _Requirements: 5.3_



- [x] 13.3 Update PPIC controller imports

  - Change `use App\Http\Controllers\ManajerPpic\` to `use App\Http\Controllers\Ppic\`
  - Verify all PPIC controller references are updated
  - _Requirements: 5.3_


- [x] 13.4 Update Keuangan controller imports

  - Change `use App\Http\Controllers\ManajerKeuangan\` to `use App\Http\Controllers\Keuangan\`
  - Verify all Keuangan controller references are updated
  - _Requirements: 5.3_

- [x] 14. Update HRD Routes




  - Update route prefix, names, and render paths for HRD
  - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 4.3, 4.4, 8.1, 8.2, 8.3_

- [x] 14.1 Update HRD route prefix and names


  - Change `Route::prefix('roles/manajer-hrd')` to `Route::prefix('roles/hrd')`
  - Change `->name('manajer-hrd.')` to `->name('hrd.')`
  - Update all nested route names to use `hrd.` prefix
  - _Requirements: 1.1, 1.2, 8.1, 8.2_

- [x] 14.2 Update HRD Inertia render paths


  - Change all `Inertia::render('roles.manajer-hrd.` to `Inertia::render('roles.hrd.`
  - Verify all render paths match actual file locations
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 14.3 Delete staf-hrd routes


  - Remove entire `Route::prefix('roles/staf-hrd')` group
  - Verify no references to staf-hrd routes remain
  - _Requirements: 1.4, 1.5_

- [x] 15. Update Marketing Routes





  - Update route prefix, names, and render paths for Marketing
  - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 4.3, 4.4, 8.1, 8.2, 8.3_

- [x] 15.1 Update Marketing route prefix and names


  - Change `Route::prefix('roles/manajer-marketing')` to `Route::prefix('roles/marketing')`
  - Change `->name('manajer-marketing.')` to `->name('marketing.')`
  - Update all nested route names to use `marketing.` prefix
  - _Requirements: 1.1, 1.2, 8.1, 8.2_

- [x] 15.2 Update Marketing Inertia render paths


  - Change all `Inertia::render('roles.manajer-marketing.` to `Inertia::render('roles.marketing.`
  - Verify all render paths match actual file locations
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 16. Update PPIC Routes





  - Update route prefix, names, and render paths for PPIC
  - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 4.3, 4.4, 8.1, 8.2, 8.3_


- [x] 16.1 Update PPIC route prefix and names

  - Change `Route::prefix('roles/manajer-ppic')` to `Route::prefix('roles/ppic')`
  - Change `->name('manajer-ppic.')` to `->name('ppic.')`
  - Update all nested route names to use `ppic.` prefix
  - _Requirements: 1.1, 1.2, 8.1, 8.2_

- [x] 16.2 Update PPIC Inertia render paths


  - Change all `Inertia::render('roles.manajer-ppic.` to `Inertia::render('roles.ppic.`
  - Verify all render paths match actual file locations
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 16.3 Delete staf-ppic routes


  - Remove entire `Route::prefix('roles/staf-ppic')` group
  - Verify no references to staf-ppic routes remain
  - _Requirements: 1.4, 1.5_


- [x] 17. Update Keuangan Routes


  - Update route prefix, names, and render paths for Keuangan
  - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 4.3, 4.4, 8.1, 8.2, 8.3_

- [x] 17.1 Update Keuangan route prefix and names


  - Change `Route::prefix('roles/manajer-keuangan')` to `Route::prefix('roles/keuangan')`
  - Change `->name('manajer-keuangan.')` to `->name('keuangan.')`
  - Update all nested route names to use `keuangan.` prefix
  - _Requirements: 1.1, 1.2, 8.1, 8.2_

- [x] 17.2 Update Keuangan Inertia render paths


  - Change all `Inertia::render('roles.Keuangan.` to `Inertia::render('roles.keuangan.`
  - Verify all render paths match actual file locations
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 17.3 Delete staf-keuangan routes if exist


  - Remove `Route::prefix('roles/staf-keuangan')` group if it exists
  - Verify no references to staf-keuangan routes remain
  - _Requirements: 1.4, 1.5_

- [ ] 18. Update Operasional Routes
  - Update route prefix, names, and render paths for Operasional
  - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 4.3, 4.4, 8.1, 8.2, 8.3_

- [ ] 18.1 Update Operasional route prefix and names
  - Change `Route::prefix('roles/manajer-operasional')` to `Route::prefix('roles/operasional')`
  - Change `->name('manajer-operasional.')` to `->name('operasional.')`
  - Update all nested route names to use `operasional.` prefix
  - _Requirements: 1.1, 1.2, 8.1, 8.2_

- [ ] 18.2 Update Operasional Inertia render paths
  - Change all `Inertia::render('roles.manajer-operasional.` to `Inertia::render('roles.operasional.`
  - Verify all render paths match actual file locations
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 19. Update Produksi Routes (Shared)



  - Update route prefix, names, and render paths for Produksi
  - _Requirements: 1.1, 1.2, 1.3, 3.2, 4.1, 4.2, 4.3, 4.4, 8.1, 8.2, 8.3_

- [x] 19.1 Update Produksi route prefix and names


  - Change `Route::prefix('roles/manajer-produksi')` to `Route::prefix('roles/produksi')`
  - Change `->name('manajer-produksi.')` to `->name('produksi.')`
  - Update all nested route names to use `produksi.` prefix
  - _Requirements: 1.1, 1.2, 3.2, 8.1, 8.2_

- [x] 19.2 Update Produksi Inertia render paths


  - Change all `Inertia::render('roles.manajer-produksi.` to `Inertia::render('roles.produksi.`
  - Verify all render paths match actual file locations
  - _Requirements: 3.2, 4.1, 4.2, 4.3, 4.4_

- [x] 20. Update Produksi Besi Routes





  - Update route prefix, names, and render paths for Produksi Besi
  - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 4.3, 4.4, 8.1, 8.2, 8.3_

- [x] 20.1 Update Produksi Besi route prefix and names


  - Change `Route::prefix('roles/manajer-produksi-besi')` to `Route::prefix('roles/produksi-besi')`
  - Change `->name('manajer-produksi-besi.')` to `->name('produksi-besi.')`
  - Update all nested route names to use `produksi-besi.` prefix
  - _Requirements: 1.1, 1.2, 8.1, 8.2_

- [x] 20.2 Update Produksi Besi Inertia render paths

  - Change all `Inertia::render('roles.manajer-produksi-besi.` to `Inertia::render('roles.produksi-besi.`
  - Verify all render paths match actual file locations
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 20.3 Delete staf-produksi-besi routes

  - Remove entire `Route::prefix('roles/staf-produksi-besi')` group
  - Verify no references to staf-produksi-besi routes remain
  - _Requirements: 1.4, 1.5_

- [x] 21. Update Produksi Kayu Routes





  - Update route prefix, names, and render paths for Produksi Kayu
  - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 4.3, 4.4, 8.1, 8.2, 8.3_

- [x] 21.1 Update Produksi Kayu route prefix and names


  - Change `Route::prefix('roles/manajer-produksi-kayu')` to `Route::prefix('roles/produksi-kayu')`
  - Change `->name('manajer-produksi-kayu.')` to `->name('produksi-kayu.')`
  - Update all nested route names to use `produksi-kayu.` prefix
  - _Requirements: 1.1, 1.2, 8.1, 8.2_

- [x] 21.2 Update Produksi Kayu Inertia render paths


  - Change all `Inertia::render('roles.manajer-produksi-kayu.` to `Inertia::render('roles.produksi-kayu.`
  - Verify all render paths match actual file locations
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 21.3 Delete staf-produksi-kayu routes


  - Remove entire `Route::prefix('roles/staf-produksi-kayu')` group
  - Verify no references to staf-produksi-kayu routes remain
  - _Requirements: 1.4, 1.5_
-


- [x] 22. Update QC Routes (Shared)



  - Update route prefix, names, and render paths for QC

  - _Requirements: 1.1, 1.2, 1.3, 3.1, 4.1, 4.2, 4.3, 4.4, 8.1, 8.2, 8.3_

- [x] 22.1 Merge qc-besi and qc-kayu routes into single qc route


  - Create new `Route::prefix('roles/qc')` group with `->name('qc.')`
  - Merge routes from both qc-besi and qc-kayu into single qc group
  - Update all `Inertia::render('roles.qc-besi.` and `roles.qc-kayu.` to `Inertia::render('roles.qc.`
  - Delete old qc-besi and qc-kayu route groups
  - _Requirements: 1.1, 1.2, 3.1, 4.1, 4.2, 4.3, 4.4, 8.1, 8.2_

- [x] 23. Update Supervisor Routes (Shared)





  - Update route prefix, names, and render paths for Supervisor
  - _Requirements: 1.1, 1.2, 1.3, 3.3, 4.1, 4.2, 4.3, 4.4, 8.1, 8.2, 8.3_


- [x] 23.1 Merge supervisor-besi and supervisor-kayu routes into single supervisor route

  - Create new `Route::prefix('roles/supervisor')` group with `->name('supervisor.')`
  - Merge routes from both supervisor-besi and supervisor-kayu into single supervisor group
  - Update all `Inertia::render('roles.supervisor-besi.` and `roles.supervisor-kayu.` to `Inertia::render('roles.supervisor.`
  - Delete old supervisor-besi and supervisor-kayu route groups
  - _Requirements: 1.1, 1.2, 3.3, 4.1, 4.2, 4.3, 4.4, 8.1, 8.2_

- [ ] 24. Clear Caches and Build
  - Clear all Laravel caches and build frontend
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 24.1 Clear Laravel caches
  - Run `php artisan route:clear`
  - Run `php artisan config:clear`
  - Run `php artisan view:clear`
  - Run `php artisan cache:clear`
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 24.2 Build frontend
  - Run `npm run build` to compile TypeScript and check for errors
  - Verify build completes without errors
  - _Requirements: 9.5_

- [ ] 25. Validation and Testing
  - Validate all changes and test critical functionality
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 25.1 Validate route list
  - Run `php artisan route:list | grep "hrd\|marketing\|ppic\|keuangan\|operasional\|produksi\|qc\|supervisor"`
  - Verify all routes use new prefix without "manajer-" or "staf-"
  - Verify no old routes remain
  - _Requirements: 10.1_

- [ ] 25.2 Check for TypeScript errors
  - Review build output for any TypeScript compilation errors
  - Fix any path-related errors if found
  - _Requirements: 10.3_

- [ ] 25.3 Run diagnostics on changed files
  - Use getDiagnostics tool to check key files for errors
  - Fix any issues found
  - _Requirements: 10.4_

- [ ] 25.4 Manual testing of critical pages
  - Test HRD dashboard and key pages
  - Test Marketing CRM and pesanan pages
  - Test PPIC perencanaan and inventaris pages
  - Test Keuangan dashboard
  - Test QC pages with both QC Besi and QC Kayu roles
  - Test Supervisor pages with both Supervisor roles
  - Test Produksi pages with both Manajer Produksi roles
  - _Requirements: 10.2, 10.5_

- [ ] 26. Cleanup and Documentation
  - Remove backup files and update documentation
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 26.1 Remove backup files
  - Delete `routes/web.php.backup` if all tests pass
  - Remove temporary documentation files
  - _Requirements: 6.5_

- [ ] 26.2 Update project documentation
  - Update any route documentation with new structure
  - Document shared folder usage for future developers
  - _Requirements: 6.5_
