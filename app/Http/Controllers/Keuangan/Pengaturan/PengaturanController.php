<?php

namespace App\Http\Controllers\Keuangan\Pengaturan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PengaturanController extends Controller
{
    public function chartAccount()
    {
        return inertia('roles/keuangan/pengaturan/chart-account');
    }

    public function userRole()
    {
        return inertia('roles/keuangan/pengaturan/user-role');
    }
}
