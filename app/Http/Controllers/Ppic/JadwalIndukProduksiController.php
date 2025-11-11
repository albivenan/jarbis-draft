<?php

namespace App\Http\Controllers\Ppic;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ProdukJual;

class JadwalIndukProduksiController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'bulan']);

        // Hanya tampilkan pesanan yang sudah dikonfirmasi Marketing (status Final)
        $jadwalProduksi = ProdukJual::query()
            ->with(['diajukanOleh', 'disetujuiOleh'])
            ->where('status', 'Dikonfirmasi Marketing')
            ->where('status_tenggat', 'Final')
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('nama_produk', 'like', '%' . $search . '%');
            })
            ->when($filters['bulan'] ?? null, function ($query, $bulan) {
                $query->whereMonth('tenggat_barang_jadi_ppic', $bulan);
            })
            ->orderBy('tenggat_barang_jadi_ppic', 'asc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('roles/ppic/perencanaan/jadwal-induk-produksi/index', [
            'jadwalProduksi' => $jadwalProduksi,
            'filters' => $filters,
        ]);
    }
}
