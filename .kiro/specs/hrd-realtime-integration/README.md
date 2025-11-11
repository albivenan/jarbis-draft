# HRD Realtime Data Integration Spec

## 📋 Overview

Spec ini bertujuan untuk mengintegrasikan data realtime dari database ke halaman-halaman HRD yang saat ini menggunakan mock data. Integrasi ini akan menghubungkan frontend React/Inertia dengan backend Laravel yang sudah ada, tanpa merusak struktur yang sudah berjalan.

## 🎯 Goals

1. **Mengganti mock data dengan data real** dari database
2. **Menambahkan tabel baru** untuk fitur penggajian
3. **Membuat API endpoints** yang konsisten dan aman
4. **Mempertahankan UI/UX** yang sudah ada
5. **Backward compatibility** - tidak merusak fitur yang sudah berjalan

## 📁 Struktur Spec

```
.kiro/specs/hrd-realtime-integration/
├── README.md           # Dokumen ini
├── requirements.md     # Requirements lengkap dengan EARS format
├── design.md          # Design teknis dan architecture
└── tasks.md           # Implementation plan dengan checklist
```

## 🔍 Analisis Struktur Yang Ada

### ✅ Yang Sudah Berjalan Dengan Baik

1. **Sistem Presensi**
   - Controller: `PresensiController`, `AbsensiController`
   - Models: `Presensi`, `JadwalKerja`
   - Routes: Sudah ada di `routes/web.php`
   - Frontend: Halaman presensi sudah berfungsi

2. **Pengajuan Izin & Lembur**
   - Controller: `RequestController`
   - Models: `PermissionRequest`, `OvertimeRequest`
   - API Endpoints: `/api/hrd/permission-requests`, `/api/hrd/overtime-requests`
   - Frontend: Halaman pengajuan sudah ada (dengan mock data)

3. **Struktur Menu HRD**
   - Routes sudah terorganisir dengan baik
   - Middleware authentication dan authorization sudah ada
   - Breadcrumbs sudah konsisten

### ⚠️ Yang Perlu Diintegrasikan

1. **Halaman Pengajuan Izin & Lembur**
   - File: `resources/js/pages/roles/manajer-hrd/absensi/pengajuan.tsx`
   - Status: Menggunakan mock data
   - Action: Ganti dengan API call ke endpoint yang sudah ada

2. **Halaman Proses Penggajian**
   - File: `resources/js/pages/roles/manajer-hrd/penggajian/proses.tsx`
   - Status: Menggunakan mock data
   - Action: Perlu tabel baru + API endpoints + integrasi frontend

3. **Halaman Pengaturan Penggajian**
   - File: `resources/js/pages/roles/manajer-hrd/penggajian/pengaturan.tsx`
   - Status: Hanya UI, belum ada backend
   - Action: Perlu API untuk save/load settings

## 🗄️ Database Schema

### Tabel Yang Sudah Ada

- `identitas_karyawan` - Data karyawan
- `presensi` - Data kehadiran
- `jadwal_kerja` - Jadwal kerja karyawan
- `pengajuan_izin` - Pengajuan izin (via PermissionRequest model)
- `pengajuan_lembur` - Pengajuan lembur (via OvertimeRequest model)

### Tabel Baru Yang Akan Dibuat

- `payroll_batches` - Batch penggajian
- `payroll_employees` - Detail gaji per karyawan dalam batch
- `payroll_settings` (optional) - Pengaturan penggajian

## 🔌 API Endpoints

### Yang Sudah Ada ✅

```
GET  /api/hrd/permission-requests    # Get permission requests
GET  /api/hrd/overtime-requests      # Get overtime requests
POST /api/hrd/approve-permission     # Approve/reject permission
POST /api/hrd/approve-overtime       # Approve/reject overtime
```

### Yang Akan Ditambahkan 🆕

```
GET  /api/hrd/payroll/employees      # Get employees for payroll
POST /api/hrd/payroll/validate       # Validate payroll data
POST /api/hrd/payroll/submit         # Submit batch to finance
GET  /api/hrd/payroll/batches        # Get payroll batches
POST /api/hrd/payroll/approve-employee  # Approve/reject employee
GET  /api/hrd/payroll/settings       # Get payroll settings
POST /api/hrd/payroll/settings       # Save payroll settings
```

## 🎨 UI/UX Considerations

### Prinsip Integrasi

1. **No Breaking Changes** - UI tetap sama seperti sebelumnya
2. **Progressive Enhancement** - Tambahkan loading states
3. **Error Handling** - Tampilkan error yang user-friendly
4. **Empty States** - Tampilkan pesan informatif saat data kosong
5. **Toast Notifications** - Feedback untuk setiap action

### States Yang Perlu Ditangani

- **Loading State** - Saat fetch data
- **Empty State** - Saat tidak ada data
- **Error State** - Saat terjadi error
- **Success State** - Saat action berhasil

## 🔒 Security & Validation

### Backend Validation

- Validate all input data
- Check user authentication
- Check user authorization (role & permissions)
- Sanitize input to prevent SQL injection
- Use database transactions for data integrity

### Frontend Validation

- Validate before API call
- Show inline validation errors
- Prevent invalid submissions
- Sanitize user input

## 📊 Performance Optimization

1. **Eager Loading** - Load relasi dengan `with()`
2. **Pagination** - Untuk list data yang banyak
3. **Caching** - Cache data yang jarang berubah
4. **Indexing** - Add index pada kolom yang sering di-query
5. **Query Optimization** - Limit kolom yang diambil dengan `select()`

## 🧪 Testing Strategy

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

## 📝 Implementation Steps

1. **Phase 1: Database Setup**
   - Create migrations
   - Create models
   - Run seeders

2. **Phase 2: Backend API**
   - Create PayrollController
   - Add API routes
   - Test endpoints

3. **Phase 3: Frontend Integration**
   - Update Pengajuan page
   - Update Proses Penggajian page
   - Update Pengaturan page

4. **Phase 4: Testing & Verification**
   - Test all endpoints
   - Test frontend integration
   - Test complete workflow

5. **Phase 5: Documentation & Cleanup**
   - Update API documentation
   - Remove mock data
   - Add code comments

## 🚀 Getting Started

1. Read `requirements.md` untuk memahami requirements lengkap
2. Read `design.md` untuk memahami design teknis
3. Follow `tasks.md` untuk implementasi step-by-step

## 📞 Support

Jika ada pertanyaan atau butuh klarifikasi, silakan tanyakan sebelum mulai implementasi.

## ✅ Success Criteria

Integrasi dianggap berhasil jika:

1. ✅ Semua halaman HRD menggunakan data real dari database
2. ✅ Tidak ada mock data yang tersisa
3. ✅ Semua API endpoints berfungsi dengan baik
4. ✅ UI/UX tetap sama seperti sebelumnya
5. ✅ Tidak ada breaking changes pada fitur yang sudah ada
6. ✅ Error handling berfungsi dengan baik
7. ✅ Performance tetap optimal
8. ✅ Security validation berfungsi dengan baik
