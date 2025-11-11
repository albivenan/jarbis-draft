<?php

namespace App\Http\Controllers\ManajerMarketing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ProdukJual;
use Illuminate\Support\Facades\Auth;

class PesananController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status']);

        $pesanan = ProdukJual::query()
            ->with(['diajukanOleh', 'disetujuiOleh']) // Eager load relasi
            ->where('diajukan_oleh_id', Auth::id()) // Hanya pesanan yang diajukan oleh Marketing ini
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('nama_produk', 'like', '%' . $search . '%');
            })
            ->when($filters['status'] ?? null, function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy('diajukan_pada', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('roles/manajer-marketing/crm/index', [
            'pesanan' => $pesanan,
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_produk' => 'required|string|max:100',
            'deskripsi' => 'nullable|string',
            'tenggat_barang_jadi_marketing' => 'required|date|after:today',
            'tenggat_pengiriman_marketing' => 'required|date|after:tenggat_barang_jadi_marketing',
        ]);

        ProdukJual::create([
            'nama_produk' => $request->nama_produk,
            'deskripsi' => $request->deskripsi,
            'tenggat_barang_jadi_marketing' => $request->tenggat_barang_jadi_marketing,
            'tenggat_pengiriman_marketing' => $request->tenggat_pengiriman_marketing,
            'status' => 'Pending',
            'status_tenggat' => 'Menunggu Review PPIC',
            'diajukan_oleh_id' => Auth::id(),
            'diajukan_pada' => now(),
        ]);

        return redirect()->route('manajer-marketing.crm.index')
            ->with('success', 'Pesanan baru berhasil diajukan.');
    }

    public function confirm(ProdukJual $produkJual)
    {
        // Pastikan hanya Marketing yang mengajukan pesanan ini yang bisa mengkonfirmasi
        if ($produkJual->diajukanOleh->id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki izin untuk mengkonfirmasi pesanan ini.');
        }

        // Pastikan status pesanan sudah disetujui oleh Keuangan
        if ($produkJual->status !== 'Disetujui') {
            return redirect()->back()
                ->with('error', 'Pesanan belum disetujui oleh Keuangan.');
        }

        // Pastikan tenggat sudah disetujui atau diubah oleh PPIC
        if (!in_array($produkJual->status_tenggat, ['Disetujui PPIC', 'Diubah PPIC'])) {
            return redirect()->back()
                ->with('error', 'Tenggat belum disetujui oleh PPIC.');
        }

        $produkJual->update([
            'status' => 'Dikonfirmasi Marketing',
            'status_tenggat' => 'Final',
        ]);

        return redirect()->back()
            ->with('success', 'Pesanan berhasil dikonfirmasi dan siap untuk produksi.');
    }

    public function reject(ProdukJual $produkJual)
    {
        // Pastikan hanya Marketing yang mengajukan pesanan ini yang bisa menolak
        if ($produkJual->diajukanOleh->id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki izin untuk menolak pesanan ini.');
        }

        // Pastikan status pesanan sudah disetujui oleh Keuangan
        if ($produkJual->status !== 'Disetujui') {
            return redirect()->back()
                ->with('error', 'Hanya pesanan yang disetujui yang bisa ditolak.');
        }

        $produkJual->update([
            'status' => 'Ditolak',
        ]);

        return redirect()->back()
            ->with('success', 'Pesanan berhasil ditolak.');
    }

    public function cancel(ProdukJual $produkJual)
    {
        // Pastikan hanya Marketing yang mengajukan pesanan ini yang bisa membatalkan
        if ($produkJual->diajukanOleh->id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki izin untuk membatalkan pesanan ini.');
        }

        $produkJual->update([
            'status' => 'Dibatalkan',
        ]);

        return redirect()->back()
            ->with('success', 'Pesanan berhasil dibatalkan.');
    }

    public function banding(Request $request, ProdukJual $produkJual)
    {
        // Pastikan hanya Marketing yang mengajukan pesanan ini yang bisa banding
        if ($produkJual->diajukanOleh->id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki izin untuk mengajukan banding pesanan ini.');
        }

        // Pastikan status pesanan ditolak atau disetujui
        if (!in_array($produkJual->status, ['Disetujui', 'Ditolak'])) {
            return redirect()->back()
                ->with('error', 'Hanya pesanan yang disetujui atau ditolak yang bisa diajukan banding.');
        }

        $request->validate([
            'harga_banding_marketing' => 'required|numeric|min:0',
            'alasan_banding' => 'required|string',
        ]);

        $produkJual->update([
            'harga_banding_marketing' => $request->harga_banding_marketing,
            'alasan_banding' => $request->alasan_banding,
            'status' => 'Banding Harga',
        ]);

        return redirect()->back()
            ->with('success', 'Banding harga berhasil diajukan ke Keuangan.');
    }

    public function bandingTenggat(Request $request, ProdukJual $produkJual)
    {
        // Pastikan hanya Marketing yang mengajukan pesanan ini yang bisa banding tenggat
        if ($produkJual->diajukanOleh->id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki izin untuk mengajukan banding tenggat pesanan ini.');
        }

        // Pastikan status tenggat adalah Diubah PPIC atau Ditolak PPIC
        if (!in_array($produkJual->status_tenggat, ['Diubah PPIC', 'Ditolak PPIC'])) {
            return redirect()->back()
                ->with('error', 'Hanya tenggat yang diubah atau ditolak PPIC yang bisa diajukan banding.');
        }

        $request->validate([
            'tenggat_barang_jadi_marketing' => 'required|date|after:today',
            'tenggat_pengiriman_marketing' => 'required|date|after:tenggat_barang_jadi_marketing',
            'alasan_banding_tenggat' => 'required|string',
        ]);

        $produkJual->update([
            'tenggat_barang_jadi_marketing' => $request->tenggat_barang_jadi_marketing,
            'tenggat_pengiriman_marketing' => $request->tenggat_pengiriman_marketing,
            'alasan_banding_tenggat' => $request->alasan_banding_tenggat,
            'status_tenggat' => 'Banding Tenggat',
        ]);

        return redirect()->back()
            ->with('success', 'Banding tenggat berhasil diajukan ke PPIC.');
    }
}
