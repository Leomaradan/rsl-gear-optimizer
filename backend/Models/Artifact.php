<?php

declare(strict_types=1);

namespace Backend\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Artifact extends Model
{
    use SoftDeletes;

    protected $hidden = ['user_id', 'created_at', 'updated_at', 'deleted_at'];

    protected $casts = [
        'sub_stats' => 'array',
    ];

    protected $guarded = ['id', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function wornBy()
    {
        return $this->belongsTo(Champion::class, 'champion_id');
    }

    public function scopeOwned(Builder $query, $user_id)
    {
        return $query->where('user_id', $user_id);
    }

    public function scopeFindOwned(Builder $query, $user_id, $id)
    {
        return $query->where('user_id', $user_id)->where('id', $id);
    }
}
