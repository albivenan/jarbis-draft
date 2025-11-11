# Design Document - HRD Menu Restructure

## Overview

This design document outlines the technical approach for restructuring the HRD menu sidebar to improve organization and usability. The main goal is to separate concerns by splitting the overloaded "Data Karyawan" accordion into three focused accordions: Data Karyawan, Manajemen Absensi, and Manajemen Penggajian.

**Key Design Principles:**
1. **Separation of Concerns:** Group related features together
2. **Consistency:** Maintain existing UI/UX patterns
3. **Backward Compatibility:** Preserve existing routes where possible
4. **Scalability:** Design for future additions
5. **Accessibility:** Ensure keyboard navigation and screen reader support

---

## Architecture

### High-Level Structure

```
┌─────────────────────────────────────────┐
│         Sidebar Menu Config             │
│      (sidebar-menu.ts)                  │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Data Karyawan (Accordion)         │ │
│  │  - Daftar Karyawan                │ │
│  │  - Analisa Kepegawaian            │ │
│  │  - Kontrak & Status Kerja         │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Manajemen Absensi (Accordion)     │ │
│  │  - Presensi (3 tabs)              │ │
│  │  - Pengajuan Izin & Lembur (2 tabs)│ │
│  │  - Pengaturan Jadwal (2 tabs)     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Manajemen Penggajian (Accordion)  │ │
│  │  - Proses Penggajian              │ │
│  │  - Riwayat Penggajian             │ │
│  │  - Pengaturan Penggajian          │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
           ↓
    ┌──────────────┐
    │  NavMain     │
    │  Component   │
    └──────────────┘
           ↓
    ┌──────────────┐
    │  Collapsible │
    │  Component   │
    └──────────────┘
```

---

## Components and Interfaces

### 1. Sidebar Menu Configuration

**File:** `resources/js/config/sidebar-menu.ts`

**Interface:**
```typescript
export interface NavItem {
  title: string;
  href?: string;
  icon: any;
  children?: NavItem[];
  badge?: string | number;
}
```

**Updated Structure for manajer_hrd:**
```typescript
manajer_hrd: [
  {
    title: 'Dashboard',
    href: '/roles/manajer-hrd',
    icon: LayoutGrid,
  },
  {
    title: 'Data Karyawan',
    icon: Users,
    children: [
      {
        title: 'Daftar Karyawan',
        href: '/roles/manajer-hrd/karyawan/daftar',
        icon: Users,
      },
      {
        title: 'Analisa Kepegawaian',
        href: '/roles/manajer-hrd/karyawan/analisa',
        icon: BarChart2,
      },
      {
        title: 'Kontrak & Status Kerja',
        href: '/roles/manajer-hrd/karyawan/kontrak',
        icon: Briefcase,
      },
    ],
  },
  {
    title: 'Manajemen Absensi',
    icon: Calendar,
    children: [
      {
        title: 'Presensi',
        href: '/roles/manajer-hrd/absensi/presensi',
        icon: Clock,
      },
      {
        title: 'Pengajuan Izin & Lembur',
        href: '/roles/manajer-hrd/absensi/pengajuan',
        icon: FileText,
      },
      {
        title: 'Pengaturan Jadwal',
        href: '/roles/manajer-hrd/absensi/jadwal',
        icon: Calendar,
      },
    ],
  },
  {
    title: 'Manajemen Penggajian',
    icon: DollarSign,
    children: [
      {
        title: 'Proses Penggajian',
        href: '/roles/manajer-hrd/penggajian/proses',
        icon: Settings,
      },
      {
        title: 'Riwayat Penggajian',
        href: '/roles/manajer-hrd/penggajian/riwayat',
        icon: FileText,
      },
      {
        title: 'Pengaturan Penggajian',
        href: '/roles/manajer-hrd/penggajian/pengaturan',
        icon: Settings,
      },
    ],
  },
  // ... other menu items
]
```

---

### 2. Page Components with Tabs

#### 2.1 Presensi Page

**File:** `resources/js/pages/roles/manajer-hrd/absensi/presensi.tsx`

**Structure:**
```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PresensiPage() {
  return (
    <AuthenticatedLayout title="Presensi">
      <Tabs defaultValue="harian">
        <TabsList>
          <TabsTrigger value="harian">Absensi Harian</TabsTrigger>
          <TabsTrigger value="rekap">Rekap Absensi</TabsTrigger>
          <TabsTrigger value="karyawan">Daftar Karyawan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="harian">
          {/* Absensi Harian Component */}
        </TabsContent>
        
        <TabsContent value="rekap">
          {/* Rekap Absensi Component */}
        </TabsContent>
        
        <TabsContent value="karyawan">
          {/* Daftar Karyawan Component */}
        </TabsContent>
      </Tabs>
    </AuthenticatedLayout>
  );
}
```

**Features:**
- **Tab 1: Absensi Harian**
  - Date filter (date picker)
  - Table with columns: Nama, NIK, Jam Masuk, Jam Keluar, Status, Keterangan
  - Export to Excel button
  - Search & filter functionality

- **Tab 2: Rekap Absensi**
  - Period selector (month/year)
  - Summary cards: Total Hadir, Izin, Sakit, Alpa
  - Chart visualization (bar chart per hari)
  - Export to PDF button

- **Tab 3: Daftar Karyawan**
  - List of employees with search
  - Click employee → Navigate to detail page with full attendance history
  - Filter by department/jabatan

#### 2.2 Pengajuan Izin & Lembur Page

**File:** `resources/js/pages/roles/manajer-hrd/absensi/pengajuan.tsx`

**Structure:**
```typescript
export default function PengajuanPage() {
  return (
    <AuthenticatedLayout title="Pengajuan Izin & Lembur">
      <Tabs defaultValue="masuk">
        <TabsList>
          <TabsTrigger value="masuk">
            Pengajuan Masuk
            <Badge>{pendingCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="riwayat">Riwayat</TabsTrigger>
        </TabsList>
        
        <TabsContent value="masuk">
          {/* Pending Requests Component */}
        </TabsContent>
        
        <TabsContent value="riwayat">
          {/* History Component */}
        </TabsContent>
      </Tabs>
    </AuthenticatedLayout>
  );
}
```

**Features:**
- **Tab 1: Pengajuan Masuk**
  - Table of pending requests
  - Columns: Nama, Jenis (Izin/Lembur), Tanggal, Alasan, Aksi
  - Action buttons: Terima, Tolak
  - Modal for approval/rejection with notes
  - Real-time badge count

- **Tab 2: Riwayat**
  - Table of processed requests
  - Filter by status (Diterima/Ditolak), date range, employee
  - Columns: Nama, Jenis, Tanggal, Status, Diproses Oleh, Tanggal Proses
  - View details modal

#### 2.3 Pengaturan Jadwal Page

**File:** `resources/js/pages/roles/manajer-hrd/absensi/jadwal.tsx`

**Structure:**
```typescript
export default function PengaturanJadwalPage() {
  return (
    <AuthenticatedLayout title="Pengaturan Jadwal">
      <Tabs defaultValue="karyawan">
        <TabsList>
          <TabsTrigger value="karyawan">Daftar Karyawan</TabsTrigger>
          <TabsTrigger value="jabatan">Jadwal Per Jabatan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="karyawan">
          {/* Employee List Component */}
        </TabsContent>
        
        <TabsContent value="jabatan">
          {/* Schedule by Role Component */}
        </TabsContent>
      </Tabs>
    </AuthenticatedLayout>
  );
}
```

**Features:**
- **Tab 1: Daftar Karyawan**
  - List of employees
  - Click employee → Open calendar modal
  - Calendar shows current schedule
  - Click date → Edit schedule (shift, jam masuk/keluar)
  - Bulk schedule assignment

- **Tab 2: Jadwal Per Jabatan**
  - List of roles/jabatan
  - Default schedule template per role
  - Edit template: Days of week, shift, hours
  - Apply template to all employees in role

#### 2.4 Proses Penggajian Page

**File:** `resources/js/pages/roles/manajer-hrd/penggajian/proses.tsx`

**Structure:**
```typescript
export default function ProsesPenggajianPage() {
  return (
    <AuthenticatedLayout title="Proses Penggajian">
      <div className="space-y-6">
        {/* Stepper Component */}
        <Stepper currentStep={currentStep}>
          <Step>Pilih Periode</Step>
          <Step>Hitung Gaji</Step>
          <Step>Review & Approve</Step>
          <Step>Generate Slip Gaji</Step>
        </Stepper>
        
        {/* Step Content */}
        {currentStep === 1 && <PeriodSelector />}
        {currentStep === 2 && <SalaryCalculation />}
        {currentStep === 3 && <ReviewApproval />}
        {currentStep === 4 && <SlipGeneration />}
      </div>
    </AuthenticatedLayout>
  );
}
```

**Features:**
- Step-by-step payroll processing workflow
- Period selection (month/year)
- Automatic calculation based on attendance & rules
- Review table with adjustments
- Bulk approval
- Generate PDF slip gaji for all employees

#### 2.5 Riwayat Penggajian Page

**File:** `resources/js/pages/roles/manajer-hrd/penggajian/riwayat.tsx`

**Structure:**
```typescript
export default function RiwayatPenggajianPage() {
  return (
    <AuthenticatedLayout title="Riwayat Penggajian">
      <div className="space-y-6">
        {/* Period Filter */}
        <PeriodFilter />
        
        {/* Employee List */}
        <EmployeeTable 
          onRowClick={(employee) => showSlipGaji(employee)}
        />
        
        {/* Slip Gaji Modal */}
        <SlipGajiModal />
      </div>
    </AuthenticatedLayout>
  );
}
```

**Features:**
- List of employees with search
- Period filter (month/year)
- Click employee → Show slip gaji modal
- Slip gaji shows: Gaji pokok, tunjangan, potongan, total
- Download PDF button
- Email slip gaji button

#### 2.6 Pengaturan Penggajian Page

**File:** `resources/js/pages/roles/manajer-hrd/penggajian/pengaturan.tsx`

**Structure:**
```typescript
export default function PengaturanPenggajianPage() {
  return (
    <AuthenticatedLayout title="Pengaturan Penggajian">
      <div className="space-y-6">
        {/* Salary Components */}
        <Card>
          <CardHeader>
            <CardTitle>Komponen Gaji</CardTitle>
          </CardHeader>
          <CardContent>
            {/* List of salary components */}
            {/* Add/Edit/Delete components */}
          </CardContent>
        </Card>
        
        {/* Calculation Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Aturan Perhitungan</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Overtime rate, deduction rules, etc */}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
```

**Features:**
- Manage salary components (gaji pokok, tunjangan, potongan)
- Set calculation rules (overtime rate, late deduction, etc)
- Configure tax settings
- Set payment schedule

---

## Data Models

### Attendance (Presensi)
```typescript
interface Attendance {
  id: number;
  id_karyawan: number;
  id_jadwal: number;
  tanggal: Date;
  jam_masuk_actual: string;
  jam_keluar_actual: string;
  status_presensi: 'hadir' | 'izin' | 'sakit' | 'alpa';
  keterangan: string;
  created_at: Date;
  updated_at: Date;
}
```

### Permission/Overtime Request
```typescript
interface PermissionRequest {
  id: number;
  id_karyawan: number;
  jenis_izin: 'terlambat' | 'pulang_awal' | 'tidak_masuk';
  tanggal_mulai: Date;
  tanggal_selesai: Date;
  alasan: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by: number;
  tanggal_approval: Date;
  catatan_approval: string;
}

interface OvertimeRequest {
  id: number;
  id_karyawan: number;
  tanggal_lembur: Date;
  jam_mulai: string;
  jam_selesai: string;
  durasi_jam: number;
  alasan: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by: number;
  tanggal_approval: Date;
}
```

### Schedule (Jadwal)
```typescript
interface Schedule {
  id_jadwal: number;
  id_karyawan: number;
  tanggal: Date;
  jam_masuk: string;
  jam_keluar: string;
  shift: 'pagi' | 'siang' | 'malam';
  status_kehadiran: string;
}

interface ScheduleTemplate {
  id: number;
  jabatan: string;
  hari: string; // 'senin', 'selasa', etc
  jam_masuk: string;
  jam_keluar: string;
  shift: string;
}
```

### Payroll
```typescript
interface Payroll {
  id: number;
  id_karyawan: number;
  periode: string; // 'YYYY-MM'
  gaji_pokok: number;
  tunjangan: number;
  potongan: number;
  total_gaji: number;
  status: 'draft' | 'approved' | 'paid';
  created_by: number;
  approved_by: number;
  created_at: Date;
}

interface SalaryComponent {
  id: number;
  nama: string;
  jenis: 'tunjangan' | 'potongan';
  nilai: number;
  is_percentage: boolean;
}
```

---

## Error Handling

### Client-Side
1. **Form Validation:**
   - Required fields validation
   - Date range validation
   - Number format validation
   - Show inline error messages

2. **API Errors:**
   - Display toast notifications for errors
   - Retry mechanism for network failures
   - Graceful degradation for partial failures

3. **State Management:**
   - Handle loading states
   - Handle empty states
   - Handle error states

### Server-Side
1. **Route Protection:**
   - Middleware for authentication
   - Middleware for role-based access
   - Return 403 for unauthorized access

2. **Data Validation:**
   - Validate request data
   - Return 422 for validation errors
   - Clear error messages

3. **Database Errors:**
   - Transaction rollback on failure
   - Log errors for debugging
   - Return 500 for server errors

---

## Testing Strategy

### Unit Tests
1. **Component Tests:**
   - Test tab switching
   - Test form submissions
   - Test data filtering
   - Test modal interactions

2. **Utility Tests:**
   - Test date formatting
   - Test salary calculations
   - Test validation functions

### Integration Tests
1. **Page Tests:**
   - Test full page rendering
   - Test navigation between tabs
   - Test API integration
   - Test state management

2. **Route Tests:**
   - Test all new routes
   - Test redirects
   - Test backward compatibility

### E2E Tests
1. **User Flows:**
   - Test complete attendance workflow
   - Test approval workflow
   - Test payroll processing workflow
   - Test schedule management workflow

2. **Accessibility Tests:**
   - Test keyboard navigation
   - Test screen reader compatibility
   - Test focus management

---

## Performance Considerations

1. **Lazy Loading:**
   - Load tab content only when tab is active
   - Lazy load heavy components (calendar, charts)

2. **Data Pagination:**
   - Paginate large employee lists
   - Implement virtual scrolling for long lists

3. **Caching:**
   - Cache employee data
   - Cache schedule templates
   - Invalidate cache on updates

4. **Optimistic Updates:**
   - Update UI immediately on user action
   - Rollback on server error

---

## Migration Strategy

### Phase 1: Menu Restructure (Week 1)
1. Update sidebar-menu.ts configuration
2. Test menu rendering
3. Ensure existing routes still work

### Phase 2: Manajemen Absensi Pages (Week 2-3)
1. Create Presensi page with tabs
2. Create Pengajuan Izin & Lembur page
3. Create Pengaturan Jadwal page
4. Migrate existing functionality

### Phase 3: Manajemen Penggajian Pages (Week 4-5)
1. Create Proses Penggajian page
2. Create Riwayat Penggajian page
3. Create Pengaturan Penggajian page
4. Implement payroll workflow

### Phase 4: Testing & Refinement (Week 6)
1. Comprehensive testing
2. Bug fixes
3. Performance optimization
4. Documentation

---

## Rollback Plan

If issues arise:
1. **Immediate:** Revert sidebar-menu.ts to previous version
2. **Routes:** Keep old routes active alongside new ones
3. **Data:** No database changes, so no data migration needed
4. **Monitoring:** Monitor error logs and user feedback

---

## Success Metrics

1. **Usability:**
   - Reduced clicks to reach features (target: 30% reduction)
   - Improved task completion time
   - Positive user feedback

2. **Performance:**
   - Page load time < 2 seconds
   - Tab switching < 200ms
   - No UI lag or freezing

3. **Adoption:**
   - 100% of HRD users using new menu within 1 week
   - < 5% support tickets related to navigation
   - No critical bugs in production

---

## Future Enhancements

1. **Advanced Filtering:**
   - Save filter presets
   - Advanced search with multiple criteria

2. **Bulk Operations:**
   - Bulk schedule assignment
   - Bulk approval/rejection

3. **Notifications:**
   - Real-time notifications for new requests
   - Email notifications for approvals

4. **Analytics:**
   - Attendance trends dashboard
   - Payroll analytics
   - Predictive insights

5. **Mobile App:**
   - Mobile-optimized views
   - Native mobile app for attendance

---

## Appendix

### A. Route Mapping

**Old Routes → New Routes:**
```
/roles/manajer-hrd/karyawan/absensi 
  → /roles/manajer-hrd/absensi/presensi (redirect)

/roles/manajer-hrd/karyawan/penggajian 
  → /roles/manajer-hrd/penggajian/riwayat (redirect)
```

**New Routes:**
```
/roles/manajer-hrd/absensi/presensi
/roles/manajer-hrd/absensi/pengajuan
/roles/manajer-hrd/absensi/jadwal
/roles/manajer-hrd/penggajian/proses
/roles/manajer-hrd/penggajian/riwayat
/roles/manajer-hrd/penggajian/pengaturan
```

### B. Icons Used

```typescript
import {
  Users,        // Data Karyawan
  Calendar,     // Manajemen Absensi
  DollarSign,   // Manajemen Penggajian
  Clock,        // Presensi
  FileText,     // Pengajuan
  Settings,     // Pengaturan
  BarChart2,    // Analisa
  Briefcase,    // Kontrak
} from 'lucide-react';
```

### C. Color Scheme

- **Primary:** Blue (#3B82F6) - for active states
- **Success:** Green (#10B981) - for approved items
- **Warning:** Yellow (#F59E0B) - for pending items
- **Danger:** Red (#EF4444) - for rejected items
- **Neutral:** Gray (#6B7280) - for inactive states
