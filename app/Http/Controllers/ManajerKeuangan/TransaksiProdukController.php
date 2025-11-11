<?php

namespace App\Http\Controllers\ManajerKeuangan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProdukJual;

class TransaksiProdukController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'bulan', 'status']);

        // Hanya tampilkan pesanan yang sudah dikonfirmasi Marketing
        $transaksi = ProdukJual::query()
            ->with(['diajukanOleh', 'disetujuiOleh'])
            ->where('status', 'Dikonfirmasi Marketing')
            ->where('status_tenggat', 'Final')
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('nama_produk', 'like', '%' . $search . '%');
            })
            ->when($filters['bulan'] ?? null, function ($query, $bulan) {
                $query->whereMonth('tenggat_pengiriman_ppic', $bulan);
            })
            ->orderBy('tenggat_pengiriman_ppic', 'asc')
            ->paginate(20)
            ->withQueryString();

        return response()->json([
            'transaksi' => $transaksi,
            'filters' => $filters,
        ]);
    }
}
