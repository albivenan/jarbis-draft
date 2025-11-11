# Design Document - HRD Realtime Data Integration

## Overview

Dokumen ini menjelaskan desain teknis untuk mengintegrasikan data realtime dari database ke halaman-halaman HRD. Integrasi ini akan menggantikan mock data dengan data real dari tabel yang sudah ada, serta menambahkan tabel baru untuk fitur penggajian.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React/Inertia)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Pengajuan   │  │    Proses    │  │  Pengaturan  │      │
│  │ Izin/Lembur  │  │  Penggajian  │  │  Penggajian  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          │ API Calls        │ API Calls        │ API Calls
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼──────────────┐
│                    Backend (Laravel)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Request    │  │   Payroll    │  │   Settings   │      │
│  │  Controller  │  │  Controller  │  │  Controller  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│  ┌──────▼──────────────────▼──────────────────▼───────┐    │
│  │              Models & Eloquent ORM                   │    │
│  └──────┬───────────────────────────────────────────────┘    │
└─────────┼──────────────────────────────────────────────────┘
          │
┌─────────▼──────────────────────────────────────────────────┐
│                      Database (MySQL)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ pengajuan_   │  │ payroll_     │  │ identitas_   │     │
│  │ izin/lembur  │  │ batches      │  │ karyawan     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Database Schema

#### Tabel Baru: `payroll_batches`

```sql
CREATE TABLE payroll_batches (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    batch_code VARCHAR(50) UNIQUE NOT NULL,
    period VARCHAR(50) NOT NULL,
    period_type ENUM('mingguan', 'bulanan') NOT NULL,
    total_employees INT NOT NULL DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    status ENUM('draft', 'submitted', 'approved', 'rejected', 'paid') NOT NULL DEFAULT 'draft',
    submitted_at TIMESTAMP NULL,
    submitted_by BIGINT UNSIGNED NULL,
    approved_at TIMESTAMP NULL,
    approved_by BIGINT UNSIGNED NULL,
    rejection_reason TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (submitted_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);
```

#### Tabel Baru: `payroll_employees`

```sql
CREATE TABLE payroll_employees (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    batch_id BIGINT UNSIGNED NOT NULL,
    id_karyawan BIGINT UNSIGNED NOT NULL,
    gaji_pokok DECIMAL(15,2) NOT NULL DEFAULT 0,
    tunjangan DECIMAL(15,2) NOT NULL DEFAULT 0,
    potongan DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_gaji DECIMAL(15,2) NOT NULL DEFAULT 0,
    status ENUM('draft', 'submitted', 'approved', 'rejected') NOT NULL DEFAULT 'draft',
    attendance_summary JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES payroll_batches(id) ON DELETE CASCADE,
    FOREIGN KEY (id_karyawan) REFERENCES identitas_karyawan(id_karyawan) ON DELETE CASCADE
);
```

### 2. Models

#### PayrollBatch Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayrollBatch extends Model
{
    protected $fillable = [
        'batch_code',
        'period',
        'period_type',
        'total_employees',
        'total_amount',
        'status',
        'submitted_at',
        'submitted_by',
        'approved_at',
        'approved_by',
        'rejection_reason'
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'approved_at' => 'datetime',
        'total_amount' => 'decimal:2'
    ];

    public function employees()
    {
        return $this->hasMany(PayrollEmployee::class, 'batch_id');
    }

    public function submitter()
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
```

#### PayrollEmployee Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayrollEmployee extends Model
{
    protected $fillable = [
        'batch_id',
        'id_karyawan',
        'gaji_pokok',
        'tunjangan',
        'potongan',
        'total_gaji',
        'status',
        'attendance_summary'
    ];

    protected $casts = [
        'gaji_pokok' => 'decimal:2',
        'tunjangan' => 'decimal:2',
        'potongan' => 'decimal:2',
        'total_gaji' => 'decimal:2',
        'attendance_summary' => 'array'
    ];

    public function batch()
    {
        return $this->belongsTo(PayrollBatch::class, 'batch_id');
    }

    public function karyawan()
    {
        return $this->belongsTo(IdentitasKaryawan::class, 'id_karyawan');
    }
}
```

### 3. Controllers

#### PayrollController

```php
<?php

namespace App\Http\Controllers;

use App\Models\PayrollBatch;
use App\Models\PayrollEmployee;
use App\Models\IdentitasKaryawan;
use App\Models\Presensi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PayrollController extends Controller
{
    // Get employees for payroll processing
    public function getEmployees(Request $request)
    {
        $status = $request->get('status', 'draft');
        
        $employees = IdentitasKaryawan::with([
            'rincianPekerjaan.departemen',
            'rincianPekerjaan.jabatan',
            'presensi' => function($query) {
                $query->whereMonth('tanggal', Carbon::now()->month)
                      ->whereYear('tanggal', Carbon::now()->year);
            }
        ])->get();

        return response()->json([
            'success' => true,
            'data' => $employees
        ]);
    }

    // Validate payroll data
    public function validate(Request $request)
    {
        $employeeIds = $request->get('employee_ids', []);
        $errors = [];

        foreach ($employeeIds as $id) {
            $employee = PayrollEmployee::find($id);
            if ($employee->gaji_pokok <= 0) {
                $errors[] = "Employee {$employee->karyawan->nama_lengkap}: Gaji pokok tidak boleh 0";
            }
            if ($employee->total_gaji <= 0) {
                $errors[] = "Employee {$employee->karyawan->nama_lengkap}: Total gaji tidak boleh 0";
            }
        }

        return response()->json([
            'success' => count($errors) === 0,
            'errors' => $errors
        ]);
    }

    // Submit batch to finance
    public function submitBatch(Request $request)
    {
        DB::beginTransaction();
        try {
            $batch = PayrollBatch::create([
                'batch_code' => 'BATCH-' . date('Y-m-d-His'),
                'period' => $request->period,
                'period_type' => $request->period_type,
                'total_employees' => count($request->employee_ids),
                'total_amount' => $request->total_amount,
                'status' => 'submitted',
                'submitted_at' => now(),
                'submitted_by' => Auth::id()
            ]);

            foreach ($request->employees as $emp) {
                PayrollEmployee::create([
                    'batch_id' => $batch->id,
                    'id_karyawan' => $emp['id_karyawan'],
                    'gaji_pokok' => $emp['gaji_pokok'],
                    'tunjangan' => $emp['tunjangan'],
                    'potongan' => $emp['potongan'],
                    'total_gaji' => $emp['total_gaji'],
                    'status' => 'submitted',
                    'attendance_summary' => $emp['attendance']
                ]);
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Batch berhasil disubmit'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Get batches
    public function getBatches(Request $request)
    {
        $status = $request->get('status', 'all');
        
        $query = PayrollBatch::with(['employees.karyawan', 'submitter', 'approver']);
        
        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $batches = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $batches
        ]);
    }

    // Approve/reject employee
    public function approveEmployee(Request $request)
    {
        $employee = PayrollEmployee::findOrFail($request->id);
        $employee->update([
            'status' => $request->action === 'approve' ? 'approved' : 'rejected'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status berhasil diupdate'
        ]);
    }
}
```

### 4. API Routes

```php
// routes/api.php

Route::prefix('hrd')->middleware(['auth', 'role:manajer_hrd'])->group(function () {
    // Payroll routes
    Route::prefix('payroll')->group(function () {
        Route::get('employees', [PayrollController::class, 'getEmployees']);
        Route::post('validate', [PayrollController::class, 'validate']);
        Route::post('submit', [PayrollController::class, 'submitBatch']);
        Route::get('batches', [PayrollController::class, 'getBatches']);
        Route::post('approve-employee', [PayrollController::class, 'approveEmployee']);
    });

    // Request routes (already exist, just document)
    Route::get('permission-requests', [RequestController::class, 'getPermissionRequests']);
    Route::get('overtime-requests', [RequestController::class, 'getOvertimeRequests']);
    Route::post('approve-permission', [AbsensiController::class, 'approvePermission']);
    Route::post('approve-overtime', [AbsensiController::class, 'approveOvertime']);
});
```

### 5. Frontend Integration

#### Update Pengajuan Page

```typescript
// Replace mock data fetch with real API
const fetchPendingRequests = async () => {
  setLoading(true);
  try {
    const [permResponse, overtimeResponse] = await Promise.all([
      fetch('/api/hrd/permission-requests?status=pending'),
      fetch('/api/hrd/overtime-requests?status=pending')
    ]);
    
    const permData = await permResponse.json();
    const overtimeData = await overtimeResponse.json();
    
    if (permData.success) {
      setPermissionRequests(permData.data);
    }
    if (overtimeData.success) {
      setOvertimeRequests(overtimeData.data);
    }
  } catch (error) {
    console.error('Error fetching requests:', error);
    toast({
      title: 'Error',
      description: 'Gagal memuat data pengajuan',
      variant: 'destructive',
    });
  } finally {
    setLoading(false);
  }
};
```

#### Update Proses Penggajian Page

```typescript
// Fetch employees from API
const fetchEmployees = async () => {
  try {
    const response = await fetch('/api/hrd/payroll/employees?status=draft');
    const data = await response.json();
    
    if (data.success) {
      setEmployees(data.data.map(emp => ({
        id: emp.id_karyawan,
        nik: emp.nik_perusahaan,
        name: emp.nama_lengkap,
        department: emp.rincian_pekerjaan?.departemen?.nama_departemen,
        position: emp.rincian_pekerjaan?.jabatan?.nama_jabatan,
        gajiPokok: emp.gaji_pokok || 0,
        tunjangan: emp.tunjangan || 0,
        potongan: emp.potongan || 0,
        totalGaji: emp.total_gaji || 0,
        status: 'draft',
        attendance: calculateAttendance(emp.presensi)
      })));
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Gagal memuat data karyawan',
      variant: 'destructive',
    });
  }
};
```

## Data Models

### Employee Payroll Data Structure

```typescript
interface Employee {
  id: string;
  nik: string;
  name: string;
  department: string;
  position: string;
  gajiPokok: number;
  tunjangan: number;
  potongan: number;
  totalGaji: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  attendance: {
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
    terlambat: number;
    lembur: number;
  };
}
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": ["Error detail"]
  }
}
```

### Frontend Error Handling

```typescript
try {
  const response = await fetch('/api/hrd/payroll/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message);
  }
  
  toast({ title: 'Success', description: result.message });
} catch (error) {
  toast({
    title: 'Error',
    description: error.message || 'Terjadi kesalahan',
    variant: 'destructive'
  });
}
```

## Testing Strategy

### Unit Tests
- Test model relationships
- Test validation logic
- Test calculation methods

### Integration Tests
- Test API endpoints
- Test database transactions
- Test error handling

### E2E Tests
- Test complete payroll flow
- Test approval workflow
- Test data consistency

## Performance Considerations

1. **Eager Loading**: Use `with()` untuk load relasi
2. **Pagination**: Implement pagination untuk list besar
3. **Caching**: Cache data yang jarang berubah
4. **Indexing**: Add index pada kolom yang sering di-query
5. **Query Optimization**: Use `select()` untuk limit kolom yang diambil
