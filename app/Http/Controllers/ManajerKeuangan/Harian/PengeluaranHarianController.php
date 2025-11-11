<?php

namespace App\Http\Controllers\ManajerKeuangan\Harian;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Keuangan\KeuanganPengeluaranHarian;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Keuangan\SumberDana;

class PengeluaranHarianController extends Controller
{
    /**
     * Display the main expense page.
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        $pengeluaran = KeuanganPengeluaranHarian::with(['user', 'sumberDana'])
            ->latest()
            ->get();

        return Inertia::render('roles.Keuangan.Harian.pengeluaran.index', [
            'pengeluaran' => $pengeluaran,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function create(): Response
    {
        $sumberDanaOptions = SumberDana::all()->map(function ($sumber) {
            return [
                'id' => $sumber->id,
                'nama_sumber' => $sumber->nama_sumber,
                'tipe_sumber' => $sumber->tipe_sumber,
                'saldo' => $sumber->saldo,
                'is_main_account' => (bool)$sumber->is_main_account,
            ];
        });

        $mainBankAccountId = $sumberDanaOptions->firstWhere('tipe_sumber', 'Bank')['id'] ?? null;
        $tunaiAccountId = $sumberDanaOptions->firstWhere('tipe_sumber', 'Tunai')['id'] ?? null;

        return Inertia::render('roles.Keuangan.Harian.pengeluaran.create', [
            'sumberDanaOptions' => $sumberDanaOptions,
            'mainBankAccountId' => $mainBankAccountId,
            'tunaiAccountId' => $tunaiAccountId,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Keuangan\KeuanganPengeluaranHarian  $pengeluaran
     * @return \Inertia\Response
     */
    public function edit(KeuanganPengeluaranHarian $pengeluaran): Response
    {
        return Inertia::render('roles.Keuangan.Harian.pengeluaran.edit', [
            'pengeluaran' => $pengeluaran,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'jenis_pengeluaran' => 'required|string|in:Pengeluaran Operasional (Utama),Pengeluaran Non-Operasional (Tambahan),Pengeluaran Internal / Koreksi,Pembelian Bahan Baku',
            'catatan' => 'nullable|string',
            'status' => 'required|string|in:Draft,Final',
            'sumber_dana_id' => 'required|exists:sumber_dana,id',
        ]);

        DB::transaction(function () use ($validated) {
            $dataToStore = array_merge($validated, [
                'user_id' => Auth::user()->id,
                'waktu' => now(),
                'invoice_path' => 'https://example.com/fake-invoice-' . uniqid() . '.pdf',
            ]);

            // Initialize saldo_sebelum and saldo_setelah
            $dataToStore['saldo_sebelum'] = 0;
            $dataToStore['saldo_setelah'] = 0;

            // Only update saldo and set saldo_sebelum/saldo_setelah if status is Final
            if ($validated['status'] === 'Final') {
                $sumberDana = SumberDana::findOrFail($validated['sumber_dana_id']);

                // Ensure there's enough balance for the expenditure
                if ($sumberDana->saldo < $validated['amount']) {
                    throw new \Exception('Saldo sumber dana tidak mencukupi.');
                }

                $dataToStore['saldo_sebelum'] = $sumberDana->saldo;
                $dataToStore['saldo_setelah'] = $sumberDana->saldo - $validated['amount'];
                $sumberDana->decrement('saldo', $validated['amount']);
            }

            \App\Models\Keuangan\KeuanganPengeluaranHarian::create($dataToStore);
        });

        return redirect()->route('manajer-keuangan.harian.pengeluaran.index')->with('message', 'Pengeluaran berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Keuangan\KeuanganPengeluaranHarian  $pengeluaran
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, KeuanganPengeluaranHarian $pengeluaran): RedirectResponse
    {
        $validated = $request->validate([
            'description' => 'sometimes|string|max:255',
            'amount' => 'sometimes|numeric|min:0',
            'jenis_pengeluaran' => 'sometimes|string|in:Pengeluaran Operasional (Utama),Pengeluaran Non-Operasional (Tambahan),Pengeluaran Internal / Koreksi,Pembelian Bahan Baku',
            'catatan' => 'nullable|string',
            'status' => 'sometimes|string|in:Draft,Final',
            'sumber_dana_id' => 'required|exists:sumber_dana,id',
        ]);

        // Get old values before update
        $oldStatus = $pengeluaran->status;
        $oldAmount = $pengeluaran->amount;
        $oldSumberDanaId = $pengeluaran->sumber_dana_id;

        $pengeluaran->update($validated);

        // Logic to adjust SumberDana saldo based on changes
        $newStatus = $pengeluaran->status;
        $newAmount = $pengeluaran->amount;
        $newSumberDanaId = $pengeluaran->sumber_dana_id;

        // Revert old transaction effect if status was Final
        if ($oldStatus === 'Final') {
            $oldSumberDana = SumberDana::find($oldSumberDanaId);
            if ($oldSumberDana) {
                $oldSumberDana->increment('saldo', $oldAmount);
            }
        }

        // Apply new transaction effect if new status is Final
        if ($newStatus === 'Final') {
            $newSumberDana = SumberDana::find($newSumberDanaId);
            if ($newSumberDana) {
                // Ensure enough balance for the new amount
                if ($newSumberDana->saldo < $newAmount) {
                    // This scenario should ideally be prevented on the frontend or handled more gracefully
                    // For now, we'll throw an exception or log an error.
                    // Alternatively, you might revert the update or set status to Draft.
                    throw new \Exception('Saldo sumber dana tidak mencukupi untuk pengeluaran yang diperbarui.');
                }
                $newSumberDana->decrement('saldo', $newAmount);
            }
        }

        // If status is Final, update saldo_sebelum and saldo_setelah for the pengeluaran record
        if ($pengeluaran->status === 'Final') {
            $currentSumberDana = SumberDana::find($pengeluaran->sumber_dana_id);
            if ($currentSumberDana) {
                $pengeluaran->saldo_setelah = $currentSumberDana->saldo;
                $pengeluaran->saldo_sebelum = $currentSumberDana->saldo + $newAmount;
                $pengeluaran->save();
            }
        } else { // If status is Draft, reset saldo_sebelum and saldo_setelah
            $pengeluaran->saldo_sebelum = 0;
            $pengeluaran->saldo_setelah = 0;
            $pengeluaran->save();
        }

        return redirect()->route('manajer-keuangan.harian.pengeluaran.index')->with('message', 'Pengeluaran berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Keuangan\KeuanganPengeluaranHarian  $pengeluaran
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(KeuanganPengeluaranHarian $pengeluaran): RedirectResponse
    {
        // If the pengeluaran was Final, revert its effect on the SumberDana saldo
        if ($pengeluaran->status === 'Final' && $pengeluaran->sumberDana) {
            $pengeluaran->sumberDana->increment('saldo', $pengeluaran->amount);
        }

        $pengeluaran->delete();

        return redirect()->route('manajer-keuangan.harian.pengeluaran.index')->with('message', 'Pengeluaran berhasil dihapus.');
    }
}