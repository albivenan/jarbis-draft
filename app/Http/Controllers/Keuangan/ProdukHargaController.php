<?php

namespace App\Http\Controllers\Keuangan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Keuangan\ProdukJual;
use Carbon\Carbon;

class ProdukHargaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $produkHarga = ProdukJual::with('diajukanOleh:id,name', 'disetujuiOleh:id,name')
            ->latest('diajukan_pada')
            ->paginate(10);

        return Inertia::render('roles/Keuangan/keuangan-produk/harga/index', [
            'produkHarga' => $produkHarga,
            'filters' => request()->only(['search', 'status']), // Placeholder for filters
        ]);
    }

    /**
     * Approve a product price proposal.
     */
    public function approve(Request $request, ProdukJual $produkHarga)
    {
        $request->validate([
            'harga_disetujui_keuangan' => 'required|numeric|min:0',
            'margin_keuangan' => 'required|numeric|min:0|max:100',
        ]);

        try {
            $produkHarga->update([
                'status' => 'Disetujui',
                'harga_disetujui_keuangan' => $request->harga_disetujui_keuangan,
                'margin_keuangan' => $request->margin_keuangan,
                'disetujui_oleh_id' => Auth::id(),
                'direspon_pada' => Carbon::now(),
            ]);

            return redirect()->back()->with('success', 'Usulan harga produk berhasil disetujui.');
        } catch (\Exception $e) {
            Log::error('Error approving Produk Jual price: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal menyetujui usulan harga: ' . $e->getMessage());
        }
    }

    /**
     * Reject a product price proposal.
     */
    public function reject(ProdukJual $produkHarga)
    {
        try {
            $produkHarga->update([
                'status' => 'Ditolak',
                'disetujui_oleh_id' => Auth::id(),
                'direspon_pada' => Carbon::now(),
            ]);

            return redirect()->back()->with('success', 'Usulan harga produk berhasil ditolak.');
        } catch (\Exception $e) {
            Log::error('Error rejecting Produk Jual price: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal menolak usulan harga: ' . $e->getMessage());
        }
    }
}
