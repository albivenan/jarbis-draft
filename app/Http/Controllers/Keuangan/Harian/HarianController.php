<?php

namespace App\Http\Controllers\Keuangan\Harian;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HarianController extends Controller
{
    public function pemasukan()
    {
        return inertia('roles/keuangan/harian/pemasukan');
    }

    public function pengeluaran()
    {
        return inertia('roles/keuangan/harian/pengeluaran');
    }

    public function kasBank()
    {
        return inertia('roles/keuangan/harian/kas-bank');
    }
}