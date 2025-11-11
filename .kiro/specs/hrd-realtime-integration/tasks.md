# Implementation Plan - HRD Realtime Data Integration

- [x] 1. Setup Database Structure






  - [x] 1.1 Create migration for `payroll_batches` table

    - Add all required columns with proper types
    - Add foreign keys and indexes
    - _Requirements: 3.1, 3.2, 3.3_
  

  - [x] 1.2 Create migration for `payroll_employees` table

    - Add all required columns with proper types
    - Add foreign keys to payroll_batches and identitas_karyawan
    - Add JSON column for attendance_summary
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 1.3 Create seeder for sample payroll data


    - Generate sample batches
    - Generate sample employee payroll records
    - _Requirements: 3.5_

- [x] 2. Create Models





  - [x] 2.1 Create PayrollBatch model


    - Define fillable fields
    - Define casts for dates and decimals
    - Define relationships (employees, submitter, approver)
    - _Requirements: 3.1, 3.2_
  
  - [x] 2.2 Create PayrollEmployee model


    - Define fillable fields
    - Define casts for decimals and JSON
    - Define relationships (batch, karyawan)
    - _Requirements: 3.1, 3.2_


- [x] 3. Create PayrollController




  - [x] 3.1 Implement getEmployees method


    - Fetch employees with eager loading
    - Include attendance data for current month
    - Calculate attendance summary
    - Return formatted JSON response
    - _Requirements: 4.1, 8.3_
  
  - [x] 3.2 Implement validate method


    - Check gaji_pokok > 0
    - Check total_gaji > 0
    - Return validation errors if any
    - _Requirements: 4.2, 7.2_
  

  - [x] 3.3 Implement submitBatch method

    - Create payroll batch record
    - Create payroll employee records
    - Use database transaction
    - Handle errors properly
    - _Requirements: 4.3, 7.1_
  
  - [x] 3.4 Implement getBatches method


    - Fetch batches with filters
    - Include related data (employees, submitter, approver)
    - Return console and noti response
    - _Requirements: 4.4, 8.3_
  
  - [x] 3.5 Implement approveEmployee method


    - Update employee status
    - Validate authorization
    - Return success response
    - _Requirements: 4.5, 7.3_

- [x] 4. Add API Routes





  - [x] 4.1 Add payroll routes to routes/api.php (dont use this, use web.php instead)


    - Add authentication middleware
    - Add role authorization middleware
    - Group routes under /api/hrd/payroll prefix
    - _Requirements: 4.1-4.6, 7.3, 7.4_

- [x] 5. Update Pengajuan Izin & Lembur Page





  - [x] 5.1 Replace mock data with API calls


    - Update fetchPendingRequests to use real API
    - Update fetchHistory to use real API
    - Handle loading states
    - Handle error states
    - _Requirements: 1.1, 1.5, 6.2, 6.4_
  
  - [x] 5.2 Update approval functions

    - Call real API for approve/reject
    - Update local state after success
    - Show toast notifications
    - Handle errors properly
    - _Requirements: 1.2, 1.3, 1.4, 6.3_

- [x] 6. Update Proses Penggajian Page





  - [x] 6.1 Implement fetchEmployees function


    - Call /api/hrd/payroll/employees
    - Transform data to match interface
    - Calculate attendance summary
    - Handle loading and error states
    - _Requirements: 2.1, 6.2, 6.4, 8.1_
  
  - [x] 6.2 Update handleValidate function


    - Call /api/hrd/payroll/validate
    - Display validation errors
    - Enable submit button if valid
    - _Requirements: 2.2, 6.3, 7.2_
  
  - [x] 6.3 Update handleSubmitToFinance function


    - Call /api/hrd/payroll/submit
    - Send selected employees data
    - Handle success response
    - Switch to approval tab
    - _Requirements: 2.3, 6.3, 8.2_
  
  - [x] 6.4 Implement fetchSubmittedEmployees function


    - Call /api/hrd/payroll/batches?status=submitted
    - Display in approval tab
    - Handle empty state
    - _Requirements: 2.4, 6.2, 6.3_
  
  - [x] 6.5 Update handleApproveEmployee function


    - Call /api/hrd/payroll/approve-employee
    - Update local state
    - Move to history if all approved
    - _Requirements: 2.5, 6.3_

- [x] 7. Add Error Handling & Validation





  - [x] 7.1 Add try-catch blocks to all API calls


    - Catch network errors
    - Catch validation errors
    - Display user-friendly messages
    - _Requirements: 1.4, 5.4, 7.1_
  
  - [x] 7.2 Add input validation on frontend


    - Validate before API call
    - Show inline validation errors
    - Prevent invalid submissions
    - _Requirements: 7.1, 7.2_
  
  - [x] 7.3 Add authorization checks in controller


    - Check user role
    - Check user permissions
    - Return 403 if unauthorized
    - _Requirements: 7.3, 7.4_

- [x] 8. Add Loading & Empty States





  - [x] 8.1 Add loading spinners


    - Show during data fetch
    - Show during form submission
    - Disable actions while loading
    - _Requirements: 6.2, 8.1_
  

  - [x] 8.2 Add empty state components

    - Show when no data available
    - Provide helpful messages
    - Add action buttons if applicable
    - _Requirements: 5.3, 6.3_

- [x] 9. Testing & Verification






  - [ ] 9.1 Test database migrations


    - Run migrations on fresh database
    - Verify table structure
    - Test rollback
    - _Requirements: 3.1-3.4_
  
  - [ ] 9.2 Test API endpoints
    - Test with Postman/Insomnia
    - Verify response format
    - Test error scenarios
    - _Requirements: 4.1-4.6_
  
  - [ ] 9.3 Test frontend integration
    - Test data loading
    - Test form submissions
    - Test error handling
    - Test UI states
    - _Requirements: 1.1-1.5, 2.1-2.5, 6.1-6.5_
  
  - [ ] 9.4 Test complete workflow
    - Test end-to-end payroll process
    - Test approval workflow
    - Verify data consistency
    - _Requirements: 5.1-5.5, 8.1-8.5_

- [ ] 10. Documentation & Cleanup
  - [ ] 10.1 Update API documentation
    - Document all endpoints
    - Add request/response examples
    - Document error codes
    - _Requirements: 4.1-4.6_
  
  - [ ] 10.2 Remove mock data comments
    - Clean up commented code
    - Remove unused mock data
    - Update code comments
    - _Requirements: 5.1, 5.2_
  
  - [ ] 10.3 Add inline code documentation
    - Add PHPDoc comments
    - Add TypeScript comments
    - Document complex logic
    - _Requirements: 5.1-5.5_
