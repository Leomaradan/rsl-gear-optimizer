<?php

declare(strict_types=1);

namespace Backend\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $hidden = ['password', 'verify_token', 'created_at', 'updated_at'];

    protected $fillable = [];

    public function option()
    {
        return $this->hasOne(Option::class);
    }

    public function artifacts()
    {
        return $this->hasMany(Artifact::class);
    }

    public function champions()
    {
        return $this->hasMany(Champion::class);
    }

    public function configurations()
    {
        return $this->hasMany(Configuration::class);
    }

    public function scopeOwned(Builder $query, $user_id)
    {
        return $query->where('id', $user_id);
    }
}
