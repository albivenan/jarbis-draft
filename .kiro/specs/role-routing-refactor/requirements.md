# Requirements Document

## Introduction

Refactoring sistem routing dan struktur folder untuk role-based pages dengan tujuan menghilangkan prefix "manajer-" dan "staf-" dari URL dan folder structure. Perubahan ini akan menyederhanakan struktur routing dengan menggunakan nama departemen langsung, sambil mempertahankan semua fungsionalitas UI/UX yang sudah berjalan dengan baik. Sistem juga harus mendukung shared folders untuk multiple roles (seperti QC, Supervisor, Crew, dan Produksi).

## Requirements

### Requirement 1: Route Structure Simplification

**User Story:** Sebagai developer, saya ingin struktur routing yang lebih sederhana tanpa prefix "manajer-" dan "staf-", sehingga URL lebih clean dan mudah dipahami.

#### Acceptance Criteria

1. WHEN mengakses halaman departemen THEN URL harus menggunakan nama departemen langsung (contoh: `/hrd/dashboard` bukan `/manajer-hrd/dashboard`)
2. WHEN route didefinisikan THEN prefix harus menggunakan nama departemen tanpa "manajer-" atau "staf-" (contoh: `Route::prefix('hrd')`)
3. WHEN route name didefinisikan THEN harus menggunakan format `{departemen}.{action}` (contoh: `hrd.dashboard`)
4. IF route sebelumnya menggunakan prefix "staf-" THEN route tersebut harus dihapus karena tidak ada role staf di sistem
5. WHEN semua route diupdate THEN tidak boleh ada route dengan prefix "manajer-" atau "staf-"

### Requirement 2: Folder Structure Reorganization

**User Story:** Sebagai developer, saya ingin struktur folder yang konsisten dengan routing baru, sehingga mudah menemukan file berdasarkan departemen.

#### Acceptance Criteria

1. WHEN folder role dipindah THEN harus menggunakan nama departemen langsung di `resources/js/pages/roles/{departemen}/`
2. WHEN folder "manajer-{departemen}" ada THEN harus dipindah ke `{departemen}/`
3. WHEN folder "staf-{departemen}" ada THEN harus dihapus karena tidak ada role staf
4. WHEN memindahkan folder THEN semua subfolder dan file di dalamnya harus ikut terpindah dengan struktur yang sama
5. WHEN folder `Keuangan/` (uppercase) ada THEN harus direname ke `keuangan/` (lowercase) untuk konsistensi

### Requirement 3: Shared Folder Support for Multiple Roles

**User Story:** Sebagai developer, saya ingin beberapa folder dapat digunakan oleh multiple roles yang berbeda, sehingga tidak perlu duplikasi kode untuk role yang memiliki UI/UX yang sama.

#### Acceptance Criteria

1. WHEN folder `qc/` diakses THEN harus dapat digunakan oleh role "QC Besi" dan "QC Kayu"
2. WHEN folder `produksi/` diakses THEN harus dapat digunakan oleh role "Manajer Produksi Besi" dan "Manajer Produksi Kayu"
3. WHEN folder `supervisor/` diakses THEN harus dapat digunakan oleh role "Supervisor Besi" dan "Supervisor Kayu"
4. WHEN folder `crew/` diakses THEN harus dapat digunakan oleh role "Crew Besi" dan "Crew Kayu" (sudah ada, harus dipertahankan)
5. IF role memiliki halaman spesifik per material THEN tetap gunakan folder terpisah (contoh: `produksi-besi/`, `produksi-kayu/`)

### Requirement 4: Inertia Render Path Updates

**User Story:** Sebagai developer, saya ingin semua Inertia render path menggunakan struktur folder baru, sehingga halaman dapat dirender dengan benar.

#### Acceptance Criteria

1. WHEN Inertia::render dipanggil THEN path harus menggunakan format `roles.{departemen}.{page}`
2. WHEN path sebelumnya menggunakan "manajer-{departemen}" THEN harus diubah ke `{departemen}`
3. WHEN path sebelumnya menggunakan "staf-{departemen}" THEN route tersebut harus dihapus
4. WHEN render path diupdate THEN harus sesuai dengan lokasi file di folder structure baru
5. WHEN semua render path diupdate THEN tidak boleh ada path dengan "manajer-" atau "staf-"

### Requirement 5: Controller Namespace Migration

**User Story:** Sebagai developer, saya ingin controller namespace mengikuti struktur departemen baru, sehingga konsisten dengan routing dan folder structure.

#### Acceptance Criteria

1. WHEN controller folder dipindah THEN harus dari `app/Http/Controllers/Manajer{Departemen}/` ke `app/Http/Controllers/{Departemen}/`
2. WHEN namespace controller diupdate THEN harus menggunakan format `App\Http\Controllers\{Departemen}`
3. WHEN controller diimport di routes THEN harus menggunakan namespace baru
4. WHEN controller dipindah THEN semua file controller di dalamnya harus ikut terpindah
5. WHEN namespace diubah THEN harus diupdate di dalam file controller itu sendiri

### Requirement 6: Preserve Existing Functionality

**User Story:** Sebagai user, saya ingin semua fungsionalitas yang sudah ada tetap berjalan dengan baik setelah refactoring, sehingga tidak ada disruption pada penggunaan sistem.

#### Acceptance Criteria

1. WHEN halaman diakses dengan route baru THEN harus menampilkan UI/UX yang sama seperti sebelumnya
2. WHEN form disubmit THEN harus tetap berfungsi dengan endpoint yang benar
3. WHEN navigasi antar halaman THEN link harus menggunakan route name yang baru
4. WHEN middleware diaplikasikan THEN harus tetap berfungsi untuk authorization
5. WHEN semua perubahan selesai THEN tidak boleh ada broken functionality

### Requirement 7: Departemen-Specific Folder Mapping

**User Story:** Sebagai developer, saya ingin mapping yang jelas antara folder lama dan baru untuk setiap departemen, sehingga proses migrasi dapat dilakukan secara sistematis.

#### Acceptance Criteria

1. WHEN folder HRD dimigrate THEN `manajer-hrd/` → `hrd/` dan `staf-hrd/` dihapus
2. WHEN folder Marketing dimigrate THEN `manajer-marketing/` merge dengan `marketing/` yang sudah ada
3. WHEN folder PPIC dimigrate THEN `manajer-ppic/` → `ppic/` dan `staf-ppic/` dihapus
4. WHEN folder Keuangan dimigrate THEN `Keuangan/` → `keuangan/` (lowercase) dan `staf-keuangan/` dihapus
5. WHEN folder Operasional dimigrate THEN `manajer-operasional/` → `operasional/`
6. WHEN folder Produksi dimigrate THEN `manajer-produksi/` → `produksi/` (shared folder)
7. WHEN folder Produksi Besi dimigrate THEN `manajer-produksi-besi/` → `produksi-besi/` dan `staf-produksi-besi/` dihapus
8. WHEN folder Produksi Kayu dimigrate THEN `manajer-produksi-kayu/` → `produksi-kayu/` dan `staf-produksi-kayu/` dihapus
9. WHEN folder QC dimigrate THEN `qc-besi/` dan `qc-kayu/` merge ke `qc/` (shared folder)
10. WHEN folder Supervisor dimigrate THEN `supervisor-besi/` dan `supervisor-kayu/` merge ke `supervisor/` (shared folder)

### Requirement 8: Route Name Consistency

**User Story:** Sebagai developer, saya ingin route names yang konsisten di seluruh aplikasi, sehingga mudah untuk generate URL dan melakukan navigasi.

#### Acceptance Criteria

1. WHEN route name didefinisikan THEN harus mengikuti pattern `{departemen}.{section}.{action}`
2. WHEN route untuk dashboard THEN harus menggunakan name `{departemen}.index`
3. WHEN route memiliki nested group THEN name harus mengikuti hierarki (contoh: `hrd.karyawan.daftar`)
4. WHEN route name digunakan di frontend THEN harus menggunakan helper `route()` dengan name yang baru
5. WHEN semua route name diupdate THEN tidak boleh ada konflik atau duplikasi

### Requirement 9: Cache Clearing and Build Process

**User Story:** Sebagai developer, saya ingin proses yang jelas untuk clear cache dan rebuild setelah perubahan, sehingga perubahan dapat langsung terlihat.

#### Acceptance Criteria

1. WHEN route diubah THEN harus menjalankan `php artisan route:clear`
2. WHEN config diubah THEN harus menjalankan `php artisan config:clear`
3. WHEN view diubah THEN harus menjalankan `php artisan view:clear`
4. WHEN cache diubah THEN harus menjalankan `php artisan cache:clear`
5. WHEN frontend diubah THEN harus menjalankan `npm run build` untuk production atau `npm run dev` untuk development

### Requirement 10: Testing and Validation

**User Story:** Sebagai developer, saya ingin dapat memvalidasi bahwa semua perubahan berjalan dengan benar, sehingga tidak ada broken links atau missing pages.

#### Acceptance Criteria

1. WHEN route list digenerate THEN harus menampilkan semua route baru dengan prefix yang benar
2. WHEN halaman diakses THEN tidak boleh ada error 404 atau 500
3. WHEN TypeScript dicompile THEN tidak boleh ada error terkait path yang salah
4. WHEN diagnostics dijalankan THEN tidak boleh ada error di file yang diubah
5. WHEN testing manual dilakukan THEN semua halaman harus dapat diakses dan berfungsi dengan baik
