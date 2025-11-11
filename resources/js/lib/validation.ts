/**
 * Validation utilities for HRD forms
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validate payroll employee data
 */
export function validatePayrollEmployee(employee: {
  id_karyawan?: number;
  nama_lengkap?: string;
  gaji_pokok?: number;
  tunjangan?: number;
  potongan?: number;
  total_gaji?: number;
}): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate id_karyawan
  if (!employee.id_karyawan) {
    errors.push({
      field: 'id_karyawan',
      message: 'ID karyawan harus diisi'
    });
  }

  // Validate nama_lengkap
  if (!employee.nama_lengkap || employee.nama_lengkap.trim() === '') {
    errors.push({
      field: 'nama_lengkap',
      message: 'Nama karyawan harus diisi'
    });
  }

  // Validate gaji_pokok
  if (employee.gaji_pokok === undefined || employee.gaji_pokok === null) {
    errors.push({
      field: 'gaji_pokok',
      message: 'Gaji pokok harus diisi'
    });
  } else if (employee.gaji_pokok < 0) {
    errors.push({
      field: 'gaji_pokok',
      message: 'Gaji pokok tidak boleh negatif'
    });
  } else if (employee.gaji_pokok === 0) {
    errors.push({
      field: 'gaji_pokok',
      message: 'Gaji pokok harus lebih dari 0'
    });
  }

  // Validate tunjangan
  if (employee.tunjangan !== undefined && employee.tunjangan < 0) {
    errors.push({
      field: 'tunjangan',
      message: 'Tunjangan tidak boleh negatif'
    });
  }

  // Validate potongan
  if (employee.potongan !== undefined && employee.potongan < 0) {
    errors.push({
      field: 'potongan',
      message: 'Potongan tidak boleh negatif'
    });
  }

  // Validate total_gaji
  if (employee.total_gaji === undefined || employee.total_gaji === null) {
    errors.push({
      field: 'total_gaji',
      message: 'Total gaji harus diisi'
    });
  } else if (employee.total_gaji <= 0) {
    errors.push({
      field: 'total_gaji',
      message: 'Total gaji harus lebih dari 0'
    });
  }

  // Validate calculation
  if (
    employee.gaji_pokok !== undefined &&
    employee.tunjangan !== undefined &&
    employee.potongan !== undefined &&
    employee.total_gaji !== undefined
  ) {
    const calculatedTotal = employee.gaji_pokok + employee.tunjangan - employee.potongan;
    if (Math.abs(calculatedTotal - employee.total_gaji) > 0.01) {
      errors.push({
        field: 'total_gaji',
        message: 'Total gaji tidak sesuai dengan perhitungan (Gaji Pokok + Tunjangan - Potongan)'
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate payroll batch submission
 */
export function validatePayrollBatch(data: {
  period?: string;
  period_type?: string;
  employees?: any[];
}): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate period
  if (!data.period || data.period.trim() === '') {
    errors.push({
      field: 'period',
      message: 'Periode harus diisi'
    });
  }

  // Validate period_type
  if (!data.period_type) {
    errors.push({
      field: 'period_type',
      message: 'Tipe periode harus dipilih'
    });
  } else if (!['mingguan', 'bulanan'].includes(data.period_type)) {
    errors.push({
      field: 'period_type',
      message: 'Tipe periode tidak valid'
    });
  }

  // Validate employees
  if (!data.employees || data.employees.length === 0) {
    errors.push({
      field: 'employees',
      message: 'Minimal satu karyawan harus dipilih'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate salary component input
 */
export function validateSalaryComponent(value: number | string, fieldName: string): ValidationResult {
  const errors: ValidationError[] = [];
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    errors.push({
      field: fieldName,
      message: `${fieldName} harus berupa angka`
    });
  } else if (numValue < 0) {
    errors.push({
      field: fieldName,
      message: `${fieldName} tidak boleh negatif`
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate approval notes
 */
export function validateApprovalNotes(notes: string, action: 'approve' | 'reject'): ValidationResult {
  const errors: ValidationError[] = [];

  // Notes are required for rejection
  if (action === 'reject' && (!notes || notes.trim() === '')) {
    errors.push({
      field: 'notes',
      message: 'Catatan penolakan harus diisi'
    });
  }

  // Check max length
  if (notes && notes.length > 500) {
    errors.push({
      field: 'notes',
      message: 'Catatan maksimal 500 karakter'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  return errors.map(err => err.message).join('\n');
}

/**
 * Get error message for a specific field
 */
export function getFieldError(errors: ValidationError[], fieldName: string): string | undefined {
  const error = errors.find(err => err.field === fieldName);
  return error?.message;
}
