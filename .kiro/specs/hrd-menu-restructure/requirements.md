# Requirements Document - HRD Menu Restructure

## Introduction

Saat ini menu "Data Karyawan" di sidebar HRD (Manajer HRD) memiliki terlalu banyak item yang menumpuk dalam satu accordion. Hal ini membuat navigasi menjadi tidak efisien dan sulit dipahami. Requirement ini bertujuan untuk merestrukturisasi menu tersebut dengan memecah item-item yang terkait ke dalam sub-accordion yang lebih terorganisir.

**Current Structure (Problematic):**
```
Data Karyawan (Accordion)
├── Daftar Karyawan
├── Analisa Kepegawaian
├── Absensi & Kehadiran      ← Terkait Presensi
├── Penggajian Crew          ← Terkait Penggajian
└── Kontrak & Status Kerja
```

**Proposed Structure (Better):**
```
Data Karyawan (Accordion)
├── Daftar Karyawan
├── Analisa Kepegawaian
└── Kontrak & Status Kerja

Manajemen Absensi (Accordion) ← BARU, SETARA
├── Presensi
│   ├── Absensi Harian (list dengan filter tanggal)
│   ├── Rekap Absensi (summary per periode)
│   └── Daftar Karyawan (click → detail rekap per karyawan)
├── Pengajuan Izin & Lembur
│   ├── Tab: Pengajuan Masuk (pending requests)
│   └── Tab: Riwayat (approved/rejected)
└── Pengaturan Jadwal
    ├── Tab: Daftar Karyawan (click → kalender edit jadwal)
    └── Tab: Jadwal Per Jabatan (aturan jadwal per role)

Manajemen Penggajian (Accordion) ← BARU, SETARA
├── Proses Penggajian (alur pemrosesan)
├── Riwayat Penggajian (list karyawan → click → slip gaji per periode)
└── Pengaturan Penggajian (aturan & komponen gaji)
```

---

## Requirements

### Requirement 1: Restructure HRD Menu - Separate Concerns

**User Story:** Sebagai Manajer HRD (Rina Astuti), saya ingin menu "Data Karyawan" dipecah menjadi tiga accordion terpisah yang lebih fokus (Data Karyawan, Manajemen Absensi, Manajemen Penggajian), sehingga saya dapat dengan mudah menemukan fitur yang saya butuhkan dengan struktur yang jelas dan terorganisir.

#### Acceptance Criteria

1. WHEN saya login sebagai Manajer HRD THEN saya melihat tiga accordion terpisah di sidebar:
   - "Data Karyawan" (fokus pada data master karyawan)
   - "Manajemen Absensi" (fokus pada presensi, izin/lembur, jadwal)
   - "Manajemen Penggajian" (fokus pada proses dan riwayat penggajian)

2. WHEN saya expand menu "Data Karyawan" THEN saya melihat:
   - Daftar Karyawan
   - Analisa Kepegawaian
   - Kontrak & Status Kerja

3. WHEN saya expand menu "Manajemen Absensi" THEN saya melihat:
   - Presensi (halaman dengan tabs: Absensi Harian, Rekap Absensi, Daftar Karyawan)
   - Pengajuan Izin & Lembur (halaman dengan tabs: Pengajuan Masuk, Riwayat)
   - Pengaturan Jadwal (halaman dengan tabs: Daftar Karyawan, Jadwal Per Jabatan)

4. WHEN saya expand menu "Manajemen Penggajian" THEN saya melihat:
   - Proses Penggajian
   - Riwayat Penggajian
   - Pengaturan Penggajian

5. WHEN saya click pada menu item THEN saya diarahkan ke halaman yang sesuai
6. WHEN saya berada di halaman tertentu THEN menu accordion yang sesuai otomatis terbuka dan item aktif di-highlight

---

### Requirement 2: Create New Routes for Presensi Pages

**User Story:** Sebagai developer, saya ingin membuat route baru untuk halaman-halaman presensi yang lebih detail, sehingga user dapat mengakses berbagai view presensi dengan mudah.

#### Acceptance Criteria

1. WHEN route `/roles/manajer-hrd/presensi/laporan-kehadiran` diakses THEN halaman Laporan Kehadiran ditampilkan
2. WHEN route `/roles/manajer-hrd/presensi/rekap-harian` diakses THEN halaman Rekap Absensi Harian ditampilkan
3. WHEN route `/roles/manajer-hrd/presensi/rekap-bulanan` diakses THEN halaman Rekap Absensi Bulanan ditampilkan
4. WHEN route `/roles/manajer-hrd/karyawan/penggajian` diakses THEN halaman Penggajian Crew ditampilkan (existing route)
5. WHEN route `/roles/manajer-hrd/presensi/slip-gaji` diakses THEN halaman Slip Gaji Crew ditampilkan
6. WHEN user mengakses route lama `/roles/manajer-hrd/karyawan/absensi` THEN redirect ke `/roles/manajer-hrd/presensi/laporan-kehadiran` (backward compatibility)

---

### Requirement 3: Update Sidebar Menu Configuration

**User Story:** Sebagai developer, saya ingin konfigurasi menu sidebar di-update untuk menampilkan accordion baru "Presensi & Penggajian Crew" yang setara dengan "Data Karyawan".

#### Acceptance Criteria

1. WHEN menu configuration di-update THEN accordion "Data Karyawan" hanya berisi 3 item (Daftar, Analisa, Kontrak)
2. WHEN menu configuration di-update THEN accordion baru "Presensi & Penggajian Crew" ditambahkan dengan 5 item
3. WHEN NavMain component merender menu THEN kedua accordion ditampilkan dengan hierarchy yang sama
4. WHEN user expand accordion THEN state management berfungsi dengan baik
5. WHEN user navigate ke halaman THEN accordion yang relevan otomatis terbuka
6. IF menu item memiliki children THEN icon chevron ditampilkan

---

### Requirement 4: Consistent UI/UX

**User Story:** Sebagai Manajer HRD, saya ingin tampilan menu yang konsisten dengan design system yang sudah ada, sehingga pengalaman pengguna tetap familiar dan tidak membingungkan.

#### Acceptance Criteria

1. WHEN sub-accordion ditampilkan THEN indentation visual jelas menunjukkan hierarchy
2. WHEN menu item di-hover THEN hover effect konsisten dengan menu lainnya
3. WHEN menu item aktif THEN styling aktif konsisten dengan menu lainnya
4. WHEN accordion di-expand/collapse THEN animasi smooth dan konsisten
5. IF nested accordion terlalu dalam THEN max depth dibatasi untuk menghindari UI yang terlalu kompleks
6. WHEN user menggunakan keyboard navigation THEN semua menu item dapat diakses dengan keyboard

---

### Requirement 5: Apply to Staf HRD Role

**User Story:** Sebagai Staf HRD, saya ingin memiliki struktur menu yang sama dengan Manajer HRD (dengan penyesuaian permission), sehingga konsistensi UI/UX terjaga di semua role HRD.

#### Acceptance Criteria

1. WHEN saya login sebagai Staf HRD THEN struktur menu "Data Karyawan" sama dengan Manajer HRD
2. WHEN saya tidak memiliki permission untuk menu tertentu THEN menu tersebut tidak ditampilkan
3. WHEN saya expand menu THEN behavior sama dengan Manajer HRD
4. WHEN saya navigate THEN routing berfungsi sesuai dengan role Staf HRD
5. IF ada perbedaan permission THEN hanya menu yang sesuai permission yang ditampilkan

---

## Edge Cases & Constraints

### Edge Cases:
1. **Deep Nesting:** Jika di masa depan ada kebutuhan untuk nesting lebih dari 2 level, system harus dapat handle dengan graceful degradation
2. **Mobile View:** Pada mobile view, nested accordion harus tetap dapat digunakan dengan mudah
3. **Slow Network:** Saat network lambat, state accordion harus tetap konsisten
4. **Browser Back/Forward:** Saat user menggunakan browser back/forward, accordion state harus sesuai dengan halaman yang ditampilkan

### Constraints:
1. **No Breaking Changes:** Semua route yang sudah ada harus tetap berfungsi
2. **Performance:** Rendering nested accordion tidak boleh menyebabkan lag atau performance issue
3. **Accessibility:** Semua menu harus accessible via keyboard dan screen reader
4. **Backward Compatibility:** Konfigurasi menu yang lama harus tetap berfungsi untuk role lain yang belum di-update

---

## Success Criteria

1. ✅ Menu "Data Karyawan" dipecah menjadi struktur yang lebih terorganisir
2. ✅ Sub-accordion "Presensi" dan "Penggajian" berfungsi dengan baik
3. ✅ Semua route existing tetap berfungsi tanpa perubahan
4. ✅ UI/UX konsisten dengan design system yang ada
5. ✅ Perubahan diterapkan untuk Manajer HRD dan Staf HRD
6. ✅ No performance degradation
7. ✅ Fully accessible via keyboard dan screen reader
8. ✅ Mobile responsive

---

## Out of Scope

1. ❌ Perubahan pada menu role lain (Direktur, PPIC, Keuangan, dll) - akan dilakukan di spec terpisah jika diperlukan
2. ❌ Perubahan pada halaman content (hanya menu sidebar yang di-update)
3. ❌ Perubahan pada routing structure (route tetap sama)
4. ❌ Perubahan pada permission system (permission logic tetap sama)

---

## Technical Notes

**Files to be Modified:**
1. `resources/js/config/sidebar-menu.ts` - Update menu configuration (add new accordion, restructure items)
2. `routes/web.php` - Add new routes for presensi pages
3. Create new page files:
   - `resources/js/pages/roles/manajer-hrd/presensi/laporan-kehadiran.tsx`
   - `resources/js/pages/roles/manajer-hrd/presensi/rekap-harian.tsx`
   - `resources/js/pages/roles/manajer-hrd/presensi/rekap-bulanan.tsx`
   - `resources/js/pages/roles/manajer-hrd/presensi/slip-gaji.tsx`
4. Update existing: `resources/js/pages/roles/manajer-hrd/karyawan/absensi.tsx` - Add redirect or update content

**Testing Focus:**
1. Menu rendering dengan accordion baru
2. Accordion state management
3. Active menu highlighting
4. Route navigation
5. Backward compatibility (old routes still work)
6. Keyboard navigation
7. Mobile responsiveness
