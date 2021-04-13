<?php
declare (strict_types = 1);

namespace Backend\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
        return $this->belongsTo(Champion::class);
    }
}
