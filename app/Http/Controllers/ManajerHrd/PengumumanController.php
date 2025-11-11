<?php

namespace App\Http\Controllers\ManajerHrd;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Pengumuman;
use Illuminate\Support\Facades\Auth;

class PengumumanController extends Controller
{
    public function create()
    {
        return Inertia::render('roles/manajer-hrd/pengumuman/buat/index');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'waktu_publikasi' => 'nullable|date',
            'status' => 'required|in:draft,published',
        ]);

        if ($validatedData['status'] === 'draft') {
            $validatedData['waktu_publikasi'] = null;
        }

        Pengumuman::create(array_merge($validatedData, [
            'id_user' => Auth::id(),
        ]));

        return redirect()->route('manajer-hrd.pengumuman.riwayat')->with('success', 'Pengumuman berhasil dibuat!');
    }

    public function index()
    {
        $pengumuman = Pengumuman::with('user')->latest()->paginate(10);

        return Inertia::render('roles/manajer-hrd/pengumuman/riwayat/index', [
            'pengumuman' => $pengumuman,
        ]);
    }

    public function show(Pengumuman $pengumuman)
    {
        $pengumuman->load('user'); // Eager load the user relationship
        return Inertia::render('roles/manajer-hrd/pengumuman/riwayat/show/index', [
            'pengumuman' => $pengumuman,
        ]);
    }

    public function destroy(Pengumuman $pengumuman)
    {
        $pengumuman->delete();
        return redirect()->route('manajer-hrd.pengumuman.riwayat')->with('success', 'Pengumuman berhasil dihapus!');
    }
}
