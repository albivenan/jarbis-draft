<?php

namespace App\Http\Controllers\Keuangan\Harian;

use App\Http\Controllers\Controller;
use App\Models\Keuangan\SumberDana; // Corrected
use App\Models\Keuangan\KeuanganPemasukanHarian;
use App\Models\Keuangan\KeuanganPengeluaranHarian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SumberDanaController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $sumberDana = SumberDana::where('tipe_sumber', 'Tunai')->orWhere('is_main_account', true)->get();
        $allTransactions = [];

        $grandTotalPemasukan = 0;
        $grandTotalPengeluaran = 0;

        // Calculate yesterday's date range
        $yesterday = Carbon::yesterday();
        $yesterdayStartDate = $yesterday->copy()->startOfDay();
        $yesterdayEndDate = $yesterday->copy()->endOfDay();

        $sumberDanaWithTotals = $sumberDana->map(function ($sd) use ($startDate, $endDate, $yesterdayStartDate, $yesterdayEndDate, &$grandTotalPemasukan, &$grandTotalPengeluaran) {
            // Current period totals
            $pemasukan = KeuanganPemasukanHarian::where('sumber_dana_id', $sd->id)
                ->where('status', 'Final')
                ->when($startDate, fn ($query) => $query->whereDate('waktu', '>=', $startDate))
                ->when($endDate, fn ($query) => $query->whereDate('waktu', '<=', $endDate))
                ->get();

            $pengeluaran = KeuanganPengeluaranHarian::where('sumber_dana_id', $sd->id)
                ->where('status', 'Final')
                ->when($startDate, fn ($query) => $query->whereDate('waktu', '>=', $startDate))
                ->when($endDate, fn ($query) => $query->whereDate('waktu', '<=', $endDate))
                ->get();

            $totalPemasukanSd = (float) $pemasukan->sum('amount');
            $totalPengeluaranSd = (float) $pengeluaran->sum('amount');

            // Yesterday's totals
            $pemasukanYesterday = KeuanganPemasukanHarian::where('sumber_dana_id', $sd->id)
                ->where('status', 'Final')
                ->whereDate('waktu', '>=', $yesterdayStartDate)
                ->whereDate('waktu', '<=', $yesterdayEndDate)
                ->get();

            $pengeluaranYesterday = KeuanganPengeluaranHarian::where('sumber_dana_id', $sd->id)
                ->where('status', 'Final')
                ->whereDate('waktu', '>=', $yesterdayStartDate)
                ->whereDate('waktu', '<=', $yesterdayEndDate)
                ->get();

            $totalPemasukanYesterdaySd = (float) $pemasukanYesterday->sum('amount');
            $totalPengeluaranYesterdaySd = (float) $pengeluaranYesterday->sum('amount');

            $grandTotalPemasukan += $totalPemasukanSd;
            $grandTotalPengeluaran += $totalPengeluaranSd;

            return array_merge($sd->toArray(), [
                'totalPemasukan' => $totalPemasukanSd,
                'totalPengeluaran' => $totalPengeluaranSd,
                'totalPemasukanYesterday' => $totalPemasukanYesterdaySd,
                'totalPengeluaranYesterday' => $totalPengeluaranYesterdaySd,
                'pemasukanTransactions' => $pemasukan,
                'pengeluaranTransactions' => $pengeluaran,
            ]);
        });

        $formattedSumberDana = $sumberDanaWithTotals->map(function ($sdData) use ($grandTotalPemasukan, $grandTotalPengeluaran) {
            $percentagePemasukan = $grandTotalPemasukan > 0 ? ($sdData['totalPemasukan'] / $grandTotalPemasukan) * 100 : 0;
            $percentagePengeluaran = $grandTotalPengeluaran > 0 ? ($sdData['totalPengeluaran'] / $grandTotalPengeluaran) * 100 : 0;

            return [
                'id' => $sdData['id'],
                'name' => $sdData['nama_sumber'],
                'balance' => (float) $sdData['saldo'],
                'tipe_sumber' => $sdData['tipe_sumber'],
                'totalPemasukan' => $sdData['totalPemasukan'],
                'totalPengeluaran' => $sdData['totalPengeluaran'],
                'percentagePemasukan' => round($percentagePemasukan, 2),
                'percentagePengeluaran' => round($percentagePengeluaran, 2),
                'totalPemasukanYesterday' => $sdData['totalPemasukanYesterday'],
                'totalPengeluaranYesterday' => $sdData['totalPengeluaranYesterday'],
                'lastUpdated' => $sdData['updated_at'] ? Carbon::parse($sdData['updated_at'])->toIso8601String() : null,
            ];
        });

        // Collect all transactions for the history tab
        foreach ($sumberDanaWithTotals as $sdData) {
            foreach ($sdData['pemasukanTransactions'] as $p) {
                $allTransactions[] = [
                    'id' => 'pemasukan-' . $p->id,
                    'sourceId' => $sdData['id'],
                    'type' => 'pemasukan',
                    'description' => $p->description ?? 'Pemasukan',
                    'amount' => (float) $p->amount,
                    'waktu' => $p->waktu ? Carbon::parse($p->waktu)->toIso8601String() : Carbon::now()->toIso8601String(),
                    'currentBalance' => (float) $sdData['saldo'],
                ];
            }

            foreach ($sdData['pengeluaranTransactions'] as $pe) {
                $allTransactions[] = [
                    'id' => 'pengeluaran-' . $pe->id,
                    'sourceId' => $sdData['id'],
                    'type' => 'pengeluaran',
                    'description' => $pe->description,
                    'amount' => (float) $pe->amount,
                    'waktu' => $pe->waktu ? Carbon::parse($pe->waktu)->toIso8601String() : Carbon::now()->toIso8601String(),
                    'currentBalance' => (float) $sdData['saldo'],
                ];
            }
        }

        // Sort transactions by waktu
        usort($allTransactions, function ($a, $b) {
            return strtotime($b['waktu']) - strtotime($a['waktu']);
        });

        // Recalculate currentBalance for historical accuracy (this is a simplified approach)
        // For a true historical balance, you'd need to process transactions chronologically
        // and apply them to an initial balance. For now, we'll just use the current saldo.
        // A more robust solution would involve a dedicated balance calculation service.

        return response()->json([
            'sumberDana' => $formattedSumberDana,
            'transactions' => $allTransactions,
        ]);
    }

    public function show(Request $request, string $id)
    {
        $perPage = 15;
        $page = $request->query('page', 1);
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $transactionType = $request->query('transaction_type');
        $date = $request->query('date');

        $pemasukanQuery = KeuanganPemasukanHarian::query();
        $pengeluaranQuery = KeuanganPengeluaranHarian::query();

        // Filter by Sumber Dana ID
        if ($id !== 'all') {
            $sumberDanaId = (int) $id;
            $pemasukanQuery->where('sumber_dana_id', $sumberDanaId);
            $pengeluaranQuery->where('sumber_dana_id', $sumberDanaId);
        }

        // Filter by specific date or date range
        if ($date) {
            $pemasukanQuery->whereDate('waktu', $date);
            $pengeluaranQuery->whereDate('waktu', $date);
        } elseif ($startDate && $endDate) {
            $adjustedEndDate = Carbon::parse($endDate)->endOfDay();
            $pemasukanQuery->whereBetween('waktu', [$startDate, $adjustedEndDate]);
            $pengeluaranQuery->whereBetween('waktu', [$startDate, $adjustedEndDate]);
        }

        $transactions = collect();

        // Fetch based on transaction type
        if ($transactionType === 'pemasukan' || $transactionType === 'all' || !$transactionType) {
            $pemasukan = $pemasukanQuery->where('jenis_pemasukan', '!=', 'Transfer Masuk')
                                        ->where('jenis_pemasukan', '!=', 'Modal Awal') // Exclude Modal Awal from general pemasukan
                                        ->where('status', 'Final') // Exclude Draft transactions
                                        ->get()->map(function ($item) {
                return [
                    'id' => 'pemasukan-' . $item->id,
                    'sourceId' => $item->sumber_dana_id,
                    'type' => 'pemasukan',
                    'description' => $item->description,
                    'amount' => $item->amount,
                    'waktu' => $item->waktu->toIso8601String(),
                    'currentBalance' => $item->saldo_setelah,
                ];
            });
            $transactions = $transactions->merge($pemasukan);
        }

        // Fetch Modal Awal transactions
        if ($transactionType === 'modal_awal' || $transactionType === 'all' || !$transactionType) {
            $modalAwalQuery = KeuanganPemasukanHarian::query()
                ->where('jenis_pemasukan', 'Modal Awal')
                ->where('status', 'Final'); // Exclude Draft transactions
            
            if ($id !== 'all') {
                $modalAwalQuery->where('sumber_dana_id', (int) $id);
            }
            if ($date) {
                $modalAwalQuery->whereDate('waktu', $date);
            } elseif ($startDate && $endDate) {
                $modalAwalQuery->whereBetween('waktu', [$startDate, $adjustedEndDate]);
            }
            $modalAwal = $modalAwalQuery->get()->map(function ($item) {
                    return [
                        'id' => 'modal_awal-' . $item->id,
                        'sourceId' => $item->sumber_dana_id,
                        'type' => 'modal_awal',
                        'description' => $item->description,
                        'amount' => $item->amount,
                        'waktu' => $item->waktu->toIso8601String(),
                        'currentBalance' => $item->saldo_setelah,
                    ];
                });
            $transactions = $transactions->merge($modalAwal);
        }

        if ($transactionType === 'pengeluaran' || $transactionType === 'all' || !$transactionType) {
            $pengeluaran = $pengeluaranQuery->where('jenis_pengeluaran', '!=', 'Transfer Keluar')
                                            ->where('status', 'Final') // Exclude Draft transactions
                                            ->get()->map(function ($item) {
                return [
                    'id' => 'pengeluaran-' . $item->id,
                    'sourceId' => $item->sumber_dana_id,
                    'type' => 'pengeluaran',
                    'description' => $item->description,
                    'amount' => $item->amount,
                    'waktu' => $item->waktu->toIso8601String(),
                    'currentBalance' => $item->saldo_setelah,
                ];
            });
            $transactions = $transactions->merge($pengeluaran);
        }

        // Fetch transfer_in transactions
        if ($transactionType === 'transfer_in' || $transactionType === 'all' || !$transactionType) {
            $transferInQuery = KeuanganPemasukanHarian::query()
                ->where('jenis_pemasukan', 'Transfer Masuk')
                ->where('status', 'Final'); // Exclude Draft transactions
            
            if ($id !== 'all') {
                $transferInQuery->where('sumber_dana_id', (int) $id);
            }
            if ($date) {
                $transferInQuery->whereDate('waktu', $date);
            } elseif ($startDate && $endDate) {
                $transferInQuery->whereBetween('waktu', [$startDate, $endDate]);
            }
            $transferIn = $transferInQuery->get()->map(function ($item) {
                    return [
                        'id' => 'transfer_in-' . $item->id,
                        'sourceId' => $item->sumber_dana_id,
                        'type' => 'transfer_in',
                        'description' => $item->description,
                        'amount' => $item->amount,
                        'waktu' => $item->waktu->toIso8601String(),
                        'currentBalance' => $item->saldo_setelah,
                    ];
                });
            $transactions = $transactions->merge($transferIn);
        }

        // Fetch transfer_out transactions
        if ($transactionType === 'transfer_out' || $transactionType === 'all' || !$transactionType) {
            $transferOutQuery = KeuanganPengeluaranHarian::query()
                ->where('jenis_pengeluaran', 'Transfer Keluar')
                ->where('status', 'Final'); // Exclude Draft transactions

            if ($id !== 'all') {
                $transferOutQuery->where('sumber_dana_id', (int) $id);
            }
            if ($date) {
                $transferOutQuery->whereDate('waktu', $date);
            } elseif ($startDate && $endDate) {
                $transferOutQuery->whereBetween('waktu', [$startDate, $endDate]);
            }
            $transferOut = $transferOutQuery->get()->map(function ($item) {
                    return [
                        'id' => 'transfer_out-' . $item->id,
                        'sourceId' => $item->sumber_dana_id,
                        'type' => 'transfer_out',
                        'description' => $item->description,
                        'amount' => $item->amount,
                        'waktu' => $item->waktu->toIso8601String(),
                        'currentBalance' => $item->saldo_setelah,
                    ];
                });
            $transactions = $transactions->merge($transferOut);
        }


        // Sort all transactions by waktu descending
        $sortedTransactions = $transactions->sortByDesc('waktu');

        // Manual pagination
        $paginatedTransactions = new \Illuminate\Pagination\LengthAwarePaginator(
            $sortedTransactions->forPage($page, $perPage)->values(),
            $sortedTransactions->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return response()->json([
            'transactions' => $paginatedTransactions,
        ]);
    }

    public function storePemasukan(Request $request)
    {
        $validated = $request->validate([
            'sumber_dana_id' => 'required|integer',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
        ]);

        try {
            $sumberDana = DB::transaction(function () use ($validated) {
                $sumberDanaId = $validated['sumber_dana_id'];
                $sumberDana = null;

                if ($sumberDanaId === -1) { // Magic number for Tunai
                    $sumberDana = SumberDana::firstOrCreate(
                        ['tipe_sumber' => 'Tunai'],
                        ['nama_sumber' => 'Kas Tunai', 'saldo' => 0.00, 'deskripsi' => 'Sumber dana tunai utama.']
                    );
                } elseif ($sumberDanaId === -2) { // Magic number for Bank
                    $sumberDana = SumberDana::firstOrCreate(
                        ['tipe_sumber' => 'Bank'],
                        ['nama_sumber' => 'Rekening Bank Utama', 'saldo' => 0.00, 'deskripsi' => 'Sumber dana bank utama.']
                    );
                } else {
                    $sumberDana = SumberDana::findOrFail($sumberDanaId);
                }

                $saldo_sebelum = $sumberDana->saldo;
                $saldo_setelah = $saldo_sebelum + $validated['amount'];

                KeuanganPemasukanHarian::create([
                    'sumber_dana_id' => $sumberDana->id,
                    'amount' => $validated['amount'],
                    'description' => $validated['description'] ?? 'Modal Awal',
                    'waktu' => now(),
                    'saldo_sebelum' => $saldo_sebelum,
                    'saldo_setelah' => $saldo_setelah,
                    'jenis_pemasukan' => 'Modal Awal',
                    'status' => 'Final',
                    'user_id' => Auth::id(),
                ]);

                $sumberDana->saldo += $validated['amount'];
                $sumberDana->save();

                return $sumberDana;
            });

            return response()->json(['message' => 'Pemasukan berhasil ditambahkan.', 'sumberDana' => $sumberDana], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menambahkan pemasukan: ' . $e->getMessage()], 500);
        }
    }

    public function storeTransfer(Request $request)
    {
        $validated = $request->validate([
            'from_sumber_dana_id' => 'required|exists:sumber_dana,id',
            'to_sumber_dana_id' => 'required|exists:sumber_dana,id|different:from_sumber_dana_id',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                $fromSumberDana = SumberDana::findOrFail($validated['from_sumber_dana_id']);
                $toSumberDana = SumberDana::findOrFail($validated['to_sumber_dana_id']);
                $amount = $validated['amount'];
                $description = $validated['description'] ?? 'Transfer Dana';

                // Ensure enough balance in the source account
                if ($fromSumberDana->saldo < $amount) {
                    throw new \Exception('Saldo sumber dana asal tidak mencukupi.');
                }

                // Process transfer out (pengeluaran)
                $fromSaldoSebelum = $fromSumberDana->saldo;
                $fromSaldoSetelah = $fromSaldoSebelum - $amount;
                $fromSumberDana->decrement('saldo', $amount);

                KeuanganPengeluaranHarian::create([
                    'user_id' => Auth::id(),
                    'sumber_dana_id' => $fromSumberDana->id,
                    'waktu' => now(),
                    'description' => 'Transfer ke ' . $toSumberDana->nama_sumber . ': ' . $description,
                    'amount' => $amount,
                    'jenis_pengeluaran' => 'Transfer Keluar',
                    'catatan' => null,
                    'invoice_path' => null,
                    'status' => 'Final',
                    'saldo_sebelum' => $fromSaldoSebelum,
                    'saldo_setelah' => $fromSaldoSetelah,
                ]);

                // Process transfer in (pemasukan)
                $toSaldoSebelum = $toSumberDana->saldo;
                $toSaldoSetelah = $toSaldoSebelum + $amount;
                $toSumberDana->increment('saldo', $amount);

                KeuanganPemasukanHarian::create([
                    'user_id' => Auth::id(),
                    'sumber_dana_id' => $toSumberDana->id,
                    'waktu' => now(),
                    'description' => 'Transfer dari ' . $fromSumberDana->nama_sumber . ': ' . $description,
                    'amount' => $amount,
                    'jenis_pemasukan' => 'Transfer Masuk',
                    'catatan' => null,
                    'invoice_path' => null,
                    'status' => 'Final',
                    'saldo_sebelum' => $toSaldoSebelum,
                    'saldo_setelah' => $toSaldoSetelah,
                ]);
            });

            return response()->json(['message' => 'Transfer berhasil dilakukan.'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal melakukan transfer: ' . $e->getMessage()], 500);
        }
    }
}