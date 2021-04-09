<?php
declare (strict_types = 1);

namespace Backend;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class AccountController extends Controller
{

    function list(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface {

        $service = $this->service();

        $instance = $service->instance();

        var_dump($instance);
        var_dump($_SESSION);

        $response->getBody()->write('List');
        return $response;
    }

    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->getBody()->write('Update');

        return $response;
    }

    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->getBody()->write('Create');

        return $response;
    }

    public function remove(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $pdo = $this->service()->instance();

        $pdo->beginTransaction();

        $data = [];

        $param = [
            ':user_id' => $this->userId(),
        ];

        // Unassign artifact
        $sth = $pdo->prepare('DELETE FROM `artifact` WHERE `user_id` = :user_id');
        $sth->execute($param);
        $data['artifactsDeleted'] = $sth->rowCount();

        // Remove configuration using this champion
        $sth = $pdo->prepare('DELETE FROM `configuration` WHERE `user_id` = :user_id');
        $sth->execute($param);
        $data['configurationDeleted'] = $sth->rowCount();

        // Delete the champion
        // Remove configuration using this champion
        $sth = $pdo->prepare('DELETE FROM `champion` WHERE  `user_id` = :user_id');
        $sth->execute($param);
        $data['championDeleted'] = $sth->rowCount();

        $sth = $pdo->prepare('DELETE FROM `game` WHERE  `user_id` = :user_id');
        $sth->execute($param);
        $data['gameDeleted'] = $sth->rowCount();

        $sth = $pdo->prepare('DELETE FROM `result` WHERE  `user_id` = :user_id');
        $sth->execute($param);
        $data['resultDeleted'] = $sth->rowCount();

        $sth = $pdo->prepare('DELETE FROM `user` WHERE  `id` = :user_id');
        $sth->execute($param);
        $data['userDeleted'] = $sth->rowCount();

        $pdo->rollback();

        $payload = json_encode($data);

        $response->getBody()->write($payload);
        return $response
            ->withHeader('Content-Type', 'application/json');
    }

    public function login(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->getBody()->write('Login');

        return $response;
    }

    public function verify(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->getBody()->write('Verify');

        return $response;
    }

    public function reset(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->getBody()->write('Reset');

        return $response;
    }

    public function import(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->getBody()->write('Import');

        return $response;
    }
}
