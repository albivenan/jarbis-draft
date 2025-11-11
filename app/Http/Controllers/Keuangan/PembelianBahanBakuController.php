<?php

namespace App\Http\Controllers\Keuangan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\User;
use App\Models\SumberDana;
use App\Models\Keuangan\KeuanganPengeluaranHarian;
use App\Models\Keuangan\Pemasok;
use App\Models\Keuangan\BahanBaku;
use App\Models\Keuangan\PembelianBahanBaku;
use App\Models\Keuangan\PembelianBahanBakuItem;

class PembelianBahanBakuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pembelianBahanBaku = PembelianBahanBaku::with([
            'dibuatOleh:id,name',
            'disetujuiOleh:id,name',
            'sumberDana:id,nama_sumber,saldo',
            'items.bahanBaku:id,nama_bahan_baku',
        ])->latest()->paginate(10);

        $sumberDanas = SumberDana::where('tipe_sumber', 'Tunai')->orWhere('is_main_account', true)->get(['id', 'nama_sumber as name', 'saldo']); // Fetch only Tunai and main bank account

        return Inertia::render('roles/keuangan/keuangan-produk/pembelian/index', [
            'pembelianBahanBaku' => $pembelianBahanBaku,
            'sumberDanas' => $sumberDanas, // Pass sumberDanas to the frontend
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $pemasok = Pemasok::all(['id', 'nama_pemasok']);
        $bahanBaku = BahanBaku::all(['id', 'nama_bahan_baku', 'satuan_dasar', 'harga_standar']);
        $sumberDana = SumberDana::all(['id', 'nama_sumber']);
        $users = User::all(['id', 'name']); // For 'dibuat_oleh' and 'disetujui_oleh' selection

        return Inertia::render('Keuangan/PembelianBahanBaku/Create', [
            'pemasok' => $pemasok,
            'bahanBaku' => $bahanBaku,
            'sumberDana' => $sumberDana,
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nomor_batch' => 'required|string|max:255|unique:pembelian_bahan_baku,nomor_batch',
            'waktu_batch' => 'required|date', // Changed from tanggal_batch
            'status_batch' => 'required|in:Pending,Diajukan,Disetujui,Ditolak',
            'metode_pembayaran' => 'nullable|in:Tunai,Transfer,Rekening Bank',
            'status_pembayaran' => 'required|in:Belum Dibayar,Sudah Dibayar,Pembayaran Ditolak',
            'total_harga_batch' => 'required|numeric|min:0',
            'catatan' => 'nullable|string',
            'dibuat_oleh_id' => 'required|exists:users,id',
            'disetujui_oleh_id' => 'nullable|exists:users,id',
            'tanggal_disetujui' => 'nullable|date',
            'sumber_dana_id' => 'nullable|exists:sumber_dana,id',
            'items' => 'required|array|min:1',
            'items.*.bahan_baku_id' => 'required|exists:bahan_baku,id',
            'items.*.nama_item' => 'required|string|max:255',
            'items.*.jumlah' => 'required|numeric|min:0.01',
            'items.*.satuan' => 'required|string|max:255',
            'items.*.harga_satuan' => 'required|numeric|min:0',
            'items.*.total_harga_item' => 'required|numeric|min:0',
            'items.*.status_item' => 'required|in:Pending,Diterima,Ditolak,Diterima & Dibayar',
            'items.*.catatan_item' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $pembelianBahanBaku = PembelianBahanBaku::create($request->except('items'));

            foreach ($request->input('items') as $itemData) {
                $pembelianBahanBaku->items()->create($itemData);
            }

            // If batch is approved and paid, create a KeuanganPengeluaranHarian entry
            if ($pembelianBahanBaku->status_batch === 'Disetujui' && $pembelianBahanBaku->status_pembayaran === 'Sudah Dibayar') {
                $sumberDana = SumberDana::find($pembelianBahanBaku->sumber_dana_id);
                if (!$sumberDana) {
                    throw new \Exception('Sumber Dana tidak ditemukan untuk pembuatan batch baru.');
                }

                $totalHargaBatch = $pembelianBahanBaku->total_harga_batch;

                if ($sumberDana->saldo < $totalHargaBatch) {
                    throw new \Exception('Saldo Sumber Dana tidak mencukupi untuk pembuatan batch baru.');
                }

                // Calculate balances
                $saldoSebelum = $sumberDana->saldo;
                $saldoSetelah = $saldoSebelum - $totalHargaBatch;

                // Deduct balance
                $sumberDana->saldo = $saldoSetelah;
                $sumberDana->save();

                KeuanganPengeluaranHarian::create([
                    'waktu' => now(), // Or $pembelianBahanBaku->tanggal_disetujui
                    'description' => 'pembayaran (' . $pembelianBahanBaku->nomor_batch . ')',
                    'user_id' => $pembelianBahanBaku->dibuat_oleh_id, // Or a dedicated finance user
                    'jenis_pengeluaran' => 'Pembelian Bahan Baku', // Changed from 'Perusahaan'
                    'amount' => $totalHargaBatch,
                    'status' => 'Final', // Automatically approved if linked to a paid batch
                    'sumber_dana_id' => $pembelianBahanBaku->sumber_dana_id,
                    'pembelian_bahan_baku_id' => $pembelianBahanBaku->id,
                    'saldo_sebelum' => $saldoSebelum,
                    'saldo_setelah' => $saldoSetelah,
                ]);
            }

            DB::commit();
            return redirect()->route('manajer-keuangan.keuangan-produk.pembelian-bahan-baku.index')->with('success', 'Batch Pembelian Bahan Baku berhasil disimpan.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing Pembelian Bahan Baku: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal menyimpan Batch Pembelian Bahan Baku: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PembelianBahanBaku $pembelianBahanBaku)
    {
        $pembelianBahanBaku->load([
            'dibuatOleh:id,name',
            'disetujuiOleh:id,name',
            'sumberDana:id,nama_sumber',
            'items.bahanBaku:id,nama_bahan_baku,satuan_dasar',
            'pengeluaranHarian',
        ]);

        return Inertia::render('Keuangan/PembelianBahanBaku/Show', [
            'pembelianBahanBaku' => $pembelianBahanBaku,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PembelianBahanBaku $pembelianBahanBaku)
    {
        $pembelianBahanBaku->load([
            'items.bahanBaku:id,nama_bahan_baku,satuan_dasar,harga_standar',
        ]);

        $pemasok = Pemasok::all(['id', 'nama_pemasok']);
        $bahanBaku = BahanBaku::all(['id', 'nama_bahan_baku', 'satuan_dasar', 'harga_standar']);
        $sumberDana = SumberDana::all(['id', 'nama_sumber']);
        $users = User::all(['id', 'name']);

        return Inertia::render('Keuangan/PembelianBahanBaku/Edit', [
            'pembelianBahanBaku' => $pembelianBahanBaku,
            'pemasok' => $pemasok,
            'bahanBaku' => $bahanBaku,
            'sumberDana' => $sumberDana,
            'users' => $users,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PembelianBahanBaku $pembelianBahanBaku)
    {
        $request->validate([
            'nomor_batch' => 'required|string|max:255|unique:pembelian_bahan_baku,nomor_batch,' . $pembelianBahanBaku->id,
            'waktu_batch' => 'required|date', // Changed from tanggal_batch
            'status_batch' => 'required|in:Pending,Diajukan,Disetujui,Ditolak',
            'metode_pembayaran' => 'nullable|in:Tunai,Transfer,Rekening Bank',
            'status_pembayaran' => 'required|in:Belum Dibayar,Sudah Dibayar,Pembayaran Ditolak',
            'total_harga_batch' => 'required|numeric|min:0',
            'catatan' => 'nullable|string',
            'dibuat_oleh_id' => 'required|exists:users,id',
            'disetujui_oleh_id' => 'nullable|exists:users,id',
            'tanggal_disetujui' => 'nullable|date',
            'sumber_dana_id' => 'nullable|exists:sumber_dana,id',
            'items' => 'required|array|min:1',
            'items.*.id' => 'nullable|exists:pembelian_bahan_baku_item,id', // For existing items
            'items.*.bahan_baku_id' => 'required|exists:bahan_baku,id',
            'items.*.nama_item' => 'required|string|max:255',
            'items.*.jumlah' => 'required|numeric|min:0.01',
            'items.*.satuan' => 'required|string|max:255',
            'items.*.harga_satuan' => 'required|numeric|min:0',
            'items.*.total_harga_item' => 'required|numeric|min:0',
            'items.*.status_item' => 'required|in:Pending,Diterima,Ditolak,Diterima & Dibayar',
            'items.*.catatan_item' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $pembelianBahanBaku->update($request->except('items'));

            $existingItemIds = $pembelianBahanBaku->items->pluck('id')->toArray();
            $updatedItemIds = [];

            foreach ($request->input('items') as $itemData) {
                if (isset($itemData['id'])) {
                    // Update existing item
                    $pembelianBahanBaku->items()->where('id', $itemData['id'])->update($itemData);
                    $updatedItemIds[] = $itemData['id'];
                } else {
                    // Create new item
                    $newItem = $pembelianBahanBaku->items()->create($itemData);
                    $updatedItemIds[] = $newItem->id;
                }
            }

            // Delete items that were removed from the request
            $itemsToDelete = array_diff($existingItemIds, $updatedItemIds);
            PembelianBahanBakuItem::whereIn('id', $itemsToDelete)->delete();

            // Handle PengeluaranHarian update/creation and Saldo deduction
            if ($request->input('status_batch') === 'Disetujui' && $request->input('status_pembayaran') === 'Sudah Dibayar') {
                $sumberDana = SumberDana::find($request->input('sumber_dana_id'));
                if (!$sumberDana) {
                    throw new \Exception('Sumber Dana tidak ditemukan.');
                }

                $totalHargaBatch = $request->input('total_harga_batch');

                // Check if there was a previous KeuanganPengeluaranHarian for this batch
                $previousPengeluaran = KeuanganPengeluaranHarian::where('pembelian_bahan_baku_id', $pembelianBahanBaku->id)->first();

                // If status changes from paid to paid, and source of fund changes, or amount changes,
                // we need to revert the old deduction and apply new one.
                if ($previousPengeluaran && $previousPengeluaran->sumber_dana_id !== $sumberDana->id) {
                    // Revert old deduction
                    $oldSumberDana = SumberDana::find($previousPengeluaran->sumber_dana_id);
                    if ($oldSumberDana) {
                        $oldSumberDana->saldo += $previousPengeluaran->jumlah;
                        $oldSumberDana->save();
                    }
                }

                // Check for sufficient balance before deducting
                if ($sumberDana->saldo < $totalHargaBatch && !$previousPengeluaran) { // Only check if it's a new expense
                    throw new \Exception('Saldo Sumber Dana tidak mencukupi.');
                }

                // Calculate balances BEFORE deduction
                $saldoSebelum = $sumberDana->saldo;
                // If there was a previous expense from a different fund, we need to adjust the starting balance
                if ($previousPengeluaran && $previousPengeluaran->sumber_dana_id !== $sumberDana->id) {
                    $saldoSebelum = $sumberDana->saldo; // The starting balance of the new fund is its current balance
                }
                $saldoSetelah = $saldoSebelum - $totalHargaBatch;


                // Deduct balance
                $sumberDana->saldo = $saldoSetelah;
                $sumberDana->save();

                if ($previousPengeluaran) {
                    // Update existing KeuanganPengeluaranHarian
                    $previousPengeluaran->update([
                        'waktu' => now(),
                        'description' => 'pembayaran (' . $pembelianBahanBaku->nomor_batch . ')',
                        'user_id' => $request->input('dibuat_oleh_id'),
                        'jenis_pengeluaran' => 'Pembelian Bahan Baku', // Changed from 'Perusahaan'
                        'amount' => $totalHargaBatch,
                        'sumber_dana_id' => $sumberDana->id,
                        'pembelian_bahan_baku_id' => $pembelianBahanBaku->id, // Ensure this is updated too
                        'saldo_sebelum' => $saldoSebelum,
                        'saldo_setelah' => $saldoSetelah,
                        'status' => 'Final', // Ensure status is Final
                    ]);
                } else {
                    // Create new KeuanganPengeluaranHarian
                    KeuanganPengeluaranHarian::create([
                        'waktu' => now(),
                        'description' => 'pembayaran (' . $pembelianBahanBaku->nomor_batch . ')',
                        'user_id' => $request->input('dibuat_oleh_id'),
                        'jenis_pengeluaran' => 'Pembelian Bahan Baku', // Changed from 'Perusahaan'
                        'amount' => $totalHargaBatch,
                        'status' => 'Final',
                        'sumber_dana_id' => $sumberDana->id,
                        'pembelian_bahan_baku_id' => $pembelianBahanBaku->id,
                        'saldo_sebelum' => $saldoSebelum,
                        'saldo_setelah' => $saldoSetelah,
                    ]);
                }
            } else {
                // If batch is no longer approved/paid, or was never approved/paid,
                // check if there was a previous KeuanganPengeluaranHarian and revert saldo
                $previousPengeluaran = KeuanganPengeluaranHarian::where('pembelian_bahan_baku_id', $pembelianBahanBaku->id)->first();
                if ($previousPengeluaran) {
                    $sumberDana = SumberDana::find($previousPengeluaran->sumber_dana_id);
                    if ($sumberDana) {
                        $sumberDana->saldo += $previousPengeluaran->jumlah;
                        $sumberDana->save();
                    }
                    $previousPengeluaran->delete();
                }
            }

            DB::commit();
            return redirect()->route('manajer-keuangan.keuangan-produk.pembelian-bahan-baku.index')->with('success', 'Batch Pembelian Bahan Baku berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating Pembelian Bahan Baku: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal memperbarui Batch Pembelian Bahan Baku: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PembelianBahanBaku $pembelianBahanBaku)
    {
        DB::beginTransaction();
        try {
            // Delete associated KeuanganPengeluaranHarian first if any
            KeuanganPengeluaranHarian::where('pembelian_bahan_baku_id', $pembelianBahanBaku->id)->delete();

            $pembelianBahanBaku->delete(); // Items will be cascade deleted

            DB::commit();
            return redirect()->route('manajer-keuangan.keuangan-produk.pembelian-bahan-baku.index')->with('success', 'Batch Pembelian Bahan Baku berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting Pembelian Bahan Baku: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal menghapus Batch Pembelian Bahan Baku: ' . $e->getMessage());
        }
    }

    /**
     * Update the status of a single purchase item.
     */
    public function updateItemStatus(Request $request, PembelianBahanBakuItem $item)
    {
        $request->validate([
            'status_item' => 'required|in:Diterima,Ditolak,Pending',
        ]);

        try {
            $item->update(['status_item' => $request->status_item]);

            // Recalculate batch total price based on 'Diterima' items
            $batch = $item->pembelianBahanBaku;
            $newTotal = $batch->items()->where('status_item', 'Diterima')->sum('total_harga_item');
            $batch->update(['total_harga_batch' => $newTotal]);

            return redirect()->back()->with('success', 'Status item berhasil diperbarui.');
        } catch (\Exception $e) {
            Log::error('Error updating item status: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal memperbarui status item: ' . $e->getMessage());
        }
    }

    /**
     * Update the status of an entire purchase batch.
     */
    public function updateBatchStatus(Request $request, PembelianBahanBaku $batch)
    {
        $request->validate([
            'status_batch' => 'required|in:Diajukan,Ditolak,Pending',
        ]);

        try {
            $updateData = ['status_batch' => $request->status_batch];
            if ($request->status_batch === 'Diajukan') {
                $updateData['diajukan_pada'] = now();
            } elseif ($request->status_batch === 'Ditolak') {
                $updateData['direspon_pada'] = now();
            }
            $batch->update($updateData);

            // If batch is rejected, reject all pending items
            if ($request->status_batch === 'Ditolak') {
                $batch->items()->where('status_item', 'Pending')->update(['status_item' => 'Ditolak']);
            }

            return redirect()->back()->with('success', 'Status batch berhasil diperbarui.');
        } catch (\Exception $e) {
            Log::error('Error updating batch status: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal memperbarui status batch: ' . $e->getMessage());
        }
    }

    /**
     * Process the payment for an approved purchase batch.
     */
    public function processPayment(Request $request, PembelianBahanBaku $batch)
    {
        $request->validate([
            'sumber_dana_id' => 'required|exists:sumber_dana,id',
        ]);

        DB::beginTransaction();
        try {
            // 1. Check if the batch is in the correct state
            if ($batch->status_batch !== 'Diajukan') {
                throw new \Exception('Hanya batch yang sudah diajukan yang bisa diproses pembayarannya.');
            }

            // 2. Check if there are any accepted items
            $totalHargaBatch = $batch->items()->where('status_item', 'Diterima')->sum('total_harga_item');
            if ($totalHargaBatch <= 0) {
                throw new \Exception('Tidak ada item yang disetujui untuk dibayar.');
            }

            // 3. Update batch total price just in case
            $batch->total_harga_batch = $totalHargaBatch;

            // 4. Check source of funds
            $sumberDana = SumberDana::findOrFail($request->sumber_dana_id);
            if ($sumberDana->saldo < $totalHargaBatch) {
                throw new \Exception('Saldo sumber dana tidak mencukupi.');
            }

            // 5. Update batch status
            $batch->status_batch = 'Disetujui';
            $batch->status_pembayaran = 'Sudah Dibayar';
            $batch->sumber_dana_id = $request->sumber_dana_id;
            $batch->disetujui_oleh_id = auth()->id();
            $batch->tanggal_disetujui = now();
            $batch->dibayar_pada = now(); // Set dibayar_pada
            $batch->direspon_pada = now(); // Set direspon_pada as this is the final response
            $batch->save();

            // 6. Update status of accepted items
            $batch->items()->where('status_item', 'Diterima')->update(['status_item' => 'Diterima & Dibayar']);

            // 7. Deduct balance and create expense record
            $saldoSebelum = $sumberDana->saldo;
            $sumberDana->saldo -= $totalHargaBatch;
            $sumberDana->save();
            $saldoSetelah = $sumberDana->saldo;

            KeuanganPengeluaranHarian::create([
                'waktu' => now(),
                'description' => 'Pembayaran Pembelian Bahan Baku (' . $batch->nomor_batch . ')',
                'user_id' => auth()->id(),
                'jenis_pengeluaran' => 'Pembelian Bahan Baku',
                'amount' => $totalHargaBatch,
                'status' => 'Final',
                'sumber_dana_id' => (int) $sumberDana->id,
                'pembelian_bahan_baku_id' => $batch->id,
                'saldo_sebelum' => $saldoSebelum,
                'saldo_setelah' => $saldoSetelah,
            ]);

            DB::commit();
            return redirect()->back()->with('success', 'Pembayaran berhasil diproses.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error processing payment: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal memproses pembayaran: ' . $e->getMessage());
        }
    }
}
