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

class PpicPembelianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch purchase requests, maybe filtered by creator or show all
        $purchaseRequests = PembelianBahanBaku::with('items.bahanBaku:id,nama_bahan_baku')
            ->latest('waktu_batch')
            ->paginate(10);

        // Fetch raw materials for the creation form
        $bahanBakuList = BahanBaku::all(['id', 'nama_bahan_baku', 'satuan_dasar', 'harga_standar']);

        return Inertia::render('roles/ppic/inventaris/pembelian', [
            'purchaseRequests' => $purchaseRequests,
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
            'items.*.bahan_baku_id' => 'required|exists:bahan_baku,id',
            'items.*.jumlah' => 'required|numeric|min:0.01',
            'catatan' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            // Generate a unique batch number
            $nomor_batch = 'PR-' . Carbon::now()->format('Ymd-His');

            // Fetch item details from BahanBaku to calculate total price
            $totalHargaBatch = 0;
            $itemsData = [];

            foreach ($request->input('items') as $item) {
                $bahanBaku = BahanBaku::find($item['bahan_baku_id']);
                if (!$bahanBaku) {
                    throw new \Exception("Bahan baku dengan ID {$item['bahan_baku_id']} tidak ditemukan.");
                }
                $hargaSatuan = $bahanBaku->harga_standar;
                $totalHargaItem = $item['jumlah'] * $hargaSatuan;
                $totalHargaBatch += $totalHargaItem;

                $itemsData[] = [
                    'bahan_baku_id' => $bahanBaku->id,
                    'nama_item' => $bahanBaku->nama_bahan_baku,
                    'jumlah' => $item['jumlah'],
                    'satuan' => $bahanBaku->satuan_dasar,
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
