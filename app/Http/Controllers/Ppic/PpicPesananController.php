<?php

namespace App\Http\Controllers\Ppic;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\Keuangan\ProdukJual; // Import the ProdukJual model
use Carbon\Carbon; // Import Carbon for timestamps

class PpicPesananController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ProdukJual::with(['diajukanOleh', 'disetujuiOleh']);

        // Apply search filter
        if ($request->has('search') && $request->input('search') !== null) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama_produk', 'like', '%' . $search . '%')
                  ->orWhere('deskripsi', 'like', '%' . $search . '%');
            });
        }

        // Apply status filter
        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        $pesanan = $query->latest()->paginate(10); // Paginate with 10 items per page

        return Inertia::render('roles/ppic/perencanaan/pesanan/index', [
            'pesanan' => $pesanan,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Placeholder for data needed for the create form
        $products = []; // Replace with actual product data later

        return Inertia::render('roles/ppic/perencanaan/pesanan/create', [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_produk' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'harga_usulan_ppic' => 'required|numeric|min:0',
        ]);

        try {
            ProdukJual::create([
                'nama_produk' => $request->nama_produk,
                'deskripsi' => $request->deskripsi,
                'harga_usulan_ppic' => $request->harga_usulan_ppic,
                'status' => 'Pending',
                'diajukan_oleh_id' => Auth::id(),
                'diajukan_pada' => Carbon::now(),
            ]);

            return redirect()->route('manajer-ppic.perencanaan.pesanan.index')->with('success', 'Usulan harga produk berhasil diajukan ke Keuangan.');
        } catch (\Exception $e) {
            Log::error('Error storing new Produk Jual proposal: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal mengajukan usulan harga: ' . $e->getMessage());
        }
    }
}
