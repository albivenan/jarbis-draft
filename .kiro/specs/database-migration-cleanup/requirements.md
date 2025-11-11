# Requirements Document

## Introduction

This feature involves cleaning up existing migration tables and restructuring the system to use external database as the primary data source while maintaining essential authentication functionality for session management.

## Requirements

### Requirement 1

**User Story:** As a system administrator, I want to remove unnecessary local database tables so that the system relies entirely on external server data

#### Acceptance Criteria

1. WHEN the system starts THEN employees table SHALL be empty or removed
2. WHEN the system starts THEN departments table SHALL be empty or removed  
3. WHEN session management is needed THEN password_resets and sessions tables SHALL remain functional
4. WHEN authentication occurs THEN users table SHALL contain only authentication data for employee sessions

### Requirement 2

**User Story:** As a developer, I want to maintain authentication functionality so that user sessions can still be managed locally

#### Acceptance Criteria

1. WHEN an employee logs in THEN users table SHALL store authentication data linked to employee from external server
2. WHEN session management occurs THEN Laravel's built-in session system SHALL continue to work
3. WHEN user authentication is validated THEN system SHALL reference external server data for employee details
4. IF authentication fails THEN system SHALL handle errors gracefully without breaking

### Requirement 3

**User Story:** As a developer, I want to update models to work with external data so that the application functions correctly with server-based data

#### Acceptance Criteria

1. WHEN Employee model is accessed THEN it SHALL fetch data from external API endpoints
2. WHEN Department model is accessed THEN it SHALL fetch data from external API endpoints
3. WHEN User model is accessed THEN it SHALL handle authentication while referencing external employee data
4. IF external API is unavailable THEN system SHALL handle errors gracefully

### Requirement 4

**User Story:** As a system user, I want existing functionality to remain available so that current features continue to work

#### Acceptance Criteria

1. WHEN role system is accessed THEN it SHALL continue to function with external data
2. WHEN attendance calendar is used THEN it SHALL display data from external server
3. WHEN dashboard features are accessed THEN they SHALL work with external employee data
4. WHEN any existing feature is used THEN it SHALL not break due to database changes

### Requirement 5

**User Story:** As a developer, I want to clean up unnecessary seeder files so that the codebase is maintainable

#### Acceptance Criteria

1. WHEN seeders for employees are present THEN they SHALL be removed or disabled
2. WHEN seeders for departments are present THEN they SHALL be removed or disabled
3. WHEN essential seeders exist THEN they SHALL be preserved for system functionality
4. WHEN database is seeded THEN only necessary authentication data SHALL be created