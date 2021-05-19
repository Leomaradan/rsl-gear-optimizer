<?php

declare(strict_types=1);

namespace Backend\Controller;

use ErrorException;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;

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
            throw new ErrorException('missing user');
        }

        return $_SESSION['user']['id'];
    }

    protected function invalidQuery(ResponseInterface $response)
    {
        $response->getBody()->write(json_encode(['message' => 'Bad Request']));

        return $response
            ->withHeader('Content-Type', 'application/json')->withStatus(400);
    }

    protected function json(ResponseInterface $response, $data = [])
    {
        $response->getBody()->write(json_encode($data));

        return $response
            ->withHeader('Content-Type', 'application/json')
        ;
    }
}
