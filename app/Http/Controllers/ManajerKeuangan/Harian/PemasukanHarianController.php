<?php

namespace App\Http\Controllers\ManajerKeuangan\Harian;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Keuangan\KeuanganPemasukanHarian;
use App\Models\Keuangan\KeuanganTransaksiPembeli;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class PemasukanHarianController extends Controller
{
    /**
     * Display the main income page.
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        $pemasukan = KeuanganPemasukanHarian::with(['user', 'sumberDana'])
            ->latest()
            ->get();

        return Inertia::render('roles.keuangan.Harian.pemasukan.index', [
            'pemasukan' => $pemasukan,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function create(): Response
    {
        $sumberDanaOptions = \App\Models\Keuangan\SumberDana::all(['id', 'nama_sumber', 'tipe_sumber', 'saldo', 'is_main_account']);
        $mainBankAccount = $sumberDanaOptions->where('is_main_account', true)->first();
        $tunaiAccount = $sumberDanaOptions->where('tipe_sumber', 'Tunai')->first();

        return Inertia::render('roles.keuangan.Harian.pemasukan.create', [
            'sumberDanaOptions' => $sumberDanaOptions,
            'mainBankAccountId' => $mainBankAccount ? $mainBankAccount->id : null,
            'mainBankAccountName' => $mainBankAccount ? $mainBankAccount->nama_sumber : null,
            'tunaiAccountId' => $tunaiAccount ? $tunaiAccount->id : null,
            'tunaiAccountName' => $tunaiAccount ? $tunaiAccount->nama_sumber : null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Keuangan\KeuanganPemasukanHarian  $pemasukan
     * @return \Inertia\Response
     */
    public function edit(KeuanganPemasukanHarian $pemasukan): Response
    {
        $sumberDanaOptions = \App\Models\Keuangan\SumberDana::all(['id', 'nama_sumber', 'tipe_sumber', 'saldo', 'is_main_account']);
        $mainBankAccount = $sumberDanaOptions->where('is_main_account', true)->first();
        $tunaiAccount = $sumberDanaOptions->where('tipe_sumber', 'Tunai')->first();

        return Inertia::render('roles.keuangan.Harian.pemasukan.edit', [
            'pemasukan' => $pemasukan,
            'sumberDanaOptions' => $sumberDanaOptions,
            'mainBankAccountId' => $mainBankAccount ? $mainBankAccount->id : null,
            'mainBankAccountName' => $mainBankAccount ? $mainBankAccount->nama_sumber : null,
            'tunaiAccountId' => $tunaiAccount ? $tunaiAccount->id : null,
            'tunaiAccountName' => $tunaiAccount ? $tunaiAccount->nama_sumber : null,
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
            'description' => 'nullable|string|max:255',
            'amount' => 'required|numeric|min:0',
            'jenis_pemasukan' => [
                'required',
                'string',
                Rule::in(['Pemasukan Operasional (Utama)', 'Pemasukan Non-Operasional (Tambahan)', 'Pemasukan Internal / Koreksi', 'Pemasukan Penjualan Produk']),
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->has('keuangan_transaksi_pembeli_id') && $request->input('keuangan_transaksi_pembeli_id') != null) {
                        if ($value !== 'Pemasukan Penjualan Produk') {
                            $fail('Jenis pemasukan harus "Pemasukan Penjualan Produk" jika transaksi pembeli dipilih.');
                        }
                    } else {
                        if ($value === 'Pemasukan Penjualan Produk') {
                            $fail('Jenis pemasukan "Pemasukan Penjualan Produk" hanya untuk transaksi dari pembeli.');
                        }
                    }
                },
            ],
            'catatan' => 'nullable|string',
            'status' => 'required|string|in:Draft,Final',
            'sumber_dana_id' => 'required|exists:sumber_dana,id',
            'keuangan_transaksi_pembeli_id' => 'nullable|exists:keuangan_transaksi_pembeli,id',
        ]);

        $description = $validated['description'];
        if (isset($validated['keuangan_transaksi_pembeli_id'])) {
            $pembeli = KeuanganTransaksiPembeli::find($validated['keuangan_transaksi_pembeli_id']);
            if ($pembeli) {
                $description = 'Penjualan pesanan: ' . $pembeli->nama_pembeli;
            }
        }

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
            $sumberDana = \App\Models\Keuangan\SumberDana::findOrFail($validated['sumber_dana_id']);
            $dataToStore['saldo_sebelum'] = $sumberDana->saldo;
            $dataToStore['saldo_setelah'] = $sumberDana->saldo + $validated['amount'];
            $sumberDana->increment('saldo', $validated['amount']);
        }

        $pemasukan = \App\Models\Keuangan\KeuanganPemasukanHarian::create($dataToStore);

        return redirect()->route('keuangan.harian.pemasukan.index')->with('message', 'Pemasukan berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Keuangan\KeuanganPemasukanHarian  $pemasukan
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, KeuanganPemasukanHarian $pemasukan): RedirectResponse
    {
        $validated = $request->validate([
            'description' => 'nullable|string|max:255',
            'amount' => 'sometimes|numeric|min:0',
            'jenis_pemasukan' => [
                'sometimes',
                'string',
                Rule::in(['Pemasukan Operasional (Utama)', 'Pemasukan Non-Operasional (Tambahan)', 'Pemasukan Internal / Koreksi', 'Pemasukan Penjualan Produk']),
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->has('keuangan_transaksi_pembeli_id') && $request->input('keuangan_transaksi_pembeli_id') != null) {
                        if ($value !== 'Pemasukan Penjualan Produk') {
                            $fail('Jenis pemasukan harus "Pemasukan Penjualan Produk" jika transaksi pembeli dipilih.');
                        }
                    } else {
                        if ($value === 'Pemasukan Penjualan Produk') {
                            $fail('Jenis pemasukan "Pemasukan Penjualan Produk" hanya untuk transaksi dari pembeli.');
                        }
                    }
                },
            ],
            'catatan' => 'nullable|string',
            'status' => 'sometimes|string|in:Draft,Final',
            'sumber_dana_id' => 'required|exists:sumber_dana,id',
            'keuangan_transaksi_pembeli_id' => 'nullable|exists:keuangan_transaksi_pembeli,id',
        ]);

        // Determine description
        $description = $validated['description'] ?? $pemasukan->description;
        if (isset($validated['keuangan_transaksi_pembeli_id'])) {
            $pembeli = KeuanganTransaksiPembeli::find($validated['keuangan_transaksi_pembeli_id']);
            if ($pembeli) {
                $description = 'Penjualan pesanan: ' . $pembeli->nama_pembeli;
            }
        }
        $validated['description'] = $description;

        // Get old values before update
        $oldStatus = $pemasukan->status;
        $oldAmount = $pemasukan->amount;
        $oldSumberDanaId = $pemasukan->sumber_dana_id;

        $pemasukan->update($validated);

        // Logic to adjust SumberDana saldo based on changes
        $newStatus = $pemasukan->status;
        $newAmount = $pemasukan->amount;
        $newSumberDanaId = $pemasukan->sumber_dana_id;

        // Case 1: Status changed from Final to Draft
        if ($oldStatus === 'Final' && $newStatus === 'Draft') {
            if ($pemasukan->sumberDana) {
                $pemasukan->sumberDana->decrement('saldo', $oldAmount);
            }
        }
        // Case 2: Status changed from Draft to Final
        else if ($oldStatus === 'Draft' && $newStatus === 'Final') {
            if ($pemasukan->sumberDana) {
                $pemasukan->sumberDana->increment('saldo', $newAmount);
            }
        }
        // Case 3: Status remains Final, but amount or sumber_dana_id changed
        else if ($newStatus === 'Final') {
            // If amount changed
            if ($oldAmount !== $newAmount) {
                // Decrement old amount from old sumber dana (if any)
                if ($oldSumberDanaId && $oldSumberDanaId !== $newSumberDanaId) {
                    $oldSumberDana = \App\Models\Keuangan\SumberDana::find($oldSumberDanaId);
                    if ($oldSumberDana) {
                        $oldSumberDana->decrement('saldo', $oldAmount);
                    }
                } else if ($oldSumberDanaId === $newSumberDanaId && $pemasukan->sumberDana) {
                    // If same sumber dana, just adjust the difference
                    $pemasukan->sumberDana->decrement('saldo', $oldAmount);
                }
                // Increment new amount to new sumber dana
                if ($pemasukan->sumberDana) {
                    $pemasukan->sumberDana->increment('saldo', $newAmount);
                }
            }
            // If only sumber_dana_id changed (and amount didn't change or was handled above)
            else if ($oldSumberDanaId !== $newSumberDanaId) {
                // Decrement from old sumber dana
                if ($oldSumberDanaId) {
                    $oldSumberDana = \App\Models\Keuangan\SumberDana::find($oldSumberDanaId);
                    if ($oldSumberDana) {
                        $oldSumberDana->decrement('saldo', $newAmount);
                    }
                }
                // Increment to new sumber dana
                if ($pemasukan->sumberDana) {
                    $pemasukan->sumberDana->increment('saldo', $newAmount);
                }
            }
        }

        // If status is Final, update saldo_sebelum and saldo_setelah for the pemasukan record
        if ($pemasukan->status === 'Final') {
            $currentSumberDana = \App\Models\Keuangan\SumberDana::find($pemasukan->sumber_dana_id);
            if ($currentSumberDana) {
                $pemasukan->saldo_setelah = $currentSumberDana->saldo;
                $pemasukan->saldo_sebelum = $currentSumberDana->saldo - $pemasukan->amount;
                $pemasukan->save();
            }
        } else { // If status is Draft, reset saldo_sebelum and saldo_setelah
            $pemasukan->saldo_sebelum = 0;
            $pemasukan->saldo_setelah = 0;
            $pemasukan->save();
        }

        return redirect()->route('keuangan.harian.pemasukan.index')->with('message', 'Pemasukan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Keuangan\KeuanganPemasukanHarian  $pemasukan
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(KeuanganPemasukanHarian $pemasukan): RedirectResponse
    {
        // If the pemasukan was Final, revert its effect on the SumberDana saldo
        if ($pemasukan->status === 'Final' && $pemasukan->sumberDana) {
            $pemasukan->sumberDana->decrement('saldo', $pemasukan->amount);
        }

        $pemasukan->delete();

        return redirect()->route('keuangan.harian.pemasukan.index')->with('message', 'Pemasukan berhasil dihapus.');
    }
}
