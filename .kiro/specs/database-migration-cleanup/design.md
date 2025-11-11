# Design Document

## Overview

This design outlines the restructuring of the Laravel application to remove local data tables (employees, departments) while maintaining authentication functionality through a minimal users table. The system will rely entirely on external API endpoints for employee and department data while preserving session management capabilities.

## Architecture

### Database Layer Changes
- **Remove/Empty Tables**: employees, departments tables will be emptied or removed
- **Preserve Tables**: users (modified), password_resets, sessions, and other Laravel system tables
- **Modified Users Table**: Simplified to store only authentication data with reference to external employee ID

### Data Access Pattern
- **External API Integration**: All employee and department data fetched from external endpoints
- **Local Authentication**: User authentication managed locally for session handling
- **Hybrid Approach**: Authentication local, business data external

## Components and Interfaces

### 1. Migration Modifications

**Files to Modify:**
- `database/migrations/*_create_employees_table.php` - Empty or remove
- `database/migrations/*_create_departments_table.php` - Empty or remove  
- `database/migrations/*_create_users_table.php` - Simplify for authentication only

**New Users Table Structure:**
```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('employee_id')->unique(); // Reference to external employee
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->string('role')->nullable(); // Cache role from external data
    $table->rememberToken();
    $table->timestamps();
});
```

### 2. Model Restructuring

**User Model (app/Models/User.php):**
- Maintain authentication functionality
- Add relationship to external employee data
- Cache role information locally

**Employee Model (app/Models/Employee.php):**
- Convert to API-based model
- Remove database relationships
- Implement external data fetching methods

**Department Model (app/Models/Department.php):**
- Convert to API-based model  
- Remove database relationships
- Implement external data fetching methods

### 3. Service Layer Implementation

**External Data Service (app/Services/ExternalDataService.php):**
```php
class ExternalDataService
{
    public function getEmployee($id)
    public function getAllEmployees()
    public function getDepartment($id)
    public function getAllDepartments()
    public function authenticateEmployee($email, $password)
}
```

### 4. Authentication Flow

**Login Process:**
1. Validate credentials against external API
2. Create/update local user record with employee_id reference
3. Establish Laravel session
4. Cache role information locally

**Session Management:**
1. Use Laravel's built-in session system
2. Reference external employee data when needed
3. Maintain authentication state locally

## Data Models

### Local User Model
```php
class User extends Authenticatable
{
    protected $fillable = [
        'employee_id', 'email', 'password', 'role'
    ];
    
    public function getEmployeeData()
    {
        return app(ExternalDataService::class)->getEmployee($this->employee_id);
    }
}
```

### External Employee Model
```php
class Employee
{
    // No database table - pure API model
    public static function find($id)
    public static function all()
    public static function where($field, $value)
    // Methods fetch from external API
}
```

## Error Handling

### API Unavailability
- Implement retry mechanisms for external API calls
- Cache critical data locally when possible
- Graceful degradation when external service is down
- Error logging for debugging

### Authentication Failures
- Handle external authentication service failures
- Maintain local session even if external API is temporarily unavailable
- Clear error messages for users

### Data Consistency
- Handle cases where external employee data changes
- Update local user records when external data is modified
- Validate external data before processing

## Testing Strategy

### Unit Tests
- Test external API service methods
- Test model data fetching from external sources
- Test authentication flow with external validation
- Test error handling scenarios

### Integration Tests
- Test complete login flow with external API
- Test data retrieval from external sources
- Test session management functionality
- Test graceful degradation scenarios

### Migration Tests
- Verify migration cleanup doesn't break existing functionality
- Test that essential tables remain functional
- Validate authentication still works after migration changes

## Implementation Considerations

### Performance
- Implement caching for frequently accessed external data
- Minimize API calls through intelligent data fetching
- Consider background sync for critical data

### Security
- Secure API communication with external service
- Validate all external data before processing
- Maintain secure authentication practices

### Backward Compatibility
- Ensure existing role system continues to work
- Preserve current dashboard functionality
- Maintain attendance calendar integration

### Deployment
- Plan migration rollback strategy
- Test thoroughly in staging environment
- Monitor external API dependencies