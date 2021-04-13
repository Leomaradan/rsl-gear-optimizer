<?php
declare (strict_types = 1);

namespace Backend\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Result extends Model
{
    use SoftDeletes;

    protected $primaryKey = 'user_id';
    protected $hidden = ['user_id', 'created_at', 'updated_at', 'deleted_at'];

    protected $casts = [
        'data' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
