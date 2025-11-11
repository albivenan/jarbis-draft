# Implementation Plan - HRD Menu Restructure

## Task List

- [x] 1. Update Sidebar Menu Configuration





  - Update `resources/js/config/sidebar-menu.ts` untuk manajer_hrd
  - Pecah "Data Karyawan" accordion menjadi 3 accordion terpisah
  - Tambahkan "Manajemen Absensi" accordion dengan 3 menu items
  - Tambahkan "Manajemen Penggajian" accordion dengan 3 menu items
  - Update icons untuk setiap menu item
  - _Requirements: 1, 3_

- [x] 2. Create Routes for Manajemen Absensi




  - [x] 2.1 Add routes di `routes/web.php`


    - Route untuk `/roles/manajer-hrd/absensi/presensi`
    - Route untuk `/roles/manajer-hrd/absensi/pengajuan`
    - Route untuk `/roles/manajer-hrd/absensi/jadwal`
    - Redirect route dari `/roles/manajer-hrd/karyawan/absensi` ke `/roles/manajer-hrd/absensi/presensi`
    - _Requirements: 2, 3_

- [x] 3. Create Presensi Page with Tabs





  - [x] 3.1 Create page file `resources/js/pages/roles/manajer-hrd/absensi/presensi.tsx`


    - Setup AuthenticatedLayout dengan breadcrumbs
    - Implement Tabs component dengan 3 tabs
    - _Requirements: 1, 4_
  
  - [x] 3.2 Implement Tab: Absensi Harian


    - Date picker untuk filter tanggal
    - Table dengan columns: Nama, NIK, Jam Masuk, Jam Keluar, Status, Keterangan
    - Search & filter functionality
    - Export to Excel button
    - _Requirements: 1_
  
  - [x] 3.3 Implement Tab: Rekap Absensi


    - Period selector (month/year)
    - Summary cards: Total Hadir, Izin, Sakit, Alpa
    - Bar chart visualization
    - Export to PDF button
    - _Requirements: 1_
  
  - [x] 3.4 Implement Tab: Daftar Karyawan


    - Employee list dengan search
    - Filter by department/jabatan
    - Click employee → navigate to detail page
    - _Requirements: 1_

- [x] 4. Create Pengajuan Izin & Lembur Page





  - [x] 4.1 Create page file `resources/js/pages/roles/manajer-hrd/absensi/pengajuan.tsx`


    - Setup AuthenticatedLayout dengan breadcrumbs
    - Implement Tabs component dengan 2 tabs
    - _Requirements: 1, 4_
  

  - [x] 4.2 Implement Tab: Pengajuan Masuk

    - Table of pending requests
    - Columns: Nama, Jenis, Tanggal, Alasan, Aksi
    - Action buttons: Terima, Tolak
    - Approval/rejection modal dengan notes
    - Real-time badge count
    - _Requirements: 1_
  

  - [x] 4.3 Implement Tab: Riwayat

    - Table of processed requests
    - Filter by status, date range, employee
    - View details modal
    - _Requirements: 1_

- [x] 5. Create Pengaturan Jadwal Page





  - [x] 5.1 Create page file `resources/js/pages/roles/manajer-hrd/absensi/jadwal.tsx`


    - Setup AuthenticatedLayout dengan breadcrumbs
    - Implement Tabs component dengan 2 tabs
    - _Requirements: 1, 4_
  
  - [x] 5.2 Implement Tab: Daftar Karyawan


    - Employee list
    - Click employee → open calendar modal
    - Calendar component untuk edit schedule
    - Click date → edit shift, jam masuk/keluar
    - Bulk schedule assignment
    - _Requirements: 1_
  
  - [x] 5.3 Implement Tab: Jadwal Per Jabatan


    - List of roles/jabatan
    - Default schedule template per role
    - Edit template form
    - Apply template to all employees button
    - _Requirements: 1_

- [x] 6. Create Routes for Manajemen Penggajian






  - [x] 6.1 Add routes di `routes/web.php`


    - Route untuk `/roles/manajer-hrd/penggajian/proses`
    - Route untuk `/roles/manajer-hrd/penggajian/riwayat`
    - Route untuk `/roles/manajer-hrd/penggajian/pengaturan`
    - Redirect route dari `/roles/manajer-hrd/karyawan/penggajian` ke `/roles/manajer-hrd/penggajian/riwayat`
    - _Requirements: 2, 3_

- [x] 7. Create Proses Penggajian Page





  - [x] 7.1 Create page file `resources/js/pages/roles/manajer-hrd/penggajian/proses.tsx`


    - Setup AuthenticatedLayout dengan breadcrumbs
    - Implement Stepper component
    - _Requirements: 1, 4_
  

  - [x] 7.2 Implement Step 1: Pilih Periode

    - Period selector (month/year)
    - Employee filter (all/department/individual)
    - Next button
    - _Requirements: 1_
  
  - [x] 7.3 Implement Step 2: Hitung Gaji


    - Automatic calculation based on attendance
    - Show calculation breakdown
    - Loading state during calculation
    - Next button
    - _Requirements: 1_
  

  - [x] 7.4 Implement Step 3: Review & Approve

    - Table dengan salary details per employee
    - Manual adjustment capability
    - Bulk approve button
    - Back/Next buttons
    - _Requirements: 1_
  

  - [x] 7.5 Implement Step 4: Generate Slip Gaji

    - Generate PDF slip gaji untuk semua employees
    - Download all button
    - Email all button
    - Finish button
    - _Requirements: 1_

- [x] 8. Create Riwayat Penggajian Page





  - [x] 8.1 Create page file `resources/js/pages/roles/manajer-hrd/penggajian/riwayat.tsx`


    - Setup AuthenticatedLayout dengan breadcrumbs
    - Period filter component
    - _Requirements: 1, 4_
  
  - [x] 8.2 Implement Employee List

    - Table dengan columns: Nama, NIK, Jabatan, Gaji Terakhir
    - Search functionality
    - Click employee → show slip gaji modal
    - _Requirements: 1_
  

  - [x] 8.3 Implement Slip Gaji Modal





    - Display slip gaji details
    - Show: Gaji pokok, tunjangan, potongan, total
    - Download PDF button
    - Email slip button
    - _Requirements: 1_
- [x] 9. Create Pengaturan Penggajian Page






- [ ] 9. Create Pengaturan Penggajian Page


  - [x] 9.1 Create page file `resources/js/pages/roles/manajer-hrd/penggajian/pengaturan.tsx`

    - Setup AuthenticatedLayout dengan breadcrumbs
    - _Requirements: 1, 4_
  

  - [x] 9.2 Implement Komponen Gaji Section




    - List of salary components
    - Add/Edit/Delete component functionality
    - Form: Nama, Jenis (tunjangan/potongan), Nilai, Is Percentage
    - _Requirements: 1_
  

  - [x] 9.3 Implement Aturan Perhitungan Section



    - Overtime rate setting
    - Late deduction rules
    - Tax settings
    - Payment schedule configuration
    - _Requirements: 1_

- [ ] 10. Apply Changes to Staf HRD Role
  - [ ] 10.1 Update sidebar-menu.ts untuk staf_hrd
    - Copy structure dari manajer_hrd
    - Adjust permissions sesuai role
    - _Requirements: 5_
  
  - [ ] 10.2 Update routes untuk staf_hrd
    - Add routes dengan prefix `/roles/staf-hrd/`
    - Ensure permission middleware applied
    - _Requirements: 5_

- [ ] 11. Testing & Quality Assurance
  - [ ] 11.1 Test menu navigation
    - Test accordion expand/collapse
    - Test active menu highlighting
    - Test keyboard navigation
    - _Requirements: 4_
  
  - [ ] 11.2 Test all new pages
    - Test tab switching
    - Test form submissions
    - Test data loading
    - Test error handling
    - _Requirements: 1, 4_
  
  - [ ] 11.3 Test backward compatibility
    - Test old routes redirect correctly
    - Test existing functionality still works
    - _Requirements: 3_
  
  - [ ] 11.4 Test responsive design
    - Test on mobile devices
    - Test on tablets
    - Test on desktop
    - _Requirements: 4_

- [ ] 12. Documentation & Cleanup
  - Update README if needed
  - Add inline code comments
  - Remove unused code
  - Optimize imports
  - _Requirements: All_
