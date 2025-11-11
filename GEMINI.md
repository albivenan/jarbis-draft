1. Migrasi Basis Data & Model
       * Perbarui enum status tabel produk_jual.
       * Buat Model ProdukJual.

  2. Backend (Controller & Rute)
       * Controller Marketing (fungsionalitas baru).
       * Controller PPIC (fungsionalitas baru).
       * Controller Keuangan (verifikasi kompatibilitas).
       * Definisi rute.

  3. Frontend (Komponen UI)
       * Marketing CRM (crm/index.tsx).
       * PPIC Pesanan (perencanaan/pesanan/index.tsx).
       * Keuangan Harga (keuangan-produk/harga/index.tsx).

  4. Verifikasi/Pengujian

  ---

  Rencana Implementasi Terperinci:

  1. Migrasi Basis Data & Model

  1.1. Perbarui `produk_jual` table `status` enum
       * Tujuan: Menambahkan status baru Dikonfirmasi Marketing (atau Siap Produksi) ke kolom
         status di tabel produk_jual.
       * Perubahan: Buat migrasi baru untuk mengubah definisi kolom status.
       * Terminal Command:
   1         php artisan make:migration add_confirmed_status_to_produk_jual_table
       * File to Update:
         database/migrations/<timestamp>_add_confirmed_status_to_produk_jual_table.php
       * Contoh Perubahan (dalam metode `up()`):

   1         Schema::table('produk_jual', function (Blueprint $table) {
   2             $table->enum('status', ['Pending', 'Menunggu Persetujuan Keuangan', 'Disetujui
     ', 'Ditolak', 'Dikonfirmasi Marketing'])->change();
   3         });
       * Catatan: Jika Anda memilih string untuk status, pastikan validasi di aplikasi untuk
         status yang valid. Untuk saat ini, saya akan mengasumsikan enum yang diperbarui.

  1.2. Buat Model `ProdukJual`
       * Tujuan: Menyediakan antarmuka Eloquent untuk berinteraksi dengan tabel produk_jual.
       * Perubahan: Buat file model baru.
       * Terminal Command:
   1         php artisan make:model ProdukJual
       * File to Create: app/Models/ProdukJual.php
       * Contoh Konten:

    1         <?php
    2 
    3         namespace App\Models;
    4 
    5         use Illuminate\Database\Eloquent\Factories\HasFactory;
    6         use Illuminate\Database\Eloquent\Model;
    7 
    8         class ProdukJual extends Model
    9         {
   10             use HasFactory;
   11 
   12             protected $table = 'produk_jual';
   13             protected $guarded = ['id'];
   14 
   15             protected $fillable = [
   16                 'nama_produk',
   17                 'deskripsi',
   18                 'harga_usulan_ppic',
   19                 'harga_disetujui_keuangan',
   20                 'margin_keuangan',
   21                 'status',
   22                 'diajukan_oleh_id',
   23                 'disetujui_oleh_id',
   24                 'diajukan_pada',
   25                 'direspon_pada',
   26             ];
   27 
   28             protected $casts = [
   29                 'diajukan_pada' => 'datetime',
   30                 'direspon_pada' => 'datetime',
   31             ];
   32
   33             public function diajukanOleh()
   34             {
   35                 return $this->belongsTo(User::class, 'diajukan_oleh_id');
   36             }
   37
   38             public function disetujuiOleh()
   39             {
   40                 return $this->belongsTo(User::class, 'disetujui_oleh_id');
   41             }
   42         }
       * Catatan: Pastikan model User ada dan berada di namespace yang benar.

  2. Backend: Controllers & Routes

  2.1. Marketing Controller (untuk Pembuatan & Konfirmasi Pesanan)
       * Tujuan: Menangani logika backend untuk Marketing dalam membuat pesanan baru dan
         mengkonfirmasi pesanan yang disetujui pelanggan.
       * Perubahan: Buat controller baru.
       * Terminal Command:

   1         php artisan make:controller ManajerMarketing/PesananController
       * File to Create: app/Http/Controllers/ManajerMarketing/PesananController.php
       * Metode yang Diperlukan:
           * store(Request $request): Untuk membuat pesanan baru.
           * index(Request $request): Untuk menampilkan daftar pesanan yang dibuat oleh
             Marketing.
           * confirm(ProdukJual $produkJual): Untuk mengubah status pesanan menjadi
             Dikonfirmasi Marketing.

  2.2. PPIC Controller (untuk Pengajuan Harga Usulan)
       * Tujuan: Menangani logika backend untuk PPIC dalam memasukkan harga_usulan_ppic dan
         mengubah status.
       * Perubahan: Buat controller baru.
       * Terminal Command:

   1         php artisan make:controller ManajerPpic/PesananController
       * File to Create: app/Http/Controllers/ManajerPpic/PesananController.php
       * Metode yang Diperlukan:
           * index(Request $request): Untuk menampilkan daftar pesanan yang perlu diproses
             PPIC.
           * submitPrice(Request $request, ProdukJual $produkJual): Untuk PPIC memasukkan
             harga_usulan_ppic.

  2.3. Keuangan Controller (Verifikasi & Kompatibilitas)
       * Tujuan: Memastikan controller Keuangan yang ada kompatibel dengan model ProdukJual dan
         alur status baru.
       * Perubahan: Identifikasi controller yang menangani rute
         manajer-keuangan.keuangan-produk.harga.approve dan reject. Asumsikan itu adalah
         app/Http/Controllers/ManajerKeuangan/ProdukHargaController.php.
       * File to Update: app/Http/Controllers/ManajerKeuangan/ProdukHargaController.php (atau
         yang relevan).
       * Verifikasi Metode:
           * approve(Request $request, ProdukJual $produkJual): Pastikan menerima data yang
             benar dan memperbarui status.
           * reject(ProdukJual $produkJual): Pastikan memperbarui status.
           * index(Request $request): Pastikan mengambil data ProdukJual yang relevan.

  2.4. Definisi Rute
       * Tujuan: Menghubungkan URL dengan metode controller yang sesuai.
       * Perubahan: Tambahkan rute baru di routes/web.php.
       * File to Update: routes/web.php
       * Contoh Rute:

    1         use App\Http\Controllers\ManajerMarketing\PesananController as 
      MarketingPesananController;
    2         use App\Http\Controllers\ManajerPpic\PesananController as PpicPesananController;
    3         use App\Http\Controllers\ManajerKeuangan\ProdukHargaController;
    4 
    5         // Rute untuk Marketing
    6         Route::middleware(['auth', 'role:manajer-marketing'])->prefix('manajer-marketing'
      )->name('manajer-marketing.')->group(function () {
    7             Route::get('crm', [MarketingPesananController::class, 'index'])->name(
      'crm.index');
    8             Route::post('pesanan', [MarketingPesananController::class, 'store'])->name(
      'pesanan.store');
    9             Route::put('pesanan/{produkJual}/confirm', [MarketingPesananController::class
      , 'confirm'])->name('pesanan.confirm');
   10         });
   11 
   12         // Rute untuk PPIC
   13         Route::middleware(['auth', 'role:manajer-ppic'])->prefix('manajer-ppic')->name(
      'manajer-ppic.')->group(function () {
   14             Route::get('perencanaan/pesanan', [PpicPesananController::class, 'index'])->
      name('perencanaan.pesanan.index');
   15             Route::put('perencanaan/pesanan/{produkJual}/submit-price', [
      PpicPesananController::class, 'submitPrice'])->name('perencanaan.pesanan.submit-price');
   16         });
   17 
   18         // Rute untuk Keuangan (verifikasi yang sudah ada)
   19         Route::middleware(['auth', 'role:manajer-keuangan'])->prefix('manajer-keuangan'
      )->name('manajer-keuangan.')->group(function () {
   20             Route::get('keuangan-produk/harga', [ProdukHargaController::class, 'index'
      ])->name('keuangan-produk.harga.index');
   21             Route::put('keuangan-produk/harga/{produkJual}/approve', [
      ProdukHargaController::class, 'approve'])->name('keuangan-produk.harga.approve');
   22             Route::put('keuangan-produk/harga/{produkJual}/reject', [
      ProdukHargaController::class, 'reject'])->name('keuangan-produk.harga.reject');
   23         });
       * Catatan: Pastikan middleware auth dan role sudah dikonfigurasi dengan benar.

  3. Frontend: UI Components

  3.1. Marketing CRM (`resources/js/pages/roles/manajer-marketing/crm/index.tsx`)
       * Tujuan: Mengimplementasikan formulir pembuatan pesanan dan menampilkan daftar pesanan
         Marketing.
       * Perubahan:
           * Tambahkan formulir untuk input nama_produk dan deskripsi.
           * Gunakan Inertia.post(route('manajer-marketing.pesanan.store'), data) untuk
             mengirim data pesanan baru.
           * Tampilkan daftar pesanan yang diambil dari props.pesanan.
           * Tambahkan tombol/aksi untuk mengkonfirmasi pesanan yang berstatus Disetujui oleh
             Keuangan.

  3.2. PPIC Pesanan (`resources/js/pages/roles/manajer-ppic/perencanaan/pesanan/index.tsx`)
       * Tujuan: Memungkinkan PPIC melihat pesanan 'Pending' dan memasukkan harga_usulan_ppic.
       * Perubahan:
           * Modifikasi tampilan daftar untuk menyoroti pesanan dengan status 'Pending'.
           * Untuk setiap pesanan 'Pending', tambahkan input field untuk harga_usulan_ppic dan
             tombol "Ajukan Harga".
           * Gunakan Inertia.put(route('manajer-ppic.perencanaan.pesanan.submit-price', id), {
             harga_usulan_ppic: value }) untuk mengirim data.
           * Hapus atau ubah tombol "Tambah Pesanan Baru" jika tidak sesuai dengan alur baru.

  3.3. Keuangan Harga (`resources/js/pages/roles/Keuangan/keuangan-produk/harga/index.tsx`)
       * Tujuan: Memastikan komponen ini berfungsi dengan baik dengan alur status baru.
       * Perubahan:
           * Verifikasi bahwa filter status mencakup Menunggu Persetujuan Keuangan dan status
             baru lainnya.
           * Pastikan handleApprove dan handleReject mengirimkan data yang benar dan
             memperbarui status sesuai dengan alur.
           * Pastikan tampilan memperbarui status pesanan secara real-time setelah aksi.

  4. Verifikasi & Pengujian

  4.1. Jalankan Migrasi
       * Tujuan: Menerapkan perubahan skema database.
       * Terminal Command:
   1         php artisan migrate

  4.2. Uji Fungsionalitas
       * Tujuan: Memastikan setiap langkah alur kerja berfungsi dengan benar.
       * Langkah-langkah:
           * Login sebagai Marketing, buat pesanan baru. Verifikasi status 'Pending'.
           * Login sebagai PPIC, lihat pesanan 'Pending', masukkan harga usulan, ajukan.
             Verifikasi status 'Menunggu Persetujuan Keuangan'.
           * Login sebagai Keuangan, lihat pesanan 'Menunggu Persetujuan Keuangan',
             setujui/tolak. Verifikasi status 'Disetujui'/'Ditolak'.
           * Login sebagai Marketing, lihat pesanan 'Disetujui', konfirmasi. Verifikasi status
             'Dikonfirmasi Marketing'.
           * Uji kasus penolakan di setiap tahap.


DIAGRAM ALUR:
graph TD
    A1((START)) --> B1[Marketing: Membuat Pesanan];

    %% BAGIAN 1: PEMBUATAN PESANAN & STATUS PENDING)};
    B1 --> C1[Marketing: Input detail pesanan];
    C1 --> D1((System: Simpan ke tabel produk_jual));
    D1 --> E1{Status: 'Pending'};
    E1 --> F1[Marketing: Lihat daftar pesanan 'Pending'];

    %% BAGIAN 2: PERHITUNGAN HARGA OLEH PPIC
    F1 --> G1[PPIC: Melihat pesanan 'Pending'];
    G1 --> H1{PPIC: Hitung Harga Usulan};
    H1 --> I1((System: Update produk_jual));
    I1 --> J1{Status: 'Menunggu Persetujuan Keuangan'};
    J1 --> K1[PPIC: Lihat daftar pesanan 'Menunggu...'];

    %% BAGIAN 3: REVIEW DAN KEPUTUSAN OLEH KEUANGAN
    K1 --> L1[Keuangan: Melihat pesanan 'Menunggu Persetujuan Keuangan'];
    L1 --> M1{Keuangan: Review Usulan Harga & Margin};
    M1 --> N1{Keuangan: Keputusan?};

    %% JALUR 3A: APPROVED
    N1 -- Approved --> O1[Keuangan: Input margin & harga_disetujui];
    O1 --> P1((System: Update produk_jual));
    P1 --> Q1{Status: 'Disetujui'};
    Q1 --> R1[Keuangan: Lihat daftar pesanan 'Disetujui'];
    R1 --> S1[Pesan ke Marketing: Harga Disetujui];
    S1 --> T1[Marketing: Melihat pesanan 'Disetujui'];

    %% JALUR 3B: REJECTED
    N1 -- Rejected --> U1[Keuangan: Alasan Penolakan];
    U1 --> V1((System: Update produk_jual));
    V1 --> W1{Status: 'Ditolak'};
    W1 --> X1[Keuangan: Lihat daftar pesanan 'Ditolak'];
    X1 --> Y1[Pesan ke Marketing: Harga Ditolak];
    Y1 --> Z1[Marketing: Melihat pesanan 'Ditolak'];

    %% BAGIAN 4: TINDAK LANJUT MARKETING PADA PESANAN DITOLAK
    Z1 --> AA1{Marketing: Tindak Lanjut Pesanan Ditolak?};
    AA1 -- Re-negotiate --> B1;
    AA1 -- Cancel --> AB1((System: Update produk_jual status 'Dibatalkan'));
    AB1 --> AC1((END));

    %% BAGIAN 5: TINDAK LANJUT MARKETING PADA PESANAN DISETUJUI
    T1 --> AD1{Marketing: Pelanggan Setuju Harga Final?};
    AD1 -- Yes --> AE1((System: Update produk_jual));
    AE1 --> AF1{Status: 'Dikonfirmasi Marketing'}
    AF1 --> AG1((END));

    AD1 -- No --> AH1((System: Update produk_jual status 'Ditolak' atau 'Negosiasi Ulang'));
    AH1 --> AC1;