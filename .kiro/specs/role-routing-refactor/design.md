# Design Document

## Overview

Refactoring sistem routing dan folder structure untuk role-based pages bertujuan untuk menyederhanakan URL dan struktur kode dengan menghilangkan prefix "manajer-" dan "staf-". Design ini memastikan bahwa semua fungsionalitas UI/UX yang sudah berjalan dengan baik tetap dipertahankan, sambil membuat struktur yang lebih clean, maintainable, dan konsisten.

Perubahan utama meliputi:
- Migrasi route prefix dari `manajer-{dept}` ke `{dept}`
- Reorganisasi folder structure dari `manajer-{dept}/` ke `{dept}/`
- Penghapusan semua route dan folder "staf-" (tidak ada role staf di sistem)
- Implementasi shared folders untuk multiple roles (qc, produksi, supervisor, crew)
- Update controller namespace dan imports
- Preserve semua existing functionality

## Architecture

### Current Architecture

```
routes/web.php
├── Route::prefix('roles/manajer-ppic')
├── Route::prefix('roles/staf-ppic')
├── Route::prefix('roles/manajer-hrd')
├── Route::prefix('roles/staf-hrd')
└── ... (other manajer-* and staf-* routes)

resources/js/pages/roles/
├── manajer-ppic/
├── staf-ppic/
├── manajer-hrd/
├── staf-hrd/
└── ... (other manajer-* and staf-* folders)

app/Http/Controllers/
├── ManajerPpic/
├── ManajerHrd/
├── ManajerKeuangan/
└── ManajerMarketing/
```

### Target Architecture

```
routes/web.php
├── Route::prefix('roles/ppic')
├── Route::prefix('roles/hrd')
├── Route::prefix('roles/marketing')
├── Route::prefix('roles/keuangan')
├── Route::prefix('roles/operasional')
├── Route::prefix('roles/produksi')        [SHARED: Manajer Produksi Besi & Kayu]
├── Route::prefix('roles/produksi-besi')
├── Route::prefix('roles/produksi-kayu')
├── Route::prefix('roles/qc')              [SHARED: QC Besi & Kayu]
├── Route::prefix('roles/supervisor')      [SHARED: Supervisor Besi & Kayu]
└── Route::prefix('roles/crew')            [SHARED: Crew Besi & Kayu - already exists]

resources/js/pages/roles/
├── ppic/
├── hrd/
├── marketing/
├── keuangan/
├── operasional/
├── produksi/          [SHARED FOLDER]
├── produksi-besi/
├── produksi-kayu/
├── qc/                [SHARED FOLDER]
├── supervisor/        [SHARED FOLDER]
└── crew/              [SHARED FOLDER - already exists]

app/Http/Controllers/
├── Ppic/
├── Hrd/
├── Marketing/
├── Keuangan/
├── Operasional/
├── Produksi/
├── ProduksiBesi/
└── ProduksiKayu/
```

## Components and Interfaces

### 1. Route Configuration Component

**Location:** `routes/web.php`

**Responsibilities:**
- Define all role-based routes with new prefix structure
- Apply middleware for authentication and role permission
- Map routes to controllers and Inertia pages
- Maintain route naming convention

**Interface Pattern:**
```php
Route::prefix('roles/{departemen}')
    ->middleware(['auth', 'role.permission'])
    ->name('{departemen}.')
    ->group(function () {
        Route::get('/', fn() => Inertia::render('roles.{departemen}.dashboard'))->name('index');
        
        Route::prefix('{section}')->name('{section}.')->group(function () {
            Route::get('{page}', fn() => Inertia::render('roles.{departemen}.{section}.{page}'))->name('{page}');
        });
    });
```

**Key Changes:**
- Remove `manajer-` and `staf-` prefixes
- Update route names to match new structure
- Update Inertia render paths
- Update controller imports and references

### 2. Frontend Page Component

**Location:** `resources/js/pages/roles/{departemen}/`

**Responsibilities:**
- Render UI/UX for specific department pages
- Handle user interactions and form submissions
- Use route helpers with new route names
- Maintain existing functionality

**Structure Pattern:**
```
{departemen}/
├── dashboard.tsx
├── {section}/
│   ├── index.tsx
│   ├── {page}.tsx
│   └── {subsection}/
│       └── {page}.tsx
```

**Key Changes:**
- Move from `manajer-{departemen}/` to `{departemen}/`
- Delete all `staf-{departemen}/` folders
- Merge duplicate folders (e.g., marketing)
- Create shared folders for multi-role access

### 3. Controller Component

**Location:** `app/Http/Controllers/{Departemen}/`

**Responsibilities:**
- Handle business logic for department operations
- Process requests and return responses
- Interact with models and services
- Return Inertia responses with correct paths

**Namespace Pattern:**
```php
namespace App\Http\Controllers\{Departemen};

use Inertia\Inertia;

class {Controller} extends Controller
{
    public function index()
    {
        return Inertia::render('roles.{departemen}.{page}', [
            // data
        ]);
    }
}
```

**Key Changes:**
- Move from `Manajer{Departemen}/` to `{Departemen}/`
- Update namespace declarations
- Update Inertia render paths in controllers
- Update imports in routes/web.php

### 4. Shared Folder Component

**Location:** `resources/js/pages/roles/{shared-folder}/`

**Responsibilities:**
- Provide common UI/UX for multiple related roles
- Support role-specific data filtering via middleware
- Maintain single source of truth for shared functionality

**Shared Folders:**
1. **crew/** - Used by: Crew Besi, Crew Kayu (already exists)
2. **qc/** - Used by: QC Besi, QC Kayu
3. **supervisor/** - Used by: Supervisor Besi, Supervisor Kayu
4. **produksi/** - Used by: Manajer Produksi Besi, Manajer Produksi Kayu

**Implementation Strategy:**
- Merge existing separate folders (qc-besi, qc-kayu) into single qc folder
- Merge supervisor-besi, supervisor-kayu into single supervisor folder
- Keep manajer-produksi as produksi (shared)
- Keep produksi-besi and produksi-kayu for material-specific pages
- Use role-based logic in components to show/hide features

## Data Models

### Route Mapping Model

```typescript
interface RouteMapping {
  oldPrefix: string;        // e.g., "manajer-ppic"
  newPrefix: string;        // e.g., "ppic"
  oldName: string;          // e.g., "manajer-ppic.dashboard"
  newName: string;          // e.g., "ppic.dashboard"
  oldRenderPath: string;    // e.g., "roles.manajer-ppic.dashboard"
  newRenderPath: string;    // e.g., "roles.ppic.dashboard"
  action: 'migrate' | 'delete' | 'merge';
}
```

### Folder Mapping Model

```typescript
interface FolderMapping {
  oldPath: string;          // e.g., "resources/js/pages/roles/manajer-ppic"
  newPath: string;          // e.g., "resources/js/pages/roles/ppic"
  action: 'move' | 'delete' | 'merge';
  isShared: boolean;        // true for qc, supervisor, crew, produksi
  roles: string[];          // roles that use this folder
}
```

### Controller Mapping Model

```typescript
interface ControllerMapping {
  oldNamespace: string;     // e.g., "App\\Http\\Controllers\\ManajerPpic"
  newNamespace: string;     // e.g., "App\\Http\\Controllers\\Ppic"
  oldPath: string;          // e.g., "app/Http/Controllers/ManajerPpic"
  newPath: string;          // e.g., "app/Http/Controllers/Ppic"
  files: string[];          // list of controller files to update
}
```

## Detailed Migration Mapping

### Department Mappings

| Department | Old Route Prefix | New Route Prefix | Old Folder | New Folder | Shared | Roles |
|------------|-----------------|------------------|------------|------------|--------|-------|
| HRD | `manajer-hrd` | `hrd` | `manajer-hrd/` | `hrd/` | No | Manajer HRD |
| | `staf-hrd` | ❌ DELETE | `staf-hrd/` | ❌ DELETE | - | - |
| Marketing | `manajer-marketing` | `marketing` | `manajer-marketing/` | `marketing/` (merge) | No | Manajer Marketing |
| PPIC | `manajer-ppic` | `ppic` | `manajer-ppic/` | `ppic/` | No | Manajer PPIC |
| | `staf-ppic` | ❌ DELETE | `staf-ppic/` | ❌ DELETE | - | - |
| Keuangan | `manajer-keuangan` | `keuangan` | `Keuangan/` | `keuangan/` (lowercase) | No | Manajer Keuangan |
| | `staf-keuangan` | ❌ DELETE | `staf-keuangan/` | ❌ DELETE | - | - |
| Operasional | `manajer-operasional` | `operasional` | `manajer-operasional/` | `operasional/` | No | Manajer Operasional |
| Produksi | `manajer-produksi` | `produksi` | `manajer-produksi/` | `produksi/` | **Yes** | Manajer Produksi Besi, Manajer Produksi Kayu |
| Produksi Besi | `manajer-produksi-besi` | `produksi-besi` | `manajer-produksi-besi/` | `produksi-besi/` | No | Manajer Produksi Besi |
| | `staf-produksi-besi` | ❌ DELETE | `staf-produksi-besi/` | ❌ DELETE | - | - |
| Produksi Kayu | `manajer-produksi-kayu` | `produksi-kayu` | `manajer-produksi-kayu/` | `produksi-kayu/` | No | Manajer Produksi Kayu |
| | `staf-produksi-kayu` | ❌ DELETE | `staf-produksi-kayu/` | ❌ DELETE | - | - |
| QC | `qc-besi` | `qc` | `qc-besi/` | `qc/` (merge) | **Yes** | QC Besi, QC Kayu |
| | `qc-kayu` | `qc` | `qc-kayu/` | `qc/` (merge) | **Yes** | QC Besi, QC Kayu |
| Supervisor | `supervisor-besi` | `supervisor` | `supervisor-besi/` | `supervisor/` (merge) | **Yes** | Supervisor Besi, Supervisor Kayu |
| | `supervisor-kayu` | `supervisor` | `supervisor-kayu/` | `supervisor/` (merge) | **Yes** | Supervisor Besi, Supervisor Kayu |
| Crew | `crew` | `crew` | `crew/` | `crew/` (keep) | **Yes** | Crew Besi, Crew Kayu |

### Controller Namespace Mappings

| Old Namespace | New Namespace | Old Path | New Path |
|---------------|---------------|----------|----------|
| `App\Http\Controllers\ManajerHrd` | `App\Http\Controllers\Hrd` | `app/Http/Controllers/ManajerHrd/` | `app/Http/Controllers/Hrd/` |
| `App\Http\Controllers\ManajerMarketing` | `App\Http\Controllers\Marketing` | `app/Http/Controllers/ManajerMarketing/` | `app/Http/Controllers/Marketing/` |
| `App\Http\Controllers\ManajerPpic` | `App\Http\Controllers\Ppic` | `app/Http/Controllers/ManajerPpic/` | `app/Http/Controllers/Ppic/` |
| `App\Http\Controllers\ManajerKeuangan` | `App\Http\Controllers\Keuangan` | `app/Http/Controllers/ManajerKeuangan/` | `app/Http/Controllers/Keuangan/` (merge) |

**Note:** `app/Http/Controllers/Keuangan/` already exists, so merge ManajerKeuangan into it.

## Error Handling

### Migration Errors

**Error Type:** File/Folder Not Found
- **Cause:** Attempting to move non-existent files
- **Handling:** Check existence before move, log warning if not found
- **Recovery:** Skip the file and continue with next

**Error Type:** Namespace Conflict
- **Cause:** Controller namespace already exists
- **Handling:** Check for conflicts before migration
- **Recovery:** Merge or rename conflicting files

**Error Type:** Route Name Conflict
- **Cause:** New route name already in use
- **Handling:** Validate route names before applying
- **Recovery:** Use unique naming or merge routes

### Runtime Errors

**Error Type:** 404 Not Found
- **Cause:** Route or page not properly migrated
- **Handling:** Ensure all routes point to correct Inertia paths
- **Recovery:** Fix route or render path

**Error Type:** Controller Not Found
- **Cause:** Controller namespace not updated
- **Handling:** Update all controller imports in routes
- **Recovery:** Fix namespace or import statement

**Error Type:** TypeScript Compilation Error
- **Cause:** Invalid import paths in frontend
- **Handling:** Update all import statements to use new paths
- **Recovery:** Fix import paths and rebuild

### Validation Strategy

1. **Pre-Migration Validation:**
   - List all files to be moved
   - Check for conflicts
   - Verify controller existence
   - Validate route structure

2. **Post-Migration Validation:**
   - Run `php artisan route:list` to verify routes
   - Check TypeScript compilation
   - Test critical pages manually
   - Run diagnostics on changed files

3. **Rollback Strategy:**
   - Keep backup of original files
   - Document all changes made
   - Provide rollback script if needed

## Testing Strategy

### Unit Testing

**Not Required** - This is a structural refactoring without business logic changes.

### Integration Testing

**Manual Testing Required:**

1. **Route Testing:**
   - Access each department dashboard
   - Navigate through nested routes
   - Verify middleware applies correctly
   - Test form submissions

2. **Page Rendering Testing:**
   - Verify all pages render correctly
   - Check for missing components
   - Validate data loading
   - Test user interactions

3. **Shared Folder Testing:**
   - Test QC pages with both QC Besi and QC Kayu roles
   - Test Supervisor pages with both Supervisor roles
   - Test Produksi pages with both Manajer Produksi roles
   - Test Crew pages with both Crew roles

### Validation Testing

1. **Route List Validation:**
```bash
php artisan route:list | grep "ppic\|hrd\|marketing\|keuangan"
```
Expected: All routes use new prefix without "manajer-" or "staf-"

2. **TypeScript Compilation:**
```bash
npm run build
```
Expected: No compilation errors

3. **Diagnostics Check:**
```bash
# Check specific files for errors
```
Expected: No errors in migrated files

### Test Cases

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| TC-01 | Access `/roles/ppic/dashboard` | Dashboard renders correctly |
| TC-02 | Access old route `/roles/manajer-ppic/dashboard` | 404 or redirect to new route |
| TC-03 | Submit form on PPIC pesanan page | Form submits successfully |
| TC-04 | Navigate from HRD dashboard to karyawan page | Navigation works correctly |
| TC-05 | Access QC dashboard as QC Besi | Page renders with Besi-specific data |
| TC-06 | Access QC dashboard as QC Kayu | Page renders with Kayu-specific data |
| TC-07 | Access Supervisor dashboard as Supervisor Besi | Page renders correctly |
| TC-08 | Access Produksi dashboard as Manajer Produksi Besi | Page renders correctly |
| TC-09 | Check route list | No routes with "manajer-" or "staf-" prefix |
| TC-10 | Build frontend | No TypeScript errors |

## Implementation Phases

### Phase 1: Preparation & Backup
- Create backup of routes/web.php
- Create backup of controller folders
- Create backup of frontend folders
- Document current state

### Phase 2: Controller Migration
- Move controller folders
- Update namespaces in controller files
- Update imports in routes/web.php
- Verify controller structure

### Phase 3: Frontend Migration
- Move department folders
- Delete staf folders
- Merge duplicate folders (marketing, keuangan)
- Create/merge shared folders (qc, supervisor)
- Verify folder structure

### Phase 4: Route Updates
- Update route prefixes
- Update route names
- Update Inertia render paths
- Update controller references
- Remove staf routes

### Phase 5: Testing & Validation
- Clear all caches
- Build frontend
- Test critical routes
- Run diagnostics
- Manual testing

### Phase 6: Cleanup
- Remove old folders
- Remove backup files (if successful)
- Update documentation
- Commit changes

## Security Considerations

### Authentication & Authorization

- **Middleware Preservation:** All `auth` and `role.permission` middleware must remain intact
- **Role-Based Access:** Shared folders must respect role permissions
- **Session Management:** No changes to authentication flow

### Data Access Control

- **Controller Authorization:** Maintain existing authorization checks in controllers
- **Frontend Guards:** Keep role-based UI guards in components
- **API Endpoints:** Ensure all API routes maintain proper authorization

## Performance Considerations

### Build Performance

- **Frontend Build:** Single build after all changes complete
- **Route Caching:** Clear and rebuild route cache once
- **View Caching:** Clear view cache after Inertia path changes

### Runtime Performance

- **No Impact:** Structural changes don't affect runtime performance
- **Route Resolution:** Same performance as before (just different names)
- **Page Loading:** No changes to page loading logic

## Maintenance Considerations

### Future Development

- **Naming Convention:** Use department names directly (no prefixes)
- **Shared Folders:** Add new shared folders as needed for multi-role features
- **Route Structure:** Maintain consistent route naming pattern

### Documentation Updates

- **Route Documentation:** Update any route documentation
- **Developer Guide:** Update onboarding docs with new structure
- **API Documentation:** Update if any API routes affected

## Dependencies

### External Dependencies

- **Laravel Framework:** No version changes required
- **Inertia.js:** No version changes required
- **React/TypeScript:** No version changes required

### Internal Dependencies

- **Middleware:** `auth`, `role.permission` - No changes
- **Models:** No changes required
- **Services:** No changes required
- **Database:** No changes required

## Rollback Plan

### Rollback Triggers

- Critical functionality broken
- Multiple pages returning 404
- TypeScript compilation fails
- Database errors (unlikely but possible)

### Rollback Steps

1. Restore routes/web.php from backup
2. Restore controller folders from backup
3. Restore frontend folders from backup
4. Clear all caches
5. Rebuild frontend
6. Test critical functionality

### Rollback Validation

- All original routes accessible
- All pages render correctly
- No errors in logs
- User can perform critical operations

## Success Criteria

1. ✅ All routes use new prefix structure (no "manajer-" or "staf-")
2. ✅ All folders follow new naming convention
3. ✅ All controllers use new namespace
4. ✅ No TypeScript compilation errors
5. ✅ All critical pages accessible and functional
6. ✅ Shared folders work for multiple roles
7. ✅ No broken links or 404 errors
8. ✅ All middleware and authorization working
9. ✅ Frontend builds successfully
10. ✅ Manual testing passes for all departments
