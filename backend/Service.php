<?php
declare (strict_types = 1);

namespace Backend;

use PDO;

class Service
{

    private $host;
    private $database;
    private $user;
    private $pass;

    public function __construct($host, $database, $user, $pass = null)
    {
        $this->host = $host;
        $this->database = $database;
        $this->user = $user;
        $this->pass = $pass;
    }

    public function instance()
    {
        $dsn = 'mysql:dbname=' . $this->database . ';host=' . $this->host;

        return new PDO($dsn, $this->user, $this->pass);
    }
}
