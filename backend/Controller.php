<?php
declare (strict_types = 1);

namespace Backend;

use Psr\Container\ContainerInterface;

abstract class Controller
{
    protected $container;
    protected $user_id;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    protected function userId()
    {
        if (!isset($_SESSION['user'])) {
            throw Exception('missing user');
        }

        return $_SESSION['user']['id'];
    }

    protected function service()
    {
        return $this->container->get('Service');
    }
}
