<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sop extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'code',
        'title',
        'category',
        'department',
        'version',
        'status',
        'effective_date',
        'review_date',
        'next_review_date',
        'approved_by',
        'created_by',
        'description',
        'objective',
        'scope',
        'steps',
        'related_documents',
        'attachments',
        'download_count',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'effective_date' => 'date',
        'review_date' => 'date',
        'next_review_date' => 'date',
        'steps' => 'array',
        'related_documents' => 'array',
        'attachments' => 'array',
    ];
}