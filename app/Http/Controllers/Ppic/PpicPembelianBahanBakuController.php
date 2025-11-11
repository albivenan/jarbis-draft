<?php

namespace App\Http\Controllers\Ppic;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Keuangan\PembelianBahanBaku;
use App\Models\Keuangan\BahanBaku;
use Carbon\Carbon;

class PpicPembelianBahanBakuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = PembelianBahanBaku::with('items.bahanBaku:id,nama_bahan_baku')
            ->latest('waktu_batch');

        // Apply date filter
        if ($request->has('date')) {
            $date = Carbon::parse($request->query('date'))->toDateString();
            $query->where(function ($q) use ($date) {
                $q->whereDate('waktu_batch', $date)
                  ->orWhere('status_pembayaran', 'Belum Dibayar');
            });
        }

        // Apply search term for item name
        if ($request->has('search')) {
            $searchTerm = $request->query('search');
            $query->whereHas('items', function ($q) use ($searchTerm) {
                $q->where('nama_item', 'like', '%' . $searchTerm . '%');
            });
        }

        // Apply status filter
        if ($request->has('status') && $request->query('status') !== 'all') {
            $query->where('status_batch', $request->query('status'));
        }

        $purchaseRequests = $query->paginate(10)->withQueryString();

        return Inertia::render('roles/ppic/inventaris/pembelian/index', [
            'purchaseRequests' => $purchaseRequests,
            'filters' => $request->only(['date', 'search', 'status']), // Pass current filters back
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $bahanBakuList = BahanBaku::all(['id', 'nama_bahan_baku', 'satuan_dasar', 'harga_standar']);

        return Inertia::render('roles/ppic/inventaris/pembelian/create', [
            'bahanBakuList' => $bahanBakuList,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.nama_item' => 'required|string|max:255',
            'items.*.jumlah' => 'required|numeric|min:0.01',
            'items.*.satuan' => 'required|string|max:50',
            'items.*.harga_satuan' => 'required|numeric|min:0',
            'catatan' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            // Generate a unique batch number
            $nomor_batch = 'PR-' . Carbon::now()->format('Ymd-His');

            $totalHargaBatch = 0;
            $itemsData = [];

            foreach ($request->input('items') as $item) {
                // Find or create the master BahanBaku record
                $bahanBaku = BahanBaku::firstOrCreate(
                    ['nama_bahan_baku' => $item['nama_item']],
                    [
                        'satuan_dasar' => $item['satuan'],
                        'harga_standar' => $item['harga_satuan'],
                        // Add other default fields for a new BahanBaku if necessary
                    ]
                );

                $hargaSatuan = $item['harga_satuan'];
                $totalHargaItem = $item['jumlah'] * $hargaSatuan;
                $totalHargaBatch += $totalHargaItem;

                $itemsData[] = [
                    'bahan_baku_id' => $bahanBaku->id, // Link to the master record
                    'nama_item' => $item['nama_item'], // Store the name as it was entered
                    'jumlah' => $item['jumlah'],
                    'satuan' => $item['satuan'],
                    'harga_satuan' => $hargaSatuan,
                    'total_harga_item' => $totalHargaItem,
                    'status_item' => 'Pending',
                ];
            }

            // Create the Purchase Batch
            $pembelianBahanBaku = PembelianBahanBaku::create([
                'nomor_batch' => $nomor_batch,
                'waktu_batch' => Carbon::now(),
                'status_batch' => 'Pending',
                'status_pembayaran' => 'Belum Dibayar',
                'total_harga_batch' => $totalHargaBatch,
                'dibuat_oleh_id' => Auth::id(),
                'catatan' => $request->input('catatan'),
            ]);

            // Create the items for the batch
            $pembelianBahanBaku->items()->createMany($itemsData);

            DB::commit();
            return redirect()->route('manajer-ppic.inventaris.pembelian.index')->with('success', 'Permintaan pembelian berhasil dibuat.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing PPIC Purchase Request: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal membuat permintaan pembelian: ' . $e->getMessage());
        }
    }
}
