<?php

namespace App\Http\Controllers\Keuangan\KeuanganProduk;

use App\Http\Controllers\Controller;
use App\Models\BahanBaku; // Corrected import
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PersediaanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // 1. Summary Metrics
        // NOTE: These queries are placeholders and assume a simple schema.
        // They will need to be adjusted to your actual database structure.

        // Total value of all stock (stock * standard_price)
        $totalInventoryValue = BahanBaku::sum(DB::raw('stok * harga_standar'));

        // Total quantity of all stock
        $totalQuantityInStock = BahanBaku::sum('stok');

        // COGS for the current month.
        // This is a complex calculation and requires a proper transaction log.
        // This is a simplified placeholder.
        // You would typically sum the cost of goods from a 'transaction_items' table for the current month.
        $cogsCurrentMonth = 0; // Placeholder value

        $summaryMetrics = [
            'totalInventoryValue' => $totalInventoryValue,
            'totalQuantityInStock' => $totalQuantityInStock,
            'cogsCurrentMonth' => $cogsCurrentMonth,
        ];

        // 2. Inventory Trend Data
        // This also requires historical data or snapshots.
        // Returning an empty array as a placeholder.
        $inventoryTrendData = [];

        // 3. Products List with Pagination
        $products = BahanBaku::query()
            ->select('id', 'nama_bahan_baku', 'kategori', 'stok', 'satuan_dasar', 'harga_standar')
            ->when($request->input('search'), function ($query, $search) {
                $query->where('nama_bahan_baku', 'like', "%{$search}%")
                      ->orWhere('kategori', 'like', "%{$search}%");
            })
            ->orderBy('nama_bahan_baku', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('roles/keuangan/keuangan-produk/persediaan/index', [
            'summaryMetrics' => $summaryMetrics,
            'inventoryTrendData' => $inventoryTrendData,
            'products' => $products,
            'filters' => $request->only(['search']),
        ]);
    }
}
