# Design Document

## Overview

This design document outlines the standardization of folder structures for crew-besi and crew-kayu to match the organized structure of the base crew folder. The current state shows inconsistencies where crew-kayu already has a proper folder structure but crew-besi uses flat files, and both need alignment with the base crew structure.

## Architecture

### Current State Analysis

**Base Crew Structure (Target Pattern):**
```
crew/
├── accounts/
├── leave/
├── payroll/
├── profile/
├── schedule/
├── accounts.tsx (legacy)
├── dashboard.tsx
├── profile.tsx (legacy)
└── schedule.tsx (legacy)
```

**Crew-Kayu Structure (Partially Standardized):**
```
crew-kayu/
├── accounts/
├── leave/
├── payroll/
├── profile/
├── schedule/
└── dashboard.tsx
```

**Crew-Besi Structure (Needs Standardization):**
```
crew-besi/
├── profile/
├── cuti.tsx
├── presensi.tsx
└── schedule.tsx
```

### Target Architecture

**Standardized Structure for All Crew Types:**
```
crew-{type}/
├── accounts/
│   └── index.tsx
├── leave/
│   ├── index.tsx
│   ├── form.tsx
│   └── history.tsx
├── payroll/
│   ├── index.tsx
│   ├── history.tsx
│   └── detail/
│       └── index.tsx
├── profile/
│   └── index.tsx
├── schedule/
│   └── index.tsx (with integrated presensi for crew-besi)
└── dashboard.tsx
```

## Components and Interfaces

### 1. File Migration Strategy

#### Phase 1: Crew-Kayu Completion
- **Status**: Already has proper folder structure
- **Action**: Verify all subfolders have proper index.tsx files
- **Special Handling**: None required

#### Phase 2: Crew-Besi Restructuring
- **Current Files to Migrate**:
  - `cuti.tsx` → `leave/index.tsx`
  - `presensi.tsx` + `schedule.tsx` → `schedule/index.tsx` (integrated)
  - Create missing folders: `accounts/`, `payroll/`
  - Create `dashboard.tsx` from template

### 2. Content Templates

#### Dashboard Template
- **Source**: `resources/js/pages/roles/crew/dashboard.tsx`
- **Customization**: Adapt role-specific metrics and data
- **Components**: Cards for quick stats, navigation shortcuts, recent activities

#### Leave Management Template
- **Source**: `resources/js/pages/roles/crew/leave/`
- **Files**: 
  - `index.tsx` - Main leave overview
  - `form.tsx` - Leave request form
  - `history.tsx` - Leave history tracking

#### Payroll Template
- **Source**: `resources/js/pages/roles/crew/payroll/`
- **Files**:
  - `index.tsx` - Current payroll info
  - `history.tsx` - Payroll history
  - `detail/index.tsx` - Detailed payroll view

#### Accounts Template
- **Source**: `resources/js/pages/roles/crew/accounts/`
- **Files**: `index.tsx` - Account management

#### Profile Template
- **Source**: `resources/js/pages/roles/crew/profile/`
- **Files**: `index.tsx` - Profile management

#### Schedule Template (Special Integration)
- **Base Source**: `resources/js/pages/roles/crew/schedule/index.tsx`
- **For Crew-Besi**: Integrate presensi functionality from `presensi.tsx`
- **Integration Points**:
  - Attendance controls within schedule view
  - Real-time attendance status
  - Historical attendance data
  - Clock in/out functionality

### 3. Route Structure Design

#### Current Route Patterns
```php
// Crew-Kayu (Standardized)
Route::prefix('roles/crew-kayu')->group(function () {
    Route::get('', ...)->name('crew-kayu.dashboard');
    Route::get('profile', ...)->name('crew-kayu.profile');
    Route::get('schedule', ...)->name('crew-kayu.schedule');
    Route::prefix('leave')->name('crew-kayu.leave.')->group(...);
    Route::prefix('payroll')->name('crew-kayu.payroll.')->group(...);
    Route::prefix('accounts')->name('crew-kayu.accounts.')->group(...);
});

// Crew-Besi (Needs Standardization)
Route::prefix('roles/crew-besi')->group(function () {
    Route::get('', ...)->name('crew-besi.dashboard');
    Route::get('profile', ...)->name('crew-besi.profile');
    Route::get('schedule', ...)->name('crew-besi.schedule');
    Route::get('presensi', ...)->name('crew-besi.presensi'); // TO BE REMOVED
    Route::get('cuti', ...)->name('crew-besi.cuti'); // TO BE MIGRATED
    // Missing: accounts, payroll subgroups
});
```

#### Target Route Structure
```php
// Standardized for both crew-kayu and crew-besi
Route::prefix('roles/crew-{type}')->group(function () {
    Route::get('', ...)->name('crew-{type}.dashboard');
    Route::get('profile', ...)->name('crew-{type}.profile');
    Route::get('schedule', ...)->name('crew-{type}.schedule');
    
    Route::prefix('leave')->name('crew-{type}.leave.')->group(function () {
        Route::get('', ...)->name('index');
        Route::get('form', ...)->name('form');
        Route::get('history', ...)->name('history');
    });
    
    Route::prefix('payroll')->name('crew-{type}.payroll.')->group(function () {
        Route::get('', ...)->name('index');
        Route::get('history', ...)->name('history');
        Route::get('detail/{id}', ...)->name('detail');
    });
    
    Route::prefix('accounts')->name('crew-{type}.accounts.')->group(function () {
        Route::get('', ...)->name('index');
    });
});
```

### 4. Navigation Menu Design

#### Current Sidebar Configuration
- Crew-Kayu: Properly structured menu items
- Crew-Besi: Missing some menu items, inconsistent structure

#### Target Sidebar Structure
```typescript
crew_kayu: [
  { title: 'Dashboard', href: '/roles/crew-kayu', icon: LayoutGrid },
  { title: 'Profil', href: '/roles/crew-kayu/profile', icon: User },
  { title: 'Jadwal', href: '/roles/crew-kayu/schedule', icon: Calendar },
  { title: 'Pengajuan Cuti', href: '/roles/crew-kayu/leave', icon: FileText },
  { title: 'Slip Gaji', href: '/roles/crew-kayu/payroll', icon: CreditCard },
  { title: 'Kelola Rekening', href: '/roles/crew-kayu/accounts', icon: CreditCard },
],

crew_besi: [
  { title: 'Dashboard', href: '/roles/crew-besi', icon: LayoutGrid },
  { title: 'Profil', href: '/roles/crew-besi/profile', icon: User },
  { title: 'Jadwal', href: '/roles/crew-besi/schedule', icon: Calendar }, // Integrated presensi
  { title: 'Pengajuan Cuti', href: '/roles/crew-besi/leave', icon: FileText },
  { title: 'Slip Gaji', href: '/roles/crew-besi/payroll', icon: CreditCard },
  { title: 'Kelola Rekening', href: '/roles/crew-besi/accounts', icon: CreditCard },
]
```

## Data Models

### 1. File Structure Model
```typescript
interface CrewFolderStructure {
  type: 'crew' | 'crew-kayu' | 'crew-besi';
  basePath: string;
  folders: {
    accounts: CrewFolder;
    leave: CrewFolder;
    payroll: CrewFolder;
    profile: CrewFolder;
    schedule: CrewFolder;
  };
  dashboard: string;
}

interface CrewFolder {
  path: string;
  files: string[];
  hasIndex: boolean;
}
```

### 2. Migration Tracking Model
```typescript
interface MigrationStep {
  id: string;
  phase: 'crew-kayu' | 'crew-besi';
  action: 'create-folder' | 'migrate-file' | 'update-route' | 'update-menu';
  source?: string;
  target: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  dependencies: string[];
}
```

### 3. Route Configuration Model
```typescript
interface RouteConfig {
  crewType: string;
  prefix: string;
  routes: {
    dashboard: RouteDefinition;
    profile: RouteDefinition;
    schedule: RouteDefinition;
    leave: RouteGroup;
    payroll: RouteGroup;
    accounts: RouteGroup;
  };
}

interface RouteDefinition {
  path: string;
  name: string;
  component: string;
  controller?: string;
}

interface RouteGroup {
  prefix: string;
  name: string;
  routes: RouteDefinition[];
}
```

## Error Handling

### 1. Migration Errors
- **File Not Found**: Graceful handling when source files don't exist
- **Permission Errors**: Proper error messages for file system permissions
- **Route Conflicts**: Detection and resolution of duplicate route names
- **Component Import Errors**: Validation of component paths and imports

### 2. Runtime Errors
- **Missing Components**: Fallback components for missing pages
- **Route Resolution**: 404 handling for old routes
- **Navigation Errors**: Graceful handling of broken menu links

### 3. Rollback Strategy
- **File Backup**: Create backups before migration
- **Route Restoration**: Ability to restore previous route configuration
- **Menu Rollback**: Revert sidebar menu changes if needed

## Testing Strategy

### 1. Pre-Migration Testing
- **File Structure Validation**: Verify current structure matches expectations
- **Route Testing**: Ensure all current routes work before migration
- **Component Loading**: Verify all existing components load correctly

### 2. Migration Testing
- **Step-by-Step Validation**: Test each migration step independently
- **Route Verification**: Ensure new routes work correctly
- **Component Integration**: Test integrated presensi functionality
- **Navigation Testing**: Verify sidebar menu updates work

### 3. Post-Migration Testing
- **End-to-End Testing**: Full user journey testing for each crew type
- **Cross-Browser Testing**: Ensure compatibility across browsers
- **Performance Testing**: Verify no performance degradation
- **User Acceptance Testing**: Validate user experience improvements

### 4. Automated Testing
```typescript
// Example test structure
describe('Crew Folder Standardization', () => {
  describe('File Structure', () => {
    test('crew-kayu has standardized structure');
    test('crew-besi has standardized structure');
    test('all folders have index.tsx files');
  });
  
  describe('Routes', () => {
    test('all crew routes are accessible');
    test('old routes are properly handled');
    test('route naming is consistent');
  });
  
  describe('Navigation', () => {
    test('sidebar menu reflects new structure');
    test('all menu links work correctly');
    test('navigation is consistent across crew types');
  });
  
  describe('Integration', () => {
    test('presensi integration in crew-besi schedule works');
    test('all existing functionality is preserved');
    test('no broken components or imports');
  });
});
```

## Implementation Considerations

### 1. Backward Compatibility
- **Graceful Degradation**: Handle old bookmarks and direct links
- **Route Redirects**: Consider temporary redirects for frequently used old routes
- **Data Preservation**: Ensure no data loss during migration

### 2. Performance Impact
- **Bundle Size**: Monitor impact on JavaScript bundle size
- **Load Times**: Ensure page load times don't increase
- **Memory Usage**: Verify no memory leaks from component changes

### 3. User Experience
- **Minimal Disruption**: Perform migration during low-usage periods
- **User Communication**: Inform users of changes if necessary
- **Training**: Update documentation and user guides

### 4. Maintenance
- **Code Consistency**: Ensure all crew types follow same patterns
- **Future Extensibility**: Design for easy addition of new crew types
- **Documentation**: Maintain clear documentation of structure standards

## Security Considerations

### 1. Route Security
- **Permission Validation**: Ensure role-based access controls are maintained
- **Route Protection**: Verify all new routes have proper middleware
- **CSRF Protection**: Maintain CSRF protection on all forms

### 2. File Security
- **Path Traversal**: Prevent directory traversal attacks
- **File Permissions**: Ensure proper file system permissions
- **Component Security**: Validate all component imports and exports

## Deployment Strategy

### 1. Phased Deployment
- **Phase 1**: Deploy crew-kayu standardization
- **Phase 2**: Deploy crew-besi standardization
- **Rollback Plan**: Ability to rollback each phase independently

### 2. Monitoring
- **Error Tracking**: Monitor for new errors after deployment
- **Performance Monitoring**: Track page load times and user interactions
- **User Feedback**: Collect feedback on navigation and usability

### 3. Validation
- **Smoke Tests**: Basic functionality tests after deployment
- **Integration Tests**: Verify all systems work together
- **User Acceptance**: Confirm user requirements are met