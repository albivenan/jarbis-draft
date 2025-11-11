# Implementation Plan

- [x] 1. Phase 1: Crew-Kayu Structure Verification and Completion





  - Verify crew-kayu folder structure matches target design
  - Ensure all subfolders have proper index.tsx files
  - Create any missing components using crew base templates
  - _Requirements: 1.1, 2.1, 2.2, 5.1_

- [x] 1.1 Verify crew-kayu folder structure completeness


  - Check that all required subfolders exist (accounts, leave, payroll, profile, schedule)
  - Validate that each subfolder has proper index.tsx files
  - Document any missing components or files
  - _Requirements: 1.1, 2.1_

- [x] 1.2 Create missing crew-kayu components from templates


  - Copy missing index.tsx files from crew base folder templates
  - Adapt component imports and role-specific data handling
  - Ensure proper TypeScript interfaces and props
  - _Requirements: 2.2, 5.3_

- [x] 1.3 Write unit tests for crew-kayu components







  - Create unit tests for each crew-kayu component
  - Test component rendering and basic functionality
  - Validate role-specific data handling
  - _Requirements: 2.1, 2.2_

- [x] 2. Phase 2: Crew-Besi Folder Structure Creation





  - Create standardized folder structure for crew-besi
  - Set up all required subfolders with proper organization
  - Prepare folder structure to match crew and crew-kayu patterns
  - _Requirements: 1.1, 3.1, 4.1_

- [x] 2.1 Create crew-besi standardized folder structure


  - Create accounts/, leave/, payroll/, schedule/ subfolders
  - Keep existing profile/ folder
  - Set up proper directory permissions and organization
  - _Requirements: 1.1, 4.1_

- [x] 2.2 Create crew-besi dashboard component


  - Copy dashboard.tsx template from crew base folder
  - Adapt for crew-besi specific metrics and data
  - Implement role-specific dashboard widgets and navigation
  - _Requirements: 3.1, 5.1, 5.2_

- [x] 2.3 Create crew-besi accounts management component


  - Create accounts/index.tsx using crew template
  - Implement account management functionality for crew-besi
  - Ensure proper data binding and form handling
  - _Requirements: 2.2, 5.3_

- [x] 2.4 Create crew-besi payroll components


  - Create payroll/index.tsx, payroll/history.tsx, and payroll/detail/index.tsx
  - Copy and adapt from crew base templates
  - Implement crew-besi specific payroll data handling
  - _Requirements: 2.2, 5.3_

- [x] 3. Crew-Besi Content Migration and Integration





  - Migrate existing crew-besi files to new structure
  - Integrate presensi functionality into schedule component
  - Ensure all existing functionality is preserved
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3.1 Migrate crew-besi cuti.tsx to leave structure


  - Move cuti.tsx content to leave/index.tsx
  - Create leave/form.tsx and leave/history.tsx from templates
  - Adapt existing cuti functionality to new leave structure
  - Ensure all existing leave request features work correctly
  - _Requirements: 3.1, 3.4_

- [x] 3.2 Integrate presensi functionality into crew-besi schedule


  - Merge presensi.tsx functionality into schedule/index.tsx
  - Combine schedule display with attendance controls
  - Implement unified schedule and attendance interface
  - Preserve all existing presensi features and data
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 3.3 Remove obsolete crew-besi files


  - Delete presensi.tsx after successful integration
  - Remove cuti.tsx after migration to leave structure
  - Clean up any unused imports or references
  - _Requirements: 3.1, 3.4_

- [ ]* 3.4 Write integration tests for crew-besi components
  - Test presensi integration in schedule component
  - Verify leave migration functionality works correctly
  - Test all crew-besi specific features
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 4. Route Configuration Updates





  - Update web.php routes to match new folder structure
  - Ensure consistent route naming and organization
  - Remove obsolete routes and add missing ones
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 4.1 Update crew-besi routes in web.php


  - Remove obsolete presensi and cuti routes
  - Add missing accounts and payroll route groups
  - Ensure route naming follows consistent patterns
  - Update route handlers to point to new component locations
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 4.2 Verify crew-kayu routes consistency


  - Review existing crew-kayu routes for consistency
  - Ensure all routes follow standardized naming patterns
  - Update any inconsistent route configurations
  - _Requirements: 4.1, 4.2_

- [x] 4.3 Implement route validation and error handling


  - Add proper middleware to all crew routes
  - Implement consistent error handling for missing routes
  - Ensure proper role-based access control
  - _Requirements: 4.4_

- [ ]* 4.4 Write route tests
  - Create tests for all crew route configurations
  - Test route accessibility and permissions
  - Verify route naming consistency
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 5. Sidebar Menu Configuration Updates





  - Update sidebar-menu.ts to reflect new structure
  - Ensure consistent navigation across all crew types
  - Remove obsolete menu items and add missing ones
  - _Requirements: 4.2, 5.1, 5.2_

- [x] 5.1 Update crew-besi sidebar menu configuration


  - Remove presensi menu item (integrated into schedule)
  - Update cuti menu item to point to leave routes
  - Add missing accounts and payroll menu items
  - Ensure menu structure matches crew-kayu pattern
  - _Requirements: 4.2, 5.1, 5.2_

- [x] 5.2 Verify sidebar menu consistency across crew types


  - Compare crew, crew-kayu, and crew-besi menu configurations
  - Ensure identical structure and naming patterns
  - Update icons and titles for consistency
  - _Requirements: 5.1, 5.2_

- [ ]* 5.3 Write navigation tests
  - Test sidebar menu rendering for all crew types
  - Verify all menu links work correctly
  - Test menu consistency across different crew roles
  - _Requirements: 5.1, 5.2_

- [x] 6. Final Integration and Validation





  - Perform end-to-end testing of all crew folder structures
  - Validate that all functionality works correctly
  - Ensure no regressions in existing features
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

- [x] 6.1 Perform comprehensive functionality testing


  - Test all crew-kayu features work correctly
  - Test all crew-besi features including integrated presensi
  - Verify navigation between all pages works smoothly
  - Test form submissions and data persistence
  - _Requirements: 2.1, 2.2, 3.1, 3.2, 5.3_

- [x] 6.2 Validate route and navigation consistency


  - Test all routes are accessible and work correctly
  - Verify sidebar navigation reflects new structure
  - Ensure no broken links or 404 errors
  - Test URL patterns are consistent across crew types
  - _Requirements: 4.1, 4.2, 4.3, 5.1, 5.2_

- [x] 6.3 Clean up and optimize code structure


  - Remove any unused imports or components
  - Ensure consistent code formatting and style
  - Optimize component imports and bundle size
  - Update any remaining hardcoded paths or references
  - _Requirements: 1.1, 1.2, 1.3_

- [ ]* 6.4 Write comprehensive end-to-end tests
  - Create E2E tests for complete user journeys
  - Test crew-kayu user workflow from dashboard to all features
  - Test crew-besi user workflow including integrated presensi
  - Verify cross-browser compatibility
  - _Requirements: 2.1, 2.2, 3.1, 3.2, 5.3_