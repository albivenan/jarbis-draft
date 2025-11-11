<?php

namespace App\Http\Controllers\Keuangan\ManajerKeuangan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ManajerKeuanganController extends Controller
{
    public function index()
    {
        return inertia('roles/manajer-keuangan/dashboard');
    }
    
    public function payrollApproval()
    {
        return inertia('roles/manajer-keuangan/payroll/Approval');
    }
}