<?php

namespace App\Http\Controllers\ManajerKeuangan\Penjualan;

use App\Http\Controllers\Controller;
use App\Models\InformasiPelanggan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User; // Assuming User model exists for sales_rep_id

class InformasiPelangganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('perPage', 10);

        $query = InformasiPelanggan::query();

        if ($search) {
            $query->where('nama_perusahaan', 'like', '%' . $search . '%')
                  ->orWhere('kontak_person_nama', 'like', '%' . $search . '%');
        }

        $customers = $query->paginate($perPage)->through(function ($customer) {
            // Manual transformation to match frontend expectations
            return [
                'id' => 'CUST-' . str_pad($customer->id, 3, '0', STR_PAD_LEFT),
                'name' => $customer->nama_perusahaan,
                'contact_person' => $customer->kontak_person_nama,
                'email' => $customer->email_utama,
                'phone' => $customer->telepon_utama, // Using telepon_utama for now
                'status' => ucfirst($customer->status), // 'aktif' -> 'Aktif'
                'total_revenue' => 0, // Placeholder, as real calculation is not implemented yet
                'join_date' => $customer->created_at ? $customer->created_at->format('Y-m-d') : null,
            ];
        });

        // Dummy KPI Data (will need real calculation later)
        $kpiData = [
            'total_customers' => InformasiPelanggan::count(),
            'new_this_month' => InformasiPelanggan::whereMonth('created_at', now()->month)->count(),
            'total_revenue' => 2345000000, // Placeholder
        ];

        return Inertia::render('roles/keuangan/Penjualan/pelanggan/index', [
            'customers' => $customers,
            'kpiData' => $kpiData,
            'filters' => [
                'search' => $search,
                'perPage' => $perPage,
            ],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(InformasiPelanggan $pelanggan)
    {
        // Manual transformation for detail page
        $customerDetails = [
            'id' => 'CUST-' . str_pad($pelanggan->id, 3, '0', STR_PAD_LEFT),
            'name' => $pelanggan->nama_perusahaan,
            'status' => ucfirst($pelanggan->status),
            'join_date' => $pelanggan->created_at ? $pelanggan->created_at->format('Y-m-d') : null,
            'contact_person' => [
                'name' => $pelanggan->kontak_person_nama,
                'title' => $pelanggan->kontak_person_jabatan,
                'email' => $pelanggan->email_utama,
                'phone' => $pelanggan->kontak_person_hp,
            ],
            'financial_info' => [
                'npwp' => $pelanggan->npwp,
                'payment_term' => $pelanggan->term_pembayaran . ' Hari',
                'sales_rep' => $pelanggan->salesRep ? $pelanggan->salesRep->name : 'N/A',
            ],
            'address' => [
                'street' => $pelanggan->alamat_utama_jalan,
                'city' => $pelanggan->alamat_utama_kota,
                'province' => $pelanggan->alamat_utama_provinsi,
                'zip' => $pelanggan->kode_pos_utama,
            ],
            'daftar_alamat_pengiriman' => $pelanggan->daftar_alamat_pengiriman, // JSON array
        ];

        $customerKpis = [
            'total_revenue' => 0,
            'outstanding_debt' => 0,
            'credit_limit' => $pelanggan->batas_kredit,
        ];

        $transactionHistory = [];

        return Inertia::render('roles/keuangan/Penjualan/pelanggan/show', [
            'customerDetails' => $customerDetails,
            'customerKpis' => $customerKpis,
            'transactionHistory' => $transactionHistory,
        ]);
    }

}
