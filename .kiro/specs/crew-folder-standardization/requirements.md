# Requirements Document

## Introduction

This feature aims to standardize the folder structure for crew-besi and crew-kayu to match the organized structure of the base crew folder. Currently, crew-kayu and crew-besi have inconsistent folder structures that make navigation and maintenance difficult. By implementing a standardized structure, we will improve developer experience, ensure consistency across all crew roles, and provide better user experience for crew members.

## Requirements

### Requirement 1

**User Story:** As a developer working on crew features, I want all crew role folders (crew, crew-besi, crew-kayu) to have the same organized structure so that I can easily navigate and maintain the codebase.

#### Acceptance Criteria

1. WHEN a developer navigates to any crew folder THEN the system SHALL display identical subfolder structures (accounts, leave, payroll, profile, schedule, dashboard)
2. WHEN a developer examines file naming conventions THEN the system SHALL show consistent naming patterns across all crew folders
3. WHEN a developer reviews route structures THEN the system SHALL provide standardized URL patterns for all crew roles
4. IF a developer makes changes to one crew structure THEN the system SHALL maintain consistency with other crew structures

### Requirement 2

**User Story:** As a crew-kayu user, I want to have access to the same features as other crew members (accounts, leave, payroll, profile, schedule) through a well-organized interface so that I can manage my work activities effectively.

#### Acceptance Criteria

1. WHEN a crew-kayu user logs in THEN the system SHALL display a dashboard with overview of all available features
2. WHEN a crew-kayu user navigates to any feature THEN the system SHALL provide the same functionality available to other crew members
3. WHEN a crew-kayu user accesses leave management THEN the system SHALL show leave request forms, history, and status tracking
4. WHEN a crew-kayu user views payroll information THEN the system SHALL display salary details and payment history
5. WHEN a crew-kayu user checks schedule THEN the system SHALL show work schedule with integrated attendance functionality

### Requirement 3

**User Story:** As a crew-besi user, I want my attendance/presensi functionality integrated into the schedule page so I have a unified view of my work schedule and attendance without navigating between separate pages.

#### Acceptance Criteria

1. WHEN a crew-besi user accesses the schedule page THEN the system SHALL display both schedule information and attendance controls in a single interface
2. WHEN a crew-besi user performs attendance actions THEN the system SHALL update attendance records without leaving the schedule page
3. WHEN a crew-besi user views their schedule THEN the system SHALL show attendance status for each scheduled work day
4. IF a crew-besi user has existing presensi data THEN the system SHALL preserve all historical attendance records during migration

### Requirement 4

**User Story:** As a system administrator, I want all crew routes to follow consistent URL patterns so that the system is maintainable and predictable.

#### Acceptance Criteria

1. WHEN routes are defined for crew features THEN the system SHALL use consistent URL patterns like /crew-{type}/{feature}
2. WHEN sidebar menus are generated THEN the system SHALL reflect the new standardized structure
3. WHEN users navigate between pages THEN the system SHALL ensure no broken links or 404 errors exist
4. IF old routes are accessed THEN the system SHALL handle them appropriately (either redirect or show proper error)

### Requirement 5

**User Story:** As a crew member of any type, I want a consistent user interface across all crew features so that I can easily learn and use the system regardless of my crew role.

#### Acceptance Criteria

1. WHEN any crew member accesses their dashboard THEN the system SHALL provide a consistent layout and navigation structure
2. WHEN crew members navigate between features THEN the system SHALL maintain consistent UI patterns and interactions
3. WHEN crew members perform similar actions THEN the system SHALL provide identical user experience across all crew types
4. WHEN crew members access forms and data entry THEN the system SHALL use standardized form layouts and validation patterns