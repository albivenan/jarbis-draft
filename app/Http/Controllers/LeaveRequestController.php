<?php

namespace App\Http\Controllers;

use App\Models\PengajuanIzin;
use App\Models\PermohonanIzin;
use App\Models\PermohonanLembur;
use App\Models\KuotaCuti;
use App\Models\JadwalKerja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Inertia\Inertia;

class LeaveRequestController extends Controller
{
    /**
     * =================================================================
     * PAGE RENDERING METHODS
     * =================================================================
     */

    /**
     * Show the main leave request page for a crew member.
     */
    public function index()
    {
        return Inertia::render('roles/crew/izin/index');
    }

    /**
     * Show the main request management page for HRD.
     * This method was moved from PresensiController.
     */
    public function hrdPengajuanPage()
    {
        if (!in_array(Auth::user()->role, ['manajer_hrd', 'staf_hrd'])) {
            abort(403, 'Unauthorized access');
        }

        // Initial data can be fetched here or on frontend via API
        return Inertia::render('roles/manajer-hrd/manajemen-presensi/pengajuan', [
            'initialRequests' => [],
        ]);
    }

    /**
     * =================================================================
     * API METHODS FOR CREW
     * =================================================================
     */

    /**
     * API: Submit a new permission or overtime request.
     * Centralized logic moved from PresensiController.
     */
    public function apiSubmitRequest(Request $request)
    {
        $request->validate([
            'jenis_permohonan' => 'required|in:izin_terlambat,izin_pulang_awal,izin_tidak_masuk,lembur',
            'alasan' => 'required|string|min:10|max:500',
            'waktu_pengajuan' => 'nullable|date_format:H:i',
            'jam_mulai_lembur' => 'nullable|date_format:H:i',
            'jam_selesai_lembur' => 'nullable|date_format:H:i|after:jam_mulai_lembur',
        ]);

        $user = Auth::user();
        if (!$user || !$user->id_karyawan) {
            return response()->json(['success' => false, 'message' => 'User tidak terautentikasi'], 401);
        }

        DB::beginTransaction();
        try {
            $today = Carbon::today();

            if ($request->jenis_permohonan === 'lembur') {
                if (!$request->jam_mulai_lembur || !$request->jam_selesai_lembur) {
                    return response()->json(['success' => false, 'message' => 'Jam mulai dan selesai lembur harus diisi'], 400);
                }

                $lembur = PermohonanLembur::create([
                    'id_karyawan' => $user->id_karyawan,
                    'tanggal_permohonan' => $today,
                    'jam_mulai_lembur' => $request->jam_mulai_lembur,
                    'jam_selesai_lembur' => $request->jam_selesai_lembur,
                    'durasi_lembur' => round(Carbon::parse($request->jam_selesai_lembur)->diffInMinutes(Carbon::parse($request->jam_mulai_lembur)) / 60, 2),
                    'alasan_lembur' => $request->alasan,
                    'status_pengajuan' => 'pending',
                    'tanggal_pengajuan' => now(),
                ]);

                DB::commit();
                return response()->json(['success' => true, 'message' => 'Pengajuan lembur berhasil dikirim.', 'data' => $lembur]);
            } else {
                $izin = PermohonanIzin::create([
                    'id_karyawan' => $user->id_karyawan,
                    'tanggal_permohonan' => $today,
                    'jenis_permohonan' => $request->jenis_permohonan,
                    'waktu_pengajuan' => $request->waktu_pengajuan,
                    'alasan' => $request->alasan,
                    'status_pengajuan' => 'pending',
                    'tanggal_pengajuan' => now(),
                ]);

                DB::commit();
                return response()->json(['success' => true, 'message' => 'Pengajuan izin berhasil dikirim.', 'data' => $izin]);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Request submission failed', ['error' => $e->getMessage(), 'user_id' => $user->id_karyawan]);
            return response()->json(['success' => false, 'message' => 'Gagal mengajukan: ' . $e->getMessage()], 500);
        }
    }

    /**
     * =================================================================
     * API METHODS FOR HRD
     * =================================================================
     */

    /**
     * API: Get HRD requests with filters.
     * Full logic moved from PresensiController.
     */
    public function getHrdRequests(Request $request)
    {
        if (!in_array(Auth::user()->role, ['manajer_hrd', 'staf_hrd'])) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $status = $request->get('status', 'pending');
        $dateFrom = $request->get('date_from');
        $dateTo = $request->get('date_to');
        $employee = $request->get('employee');

        // Build permission query
        $permissionQuery = PermohonanIzin::with(['karyawan:id_karyawan,nama_lengkap,nik_perusahaan', 'approver:id,name']);
        if ($status !== 'all') $permissionQuery->where('status_pengajuan', $status);
        if ($dateFrom) $permissionQuery->whereDate('tanggal_permohonan', '>=', $dateFrom);
        if ($dateTo) $permissionQuery->whereDate('tanggal_permohonan', '<=', $dateTo);
        if ($employee) {
            $permissionQuery->whereHas('karyawan', function ($q) use ($employee) {
                $q->where('nama_lengkap', 'like', '%' . $employee . '%')
                  ->orWhere('nik_perusahaan', 'like', '%' . $employee . '%');
            });
        }
        $permissions = $permissionQuery->orderBy('created_at', 'desc')->get();

        // Build overtime query
        $overtimeQuery = PermohonanLembur::with(['karyawan:id_karyawan,nama_lengkap,nik_perusahaan', 'approver:id,name']);
        if ($status !== 'all') $overtimeQuery->where('status_pengajuan', $status);
        if ($dateFrom) $overtimeQuery->whereDate('tanggal_permohonan', '>=', $dateFrom);
        if ($dateTo) $overtimeQuery->whereDate('tanggal_permohonan', '<=', $dateTo);
        if ($employee) {
            $overtimeQuery->whereHas('karyawan', function ($q) use ($employee) {
                $q->where('nama_lengkap', 'like', '%' . $employee . '%')
                  ->orWhere('nik_perusahaan', 'like', '%' . $employee . '%');
            });
        }
        $overtimes = $overtimeQuery->orderBy('created_at', 'desc')->get();

        // Format and combine data
        $formattedRequests = [];
        foreach ($permissions as $p) {
            $formattedRequests[] = [
                'id' => $p->id_permohonan, 'id_presensi' => $p->id_permohonan, 'type' => 'izin',
                'employee_name' => $p->karyawan->nama_lengkap ?? 'Unknown', 'employee_id' => $p->karyawan->nik_perusahaan ?? '-',
                'jenis_pengajuan' => $p->jenis_permohonan, 'tanggal' => $p->tanggal_permohonan->format('Y-m-d'),
                'alasan_pengajuan' => $p->alasan, 'status_pengajuan' => $p->status_pengajuan,
                'waktu_pengajuan_izin' => $p->waktu_pengajuan, 'tanggal_pengajuan' => $p->created_at->format('Y-m-d H:i:s'),
                'approved_by' => $p->approver->name ?? null, 'tanggal_approval' => $p->tanggal_approval ? $p->tanggal_approval->format('Y-m-d H:i:s') : null,
                'catatan_approval' => $p->catatan_approval,
            ];
        }
        foreach ($overtimes as $o) {
            $formattedRequests[] = [
                'id' => $o->id_permohonan_lembur, 'id_presensi' => $o->id_permohonan_lembur, 'type' => 'lembur',
                'employee_name' => $o->karyawan->nama_lengkap ?? 'Unknown', 'employee_id' => $o->karyawan->nik_perusahaan ?? '-',
                'jenis_pengajuan' => 'lembur', 'tanggal' => $o->tanggal_permohonan->format('Y-m-d'),
                'alasan_pengajuan' => $o->alasan_lembur, 'status_pengajuan' => $o->status_pengajuan,
                'jam_lembur_mulai' => $o->jam_mulai_lembur, 'jam_lembur_selesai' => $o->jam_selesai_lembur,
                'durasi_jam' => $o->durasi_lembur, 'tanggal_pengajuan' => $o->created_at->format('Y-m-d H:i:s'),
                'approved_by' => $o->approver->name ?? null, 'tanggal_approval' => $o->tanggal_approval ? $o->tanggal_approval->format('Y-m-d H:i:s') : null,
                'catatan_approval' => $o->catatan_approval,
            ];
        }

        // Sort combined data by request date
        usort($formattedRequests, fn($a, $b) => strtotime($b['tanggal_pengajuan']) - strtotime($a['tanggal_pengajuan']));

        return response()->json(['success' => true, 'data' => $formattedRequests]);
    }

    /**
     * API: Approve or reject a request.
     * Centralized logic moved from PresensiController.
     */
    public function approveRequest(Request $request)
    {
        $request->validate([
            'id_presensi' => 'required|integer', // Keep name for frontend compatibility
            'action' => 'required|in:approve,reject',
            'catatan_approval' => 'nullable|string|max:500',
            'type' => 'required|in:izin,lembur',
        ]);

        if (!in_array(Auth::user()->role, ['manajer_hrd', 'staf_hrd'])) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        DB::beginTransaction();
        try {
            $model = null;
            if ($request->type === 'izin') {
                $model = PermohonanIzin::findOrFail($request->id_presensi);
            } else { // lembur
                $model = PermohonanLembur::findOrFail($request->id_presensi);
            }

            if ($model->status_pengajuan !== 'pending') {
                return response()->json(['success' => false, 'message' => 'Pengajuan ini sudah diproses.'], 400);
            }

            $model->update([
                'status_pengajuan' => $request->action === 'approve' ? 'approved' : 'rejected',
                'approved_by' => Auth::id(),
                'tanggal_approval' => now(),
                'catatan_approval' => $request->catatan_approval,
            ]);

            // If an 'izin tidak masuk' is approved, update the corresponding JadwalKerja
            if ($request->action === 'approve' && $request->type === 'izin' && $model->jenis_permohonan === 'izin_tidak_masuk') {
                JadwalKerja::where('id_karyawan', $model->id_karyawan)
                    ->whereDate('tanggal', $model->tanggal_permohonan)
                    ->update(['status_kehadiran' => 'Izin']);
            }

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Pengajuan berhasil diproses.']);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Request approval failed', ['error' => $e->getMessage(), 'request_id' => $request->id_presensi, 'type' => $request->type]);
            return response()->json(['success' => false, 'message' => 'Gagal memproses pengajuan.'], 500);
        }
    }

    /**
     * =================================================================
     * LEGACY/DEPRECATED METHODS (from original LeaveRequestController)
     * These might be removed in the future after frontend is fully adapted.
     * =================================================================
     */
    
    public function getLeaveRequests(Request $request)
    {
        // This method seems to handle 'PengajuanIzin' which is a different table.
        // For now, we leave it as is but it should be reviewed.
        $user = Auth::user();
        if (!$user || !$user->id_karyawan) {
            return response()->json(['success' => false, 'message' => 'User tidak terautentikasi'], 401);
        }
        $requests = PengajuanIzin::where('id_karyawan', $user->id_karyawan)->with(['approver:id,name'])->orderBy('created_at', 'desc')->get()->map(function ($req) {
            return ['id' => $req->id, 'jenis_pengajuan' => $req->jenis_pengajuan, 'tanggal_mulai' => $req->tanggal_mulai->format('Y-m-d'), 'tanggal_selesai' => $req->tanggal_selesai->format('Y-m-d'), 'alasan' => $req->alasan, 'status' => $req->status];
        });
        return response()->json(['success' => true, 'data' => $requests]);
    }
}