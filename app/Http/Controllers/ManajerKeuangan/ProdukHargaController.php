<?php

namespace App\Http\Controllers\ManajerKeuangan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ProdukJual;
use Illuminate\Support\Facades\Auth;

class ProdukHargaController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status']);

        $produkHarga = ProdukJual::query()
            ->with(['diajukanOleh', 'disetujuiOleh']) // Eager load relasi
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('nama_produk', 'like', '%' . $search . '%');
            })
            ->when($filters['status'] ?? null, function ($query, $status) {
                $query->where('status', $status);
            }, function ($query) {
                // Default: tampilkan Menunggu Persetujuan Keuangan dan Banding Harga
                $query->whereIn('status', ['Menunggu Persetujuan Keuangan', 'Banding Harga']);
            })
            ->orderBy('diajukan_pada', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('roles/keuangan/keuangan-produk/harga/index', [
            'produkHarga' => $produkHarga,
            'filters' => $filters,
        ]);
    }

    public function approve(Request $request, ProdukJual $produkJual)
    {
        $request->validate([
            'harga_disetujui_keuangan' => 'required|numeric|min:0',
            'margin_keuangan' => 'required|numeric|min:0|max:100',
        ]);

        // Pastikan status pesanan adalah 'Menunggu Persetujuan Keuangan'
        if ($produkJual->status !== 'Menunggu Persetujuan Keuangan') {
            return redirect()->back()
                ->with('error', 'Pesanan tidak dalam status yang benar untuk disetujui.');
        }

        $produkJual->update([
            'harga_disetujui_keuangan' => $request->harga_disetujui_keuangan,
            'margin_keuangan' => $request->margin_keuangan,
            'status' => 'Disetujui',
            'disetujui_oleh_id' => Auth::id(),
            'direspon_pada' => now(),
        ]);

        return redirect()->back()
            ->with('success', 'Usulan harga produk berhasil disetujui!');
    }

    public function reject(Request $request, ProdukJual $produkJual)
    {
        // Pastikan status pesanan adalah 'Menunggu Persetujuan Keuangan' atau 'Banding Harga'
        if (!in_array($produkJual->status, ['Menunggu Persetujuan Keuangan', 'Banding Harga'])) {
            return redirect()->back()
                ->with('error', 'Pesanan tidak dalam status yang benar untuk ditolak.');
        }

        $request->validate([
            'alasan_penolakan' => 'nullable|string',
        ]);

        $produkJual->update([
            'status' => 'Ditolak',
            'alasan_penolakan' => $request->alasan_penolakan,
            'disetujui_oleh_id' => Auth::id(),
            'direspon_pada' => now(),
        ]);

        return redirect()->back()
            ->with('success', 'Usulan harga produk berhasil ditolak!');
    }

    public function approveBanding(Request $request, ProdukJual $produkJual)
    {
        $request->validate([
            'harga_disetujui_keuangan' => 'required|numeric|min:0',
            'margin_keuangan' => 'required|numeric|min:0|max:100',
        ]);

        // Pastikan status pesanan adalah 'Banding Harga'
        if ($produkJual->status !== 'Banding Harga') {
            return redirect()->back()
                ->with('error', 'Pesanan tidak dalam status banding harga.');
        }

        $produkJual->update([
            'harga_disetujui_keuangan' => $request->harga_disetujui_keuangan,
            'margin_keuangan' => $request->margin_keuangan,
            'status' => 'Disetujui',
            'disetujui_oleh_id' => Auth::id(),
            'direspon_pada' => now(),
        ]);

        return redirect()->back()
            ->with('success', 'Banding harga berhasil disetujui!');
    }
}
