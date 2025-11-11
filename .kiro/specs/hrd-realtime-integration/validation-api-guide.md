# Validation & API Utilities - Quick Reference Guide

## Validation Utilities (`resources/js/lib/validation.ts`)

### Validate Payroll Employee

```typescript
import { validatePayrollEmployee } from '@/lib/validation';

const employee = {
  id_karyawan: 1,
  nama_lengkap: 'John Doe',
  gaji_pokok: 5000000,
  tunjangan: 1000000,
  potongan: 500000,
  total_gaji: 5500000
};

const result = validatePayrollEmployee(employee);

if (!result.isValid) {
  // Handle validation errors
  result.errors.forEach(error => {
    console.log(`${error.field}: ${error.message}`);
  });
}
```

### Validate Payroll Batch

```typescript
import { validatePayrollBatch } from '@/lib/validation';

const batchData = {
  period: '2024-01',
  period_type: 'bulanan',
  employees: [/* array of employees */]
};

const result = validatePayrollBatch(batchData);

if (!result.isValid) {
  toast({
    title: 'Validasi Gagal',
    description: result.errors.map(e => e.message).join('\n'),
    variant: 'destructive'
  });
}
```

### Validate Approval Notes

```typescript
import { validateApprovalNotes } from '@/lib/validation';

const notes = 'Alasan penolakan...';
const action = 'reject'; // or 'approve'

const result = validateApprovalNotes(notes, action);

if (!result.isValid) {
  // Show error - notes are required for rejection
  alert(result.errors[0].message);
}
```

### Get Field-Specific Error

```typescript
import { getFieldError } from '@/lib/validation';

const result = validatePayrollEmployee(employee);
const gajiPokok Error = getFieldError(result.errors, 'gaji_pokok');

if (gajiPokokError) {
  // Show inline error for gaji_pokok field
  setFieldError('gaji_pokok', gajiPokokError);
}
```

## API Utilities (`resources/js/lib/api.ts`)

### GET Request

```typescript
import { apiGet, getErrorMessage } from '@/lib/api';

try {
  const response = await apiGet('/api/hrd/payroll/employees');
  
  if (response.success && response.data) {
    setEmployees(response.data);
  }
} catch (error) {
  const errorMessage = getErrorMessage(error);
  toast({
    title: 'Error',
    description: errorMessage,
    variant: 'destructive'
  });
}
```

### POST Request

```typescript
import { apiPost, getErrorMessage, formatApiErrors } from '@/lib/api';

try {
  const response = await apiPost('/api/hrd/payroll/submit', {
    period: '2024-01',
    period_type: 'bulanan',
    employees: selectedEmployees
  });
  
  if (response.success) {
    toast({
      title: 'Berhasil',
      description: response.message
    });
  }
} catch (error) {
  const errorMessage = getErrorMessage(error);
  
  // If there are validation errors, format them
  if (error instanceof ApiError && error.errors) {
    const formattedErrors = formatApiErrors(error.errors);
    toast({
      title: 'Validasi Gagal',
      description: formattedErrors,
      variant: 'destructive'
    });
  } else {
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive'
    });
  }
}
```

### Complete Example: Form Submission with Validation

```typescript
import { apiPost, getErrorMessage } from '@/lib/api';
import { validatePayrollBatch } from '@/lib/validation';
import { useToast } from '@/hooks/use-toast';

const handleSubmit = async () => {
  // 1. Client-side validation
  const validation = validatePayrollBatch({
    period: selectedPeriod,
    period_type: periodType,
    employees: selectedEmployees
  });
  
  if (!validation.isValid) {
    toast({
      title: 'Validasi Gagal',
      description: validation.errors.map(e => e.message).join('\n'),
      variant: 'destructive'
    });
    return;
  }
  
  // 2. Submit to API
  setSubmitting(true);
  try {
    const response = await apiPost('/api/hrd/payroll/submit', {
      period: selectedPeriod,
      period_type: periodType,
      employees: selectedEmployees
    });
    
    if (response.success) {
      toast({
        title: 'Berhasil',
        description: 'Batch penggajian berhasil disubmit'
      });
      
      // Refresh data or navigate
      fetchData();
    }
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive'
    });
  } finally {
    setSubmitting(false);
  }
};
```

## Error Handling Best Practices

### 1. Always Validate Before Submitting

```typescript
// ❌ Bad - No validation
const handleSubmit = async () => {
  await apiPost('/api/endpoint', data);
};

// ✅ Good - Validate first
const handleSubmit = async () => {
  const validation = validateData(data);
  if (!validation.isValid) {
    showErrors(validation.errors);
    return;
  }
  await apiPost('/api/endpoint', data);
};
```

### 2. Handle Different Error Types

```typescript
try {
  const response = await apiPost('/api/endpoint', data);
} catch (error) {
  if (error instanceof ApiError) {
    // API error with status code
    if (error.statusCode === 422) {
      // Validation error
      showValidationErrors(error.errors);
    } else if (error.statusCode === 403) {
      // Authorization error
      showAuthError();
    } else {
      // Other API error
      showGenericError(error.message);
    }
  } else {
    // Network or unknown error
    showNetworkError();
  }
}
```

### 3. Provide User-Friendly Messages

```typescript
// ❌ Bad - Technical error message
toast({
  description: 'TypeError: Cannot read property "data" of undefined'
});

// ✅ Good - User-friendly message
toast({
  description: 'Gagal memuat data. Silakan coba lagi.'
});
```

### 4. Log Errors for Debugging

```typescript
try {
  await apiPost('/api/endpoint', data);
} catch (error) {
  // Log for debugging
  console.error('API Error:', error);
  
  // Show user-friendly message
  toast({
    description: getErrorMessage(error),
    variant: 'destructive'
  });
}
```

## Authorization Handling

### Check for 401/403 Errors

```typescript
try {
  const response = await apiPost('/api/hrd/payroll/approve-employee', data);
} catch (error) {
  if (error instanceof ApiError) {
    if (error.statusCode === 401) {
      // User not authenticated - redirect to login
      router.visit('/login');
    } else if (error.statusCode === 403) {
      // User not authorized
      toast({
        title: 'Akses Ditolak',
        description: 'Anda tidak memiliki akses untuk melakukan aksi ini',
        variant: 'destructive'
      });
    }
  }
}
```

## Common Validation Patterns

### Validate Numeric Input

```typescript
import { validateSalaryComponent } from '@/lib/validation';

const handleInputChange = (value: string, field: string) => {
  const validation = validateSalaryComponent(value, field);
  
  if (!validation.isValid) {
    setFieldError(field, validation.errors[0].message);
  } else {
    clearFieldError(field);
    updateValue(field, parseFloat(value));
  }
};
```

### Validate Before Each Step

```typescript
// Step 1: Select employees
const handleNext = () => {
  if (selectedEmployees.length === 0) {
    toast({
      description: 'Pilih minimal satu karyawan',
      variant: 'destructive'
    });
    return;
  }
  setStep(2);
};

// Step 2: Validate data
const handleValidate = async () => {
  const errors = [];
  
  for (const emp of selectedEmployees) {
    const validation = validatePayrollEmployee(emp);
    if (!validation.isValid) {
      errors.push(...validation.errors);
    }
  }
  
  if (errors.length > 0) {
    setValidationErrors(errors);
    return;
  }
  
  setStep(3);
};

// Step 3: Submit
const handleSubmit = async () => {
  try {
    await apiPost('/api/hrd/payroll/submit', data);
    toast({ description: 'Berhasil disubmit' });
  } catch (error) {
    toast({
      description: getErrorMessage(error),
      variant: 'destructive'
    });
  }
};
```

## Testing Validation

### Unit Test Example

```typescript
import { validatePayrollEmployee } from '@/lib/validation';

describe('validatePayrollEmployee', () => {
  it('should fail when gaji_pokok is 0', () => {
    const employee = {
      id_karyawan: 1,
      nama_lengkap: 'Test',
      gaji_pokok: 0,
      tunjangan: 0,
      potongan: 0,
      total_gaji: 0
    };
    
    const result = validatePayrollEmployee(employee);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'gaji_pokok',
      message: 'Gaji pokok harus lebih dari 0'
    });
  });
  
  it('should pass with valid data', () => {
    const employee = {
      id_karyawan: 1,
      nama_lengkap: 'Test',
      gaji_pokok: 5000000,
      tunjangan: 1000000,
      potongan: 500000,
      total_gaji: 5500000
    };
    
    const result = validatePayrollEmployee(employee);
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
```
