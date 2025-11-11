<?php

namespace App\Http\Controllers\ManajerKeuangan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Keuangan\SumberDana;
use Illuminate\Support\Facades\DB; // Added for transactions

class RekeningBankController extends Controller
{
    public function index()
    {
        try {
            $rekeningBankList = SumberDana::where('tipe_sumber', 'Bank')->get()->map(function ($sd) {
                // Placeholder for isConnected logic, if any will come from the database
                $isConnected = $sd->is_main_account; // Assume connected if it's the main account

                return [
                    'id' => $sd->id,
                    'bankName' => $sd->nama_bank,
                    'accountNumber' => $sd->nomor_rekening,
                    'accountHolderName' => $sd->nama_pemilik_rekening,
                    'isConnected' => $isConnected,
                    'balance' => (float) $sd->saldo,
                    'sumberDanaId' => $sd->id, // Pass original sumber_dana ID for actions
                    'isMainAccount' => (bool) $sd->is_main_account, // Pass main account status
                ];
            });

            return Inertia::render('roles/keuangan/Harian/sumber-dana/rekening-bank/index', [
                'sumberDanaUrl' => route('keuangan.harian.sumber-dana'),
                'rekeningBank' => $rekeningBankList,
            ]);
        } catch (\Exception $e) {
            // Log the error for debugging
            // Redirect with an error message or render an error page
            return redirect()->back()->with('error', 'Gagal memuat data rekening bank. Silakan coba lagi.');
        }
    }

    public function create()
    {
        return Inertia::render('roles/keuangan/Harian/sumber-dana/rekening-bank/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_sumber' => 'required|string|max:255|unique:sumber_dana,nama_sumber',
            'nomor_rekening' => 'required|string|max:255|unique:sumber_dana,nomor_rekening',
            'nama_bank' => 'required|string|max:255',
            'nama_pemilik_rekening' => 'required|string|max:255',
        ]);

        // Create new SumberDana entry
        SumberDana::create([
            'nama_sumber' => $validated['nama_sumber'],
            'tipe_sumber' => 'Bank', // Always 'Bank' for this controller
            'nomor_rekening' => $validated['nomor_rekening'],
            'nama_bank' => $validated['nama_bank'],
            'nama_pemilik_rekening' => $validated['nama_pemilik_rekening'],
            'saldo' => 0, // Set to 0 as it will be connected automatically
            'is_main_account' => false, // New accounts are not main by default
        ]);

        return redirect()->route('keuangan.harian.rekening-bank.index')
            ->with('success', 'Rekening bank berhasil ditambahkan.');
    }

    public function setMainAccount(SumberDana $sumberDana)
    {
        // Ensure the selected sumberDana is a 'Bank' type
        if ($sumberDana->tipe_sumber !== 'Bank') {
            return redirect()->back()->with('error', 'Sumber dana yang dipilih bukan rekening bank.');
        }

        DB::transaction(function () use ($sumberDana) {
            // Set all other bank accounts to not main
            SumberDana::where('tipe_sumber', 'Bank')
                ->where('id', '!=', $sumberDana->id)
                ->update(['is_main_account' => false]);

            // Set the selected bank account as main
            $sumberDana->is_main_account = true;
            // Simulate a random balance for the main account
            $sumberDana->saldo = rand(1000000, 10000000); // Random balance between 1M and 10M
            $sumberDana->save();
        });

        return redirect()->back()->with('success', 'Rekening bank berhasil dijadikan utama dan saldo disimulasikan.');
    }

    public function edit($id)
    {
        // Logic to fetch the bank account for editing
        $rekeningBank = [
            'id' => $id,
            'bankName' => 'BCA',
            'accountNumber' => '12345',
            'accountHolderName' => 'Test',
            'isConnected' => true,
            'balance' => 100000000
        ]; // Placeholder
        return Inertia::render('roles/keuangan/Harian/sumber-dana/rekening-bank/edit', [
            'rekeningBank' => $rekeningBank
        ]);
    }

    public function update(Request $request, $id)
    {
        // Logic to update the bank account
        return redirect()->route('keuangan.harian.rekening-bank.index');
    }

    public function destroy($id)
    {
        // Logic to delete the bank account
        return redirect()->route('keuangan.harian.rekening-bank.index');
    }
}
