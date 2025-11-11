<?php

namespace App\Http\Controllers;

use App\Models\Sop;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SopController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('roles/manajer-hrd/administrasi/sop/index', [
            'sops' => Sop::latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('roles/manajer-hrd/administrasi/sop/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'code' => 'required|string|unique:sops|max:255',
            'title' => 'required|string|max:255',
            'category' => 'required|string|in:hrd,produksi,keuangan,marketing,qc,umum',
            'department' => 'required|string|max:255',
            'version' => 'required|string|max:255',
            'description' => 'nullable|string',
            'objective' => 'nullable|string',
            'scope' => 'nullable|string',
        ]);

        Sop::create($validatedData);

        return redirect()->route('manajer-hrd.administrasi.sop.index')->with('message', 'SOP berhasil dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Sop $sop)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sop $sop)
    {
        return Inertia::render('roles/manajer-hrd/administrasi/sop/edit', [
            'sop' => $sop
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sop $sop)
    {
        $validatedData = $request->validate([
            'code' => 'required|string|max:255|unique:sops,code,' . $sop->id,
            'title' => 'required|string|max:255',
            'category' => 'required|string|in:hrd,produksi,keuangan,marketing,qc,umum',
            'department' => 'required|string|max:255',
            'version' => 'required|string|max:255',
            'description' => 'nullable|string',
            'objective' => 'nullable|string',
            'scope' => 'nullable|string',
        ]);

        $sop->update($validatedData);

        return redirect()->route('manajer-hrd.administrasi.sop.index')->with('message', 'SOP berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sop $sop)
    {
        $sop->delete();

        return redirect()->route('manajer-hrd.administrasi.sop.index')->with('message', 'SOP berhasil dihapus.');
    }
}
