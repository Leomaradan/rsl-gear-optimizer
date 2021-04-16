<?php

declare(strict_types=1);

namespace Backend\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    protected $primaryKey = 'user_id';
    protected $hidden = ['user_id', 'created_at', 'updated_at'];

    protected $fillable = ['artifacts_display',
        'exclude_worn_artifact',
        'generation_method',
        'arena_rank',
        'great_hall', ];

    protected $casts = [
        'great_hall' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeOwned(Builder $query, $user_id)
    {
        return $query->where('user_id', $user_id);
    }
}
