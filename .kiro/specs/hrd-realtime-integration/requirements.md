# Requirements Document - HRD Realtime Data Integration

## Introduction

Spec ini bertujuan untuk mengintegrasikan data realtime dari database ke halaman-halaman HRD yang saat ini menggunakan mock data. Integrasi ini akan menghubungkan frontend React/Inertia dengan backend Laravel yang sudah ada, tanpa merusak struktur yang sudah berjalan.

## Requirements

### Requirement 1: Integrasi Data Pengajuan Izin & Lembur

**User Story:** Sebagai Manajer HRD, saya ingin melihat data pengajuan izin dan lembur yang real dari database, sehingga saya dapat memproses pengajuan karyawan dengan data yang akurat.

#### Acceptance Criteria

1. WHEN halaman Pengajuan Izin & Lembur dibuka THEN sistem SHALL menampilkan data dari tabel `pengajuan_izin` dan `pengajuan_lembur`
2. WHEN Manajer HRD approve/reject pengajuan THEN sistem SHALL update status di database
3. WHEN data berhasil diupdate THEN sistem SHALL menampilkan toast notification
4. IF API endpoint gagal THEN sistem SHALL menampilkan error message yang informatif
5. WHEN filter status diubah THEN sistem SHALL fetch data sesuai filter dari backend

---

### Requirement 2: Integrasi Data Proses Penggajian

**User Story:** Sebagai Manajer HRD, saya ingin data karyawan untuk proses penggajian diambil dari database real, sehingga perhitungan gaji akurat berdasarkan data kehadiran dan komponen gaji yang sebenarnya.

#### Acceptance Criteria

1. WHEN tab Input Data Variabel dibuka THEN sistem SHALL fetch data karyawan dari tabel `identitas_karyawan` dengan relasi ke `presensi`
2. WHEN karyawan dichecklist dan divalidasi THEN sistem SHALL cek anomali berdasarkan data gaji real
3. WHEN data disubmit ke keuangan THEN sistem SHALL simpan ke tabel `payroll_batch` atau tabel baru
4. WHEN tab Persetujuan Keuangan dibuka THEN sistem SHALL menampilkan data dari tabel payroll yang status = submitted
5. IF karyawan di-approve THEN sistem SHALL update status dan pindahkan ke riwayat

---

### Requirement 3: Struktur Database & Migration

**User Story:** Sebagai Developer, saya perlu struktur database yang mendukung fitur penggajian, sehingga data dapat disimpan dan dikelola dengan baik.

#### Acceptance Criteria

1. WHEN migration dijalankan THEN sistem SHALL membuat tabel `payroll_batches` untuk menyimpan batch penggajian
2. WHEN migration dijalankan THEN sistem SHALL membuat tabel `payroll_employees` untuk menyimpan detail gaji per karyawan
3. WHEN migration dijalankan THEN sistem SHALL membuat relasi foreign key yang benar
4. IF tabel sudah ada THEN migration SHALL skip tanpa error
5. WHEN seeder dijalankan THEN sistem SHALL populate data sample untuk testing

---

### Requirement 4: API Routes & Controllers

**User Story:** Sebagai Frontend Developer, saya perlu API endpoints yang konsisten, sehingga saya dapat fetch dan update data dengan mudah.

#### Acceptance Criteria

1. WHEN frontend hit `/api/hrd/payroll/employees` THEN sistem SHALL return list karyawan dengan data gaji
2. WHEN frontend hit `/api/hrd/payroll/validate` THEN sistem SHALL validasi data dan return hasil
3. WHEN frontend hit `/api/hrd/payroll/submit` THEN sistem SHALL simpan batch ke database
4. WHEN frontend hit `/api/hrd/payroll/batches` THEN sistem SHALL return list batch dengan status
5. WHEN frontend hit `/api/hrd/payroll/approve` THEN sistem SHALL update status approval
6. IF request tidak valid THEN sistem SHALL return error 422 dengan detail validasi

---

### Requirement 5: Backward Compatibility

**User Story:** Sebagai System Administrator, saya ingin sistem tetap berjalan normal selama proses integrasi, sehingga tidak ada downtime atau error pada fitur yang sudah ada.

#### Acceptance Criteria

1. WHEN integrasi dilakukan THEN sistem SHALL tidak mengubah file yang sudah berjalan dengan baik
2. WHEN API endpoint baru ditambahkan THEN sistem SHALL tidak conflict dengan route yang ada
3. IF data tidak tersedia THEN sistem SHALL fallback ke empty state yang informatif
4. WHEN error terjadi THEN sistem SHALL log error tanpa crash aplikasi
5. WHEN migration dijalankan THEN sistem SHALL tidak merusak data yang sudah ada

---

### Requirement 6: UI/UX Consistency

**User Story:** Sebagai Manajer HRD, saya ingin tampilan dan flow tetap sama seperti sebelumnya, sehingga saya tidak perlu belajar ulang cara menggunakan sistem.

#### Acceptance Criteria

1. WHEN data real ditampilkan THEN UI SHALL tetap sama dengan mock data
2. WHEN loading data THEN sistem SHALL menampilkan loading state
3. WHEN data kosong THEN sistem SHALL menampilkan empty state yang informatif
4. IF error terjadi THEN sistem SHALL menampilkan error state dengan action retry
5. WHEN action berhasil THEN sistem SHALL menampilkan toast notification

---

### Requirement 7: Data Validation & Security

**User Story:** Sebagai Security Officer, saya ingin data yang diinput tervalidasi dengan baik, sehingga tidak ada data invalid atau berbahaya masuk ke database.

#### Acceptance Criteria

1. WHEN data disubmit THEN sistem SHALL validasi semua field required
2. WHEN gaji diinput THEN sistem SHALL validasi nilai tidak boleh negatif
3. WHEN user akses endpoint THEN sistem SHALL cek authentication dan authorization
4. IF user tidak punya akses THEN sistem SHALL return error 403
5. WHEN data disimpan THEN sistem SHALL sanitize input untuk prevent SQL injection

---

### Requirement 8: Performance & Optimization

**User Story:** Sebagai End User, saya ingin sistem responsif dan cepat, sehingga saya tidak perlu menunggu lama saat mengakses data.

#### Acceptance Criteria

1. WHEN fetch data karyawan THEN sistem SHALL load dalam < 2 detik
2. WHEN submit batch THEN sistem SHALL process dalam < 3 detik
3. WHEN query database THEN sistem SHALL use eager loading untuk relasi
4. IF data banyak THEN sistem SHALL implement pagination
5. WHEN data di-cache THEN sistem SHALL invalidate cache saat ada update
