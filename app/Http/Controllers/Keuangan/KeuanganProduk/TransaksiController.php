<?php

namespace App\Http\Controllers\Keuangan\KeuanganProduk;

use App\Http\Controllers\Controller;
use App\Models\Keuangan\KeuanganPemasukanHarian;
use App\Models\Keuangan\KeuanganTransaksiPembeli;
use App\Models\SumberDana;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransaksiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $selectedDate = $request->input('selectedDate');

        $query = KeuanganPemasukanHarian::with(['pembeli', 'sumberDana'])
            ->whereNotNull('keuangan_transaksi_pembeli_id') // Filter out entries without a linked buyer
            ->orderBy('waktu', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', '%' . $search . '%')
                    ->orWhere('jenis_pemasukan', 'like', '%' . $search . '%')
                    ->orWhere('status', 'like', '%' . $search . '%')
                    ->orWhereHas('pembeli', function ($qPembeli) use ($search) {
                        $qPembeli->where('nama_pembeli', 'like', '%' . $search . '%')
                            ->orWhere('email_pembeli', 'like', '%' . $search . '%')
                            ->orWhere('telepon_pembeli', 'like', '%' . $search . '%');
                    });
            });
        }

        if ($selectedDate) {
            $query->whereDate('waktu', $selectedDate);
        }

        $pemasukanHarian = $query->paginate(10); // Adjust pagination as needed

        $sumberDanas = SumberDana::all(['id', 'nama_sumber', 'saldo']);

        return Inertia::render('roles/keuangan/keuangan-produk/transaksi/index', [
            'pemasukanHarian' => $pemasukanHarian,
            'sumberDanas' => $sumberDanas,
            'filters' => [
                'search' => $search,
                'selectedDate' => $selectedDate,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
