<?php
declare (strict_types = 1);

namespace Backend\Container;

class EloquentContainer
{

    public $capsule;

    public function __construct($host, $database, $user, $pass = null)
    {
        $capsule = new \Illuminate\Database\Capsule\Manager;
        $capsule->addConnection(
            [
                'driver' => 'mysql',
                'host' => $host,
                'database' => $database,
                'username' => $user,
                'password' => $pass,
                'charset' => 'utf8',
                'collation' => 'utf8_unicode_ci',
                'prefix' => '',
            ]
        );

        $capsule->setAsGlobal();
        $capsule->bootEloquent();

        $this->capsule = $capsule;
    }

}
