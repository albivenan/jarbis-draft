<?php

namespace App\Http\Controllers\ManajerPpic;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ProdukJual;

class PesananController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status']);

        $pesanan = ProdukJual::query()
            ->with(['diajukanOleh', 'disetujuiOleh']) // Eager load relasi
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('nama_produk', 'like', '%' . $search . '%');
            })
            ->when($filters['status'] ?? null, function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy('diajukan_pada', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('roles/ppic/perencanaan/pesanan/index', [
            'pesanan' => $pesanan,
            'filters' => $filters,
        ]);
    }

    public function submitPrice(Request $request, ProdukJual $produkJual)
    {
        $request->validate([
            'harga_usulan_ppic' => 'required|numeric|min:0',
        ]);

        // Pastikan pesanan berstatus 'Pending' sebelum PPIC bisa mengajukan harga
        if ($produkJual->status !== 'Pending') {
            return redirect()->back()
                ->with('error', 'Pesanan tidak dalam status yang benar untuk diajukan harga.');
        }

        $produkJual->update([
            'harga_usulan_ppic' => $request->harga_usulan_ppic,
            'status' => 'Menunggu Persetujuan Keuangan',
        ]);

        return redirect()->back()
            ->with('success', 'Harga usulan PPIC berhasil diajukan ke Keuangan.');
    }

    public function approveTenggat(ProdukJual $produkJual)
    {
        // Pastikan status tenggat adalah Menunggu Review PPIC atau Banding Tenggat
        if (!in_array($produkJual->status_tenggat, ['Menunggu Review PPIC', 'Banding Tenggat'])) {
            return redirect()->back()
                ->with('error', 'Tenggat tidak dalam status yang benar untuk disetujui.');
        }

        $produkJual->update([
            'tenggat_barang_jadi_ppic' => $produkJual->tenggat_barang_jadi_marketing,
            'tenggat_pengiriman_ppic' => $produkJual->tenggat_pengiriman_marketing,
            'status_tenggat' => 'Disetujui PPIC',
            'tenggat_direspon_ppic_pada' => now(),
        ]);

        return redirect()->back()
            ->with('success', 'Tenggat berhasil disetujui!');
    }

    public function rejectTenggat(Request $request, ProdukJual $produkJual)
    {
        // Pastikan status tenggat adalah Menunggu Review PPIC atau Banding Tenggat
        if (!in_array($produkJual->status_tenggat, ['Menunggu Review PPIC', 'Banding Tenggat'])) {
            return redirect()->back()
                ->with('error', 'Tenggat tidak dalam status yang benar untuk ditolak.');
        }

        $request->validate([
            'alasan_tenggat_ppic' => 'required|string',
        ]);

        $produkJual->update([
            'status_tenggat' => 'Ditolak PPIC',
            'alasan_tenggat_ppic' => $request->alasan_tenggat_ppic,
            'tenggat_direspon_ppic_pada' => now(),
        ]);

        return redirect()->back()
            ->with('success', 'Tenggat berhasil ditolak!');
    }

    public function updateTenggat(Request $request, ProdukJual $produkJual)
    {
        // Pastikan status tenggat adalah Menunggu Review PPIC atau Banding Tenggat
        if (!in_array($produkJual->status_tenggat, ['Menunggu Review PPIC', 'Banding Tenggat'])) {
            return redirect()->back()
                ->with('error', 'Tenggat tidak dalam status yang benar untuk diubah.');
        }

        $request->validate([
            'tenggat_barang_jadi_ppic' => 'required|date|after:today',
            'tenggat_pengiriman_ppic' => 'required|date|after:tenggat_barang_jadi_ppic',
            'alasan_tenggat_ppic' => 'required|string',
        ]);

        $produkJual->update([
            'tenggat_barang_jadi_ppic' => $request->tenggat_barang_jadi_ppic,
            'tenggat_pengiriman_ppic' => $request->tenggat_pengiriman_ppic,
            'status_tenggat' => 'Diubah PPIC',
            'alasan_tenggat_ppic' => $request->alasan_tenggat_ppic,
            'tenggat_direspon_ppic_pada' => now(),
        ]);

        return redirect()->back()
            ->with('success', 'Tenggat berhasil diubah!');
    }
}
