<?php

namespace App\Http\Controllers\ManajerKeuangan\Harian;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\KasDanBank;

class KasDanBankController extends Controller
{
    public function index()
    {
        $kasDanBank = KasDanBank::all();

        return Inertia::render('roles/keuangan/harian/sumber-dana/index', [
            'kasDanBank' => $kasDanBank,
        ]);
    }
}
