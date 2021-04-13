<?php
declare (strict_types = 1);

namespace Backend\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Model
{
    use SoftDeletes;

    protected $hidden = ['password', 'verify_token', 'created_at', 'updated_at', 'deleted_at'];

    protected $fillable = [];

    public function option()
    {
        return $this->hasOne(Option::class);
    }

    public function result()
    {
        return $this->hasOne(Result::class);
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
}
