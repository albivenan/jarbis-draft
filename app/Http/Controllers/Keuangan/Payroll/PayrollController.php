<?php

namespace App\Http\Controllers\Keuangan\Payroll;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    public function dataGaji()
    {
        return inertia('roles/keuangan/payroll/data-gaji');
    }

    public function tunjangan()
    {
        return inertia('roles/keuangan/payroll/tunjangan');
    }

    public function potongan()
    {
        return inertia('roles/keuangan/payroll/potongan');
    }
}