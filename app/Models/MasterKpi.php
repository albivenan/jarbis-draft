<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MasterKpi extends Model
{
    use HasFactory;

    protected $table = 'master_kpi';

    protected $fillable = [
        'nama_kpi',
        'deskripsi',
        'target',
        'satuan',
        'tipe_kpi',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function results(): HasMany
    {
        return $this->hasMany(KpiResult::class, 'id_kpi');
    }
}