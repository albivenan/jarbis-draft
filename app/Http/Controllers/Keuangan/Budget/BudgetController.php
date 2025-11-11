<?php

namespace App\Http\Controllers\Keuangan\Budget;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function rencana()
    {
        return inertia('roles/keuangan/budget/rencana');
    }

    public function realisasi()
    {
        return inertia('roles/keuangan/budget/realisasi');
    }

    public function monitoring()
    {
        return inertia('roles/keuangan/budget/monitoring');
    }
}