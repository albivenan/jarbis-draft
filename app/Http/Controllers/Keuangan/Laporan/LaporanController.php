<?php

namespace App\Http\Controllers\Keuangan\Laporan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    public function bulanan()
    {
        return inertia('roles/keuangan/laporan/bulanan');
    }

    public function tahunan()
    {
        return inertia('roles/keuangan/laporan/tahunan');
    }

    public function neraca()
    {
        return inertia('roles/keuangan/laporan/neraca');
    }

    public function direksi()
    {
        return inertia('roles/keuangan/laporan/direksi');
    }
}
