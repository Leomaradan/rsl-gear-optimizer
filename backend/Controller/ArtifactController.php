<?php
declare (strict_types = 1);

namespace Backend\Controller;

use in_array;
use json_decode;
use PDO;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ArtifactController extends Controller
{

    private $integerProperties = ['id', 'quality', 'level', 'main_value', 'power'];

    function list(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface {
        $payload = Artifact::where('user_id', $this->userId())->get()->toJson(JSON_PRETTY_PRINT);

        return $this->json($response, $payload);
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
        $id = (int) $args['id'];

        $pdo = $this->service()->instance();

        $pdo->beginTransaction();

        $data = [];

        $param = [
            ':artifact_id' => $id,
            ':user_id' => $this->userId(),
        ];

        $sth = $pdo->prepare('DELETE FROM `artifact` WHERE `id` = :artifact_id AND `user_id` = :user_id');
        $sth->execute($param);
        $data['artifactDeleted'] = $sth->rowCount();

        $pdo->rollback();

        $payload = json_encode($data);

        $response->getBody()->write($payload);
        return $response
            ->withHeader('Content-Type', 'application/json');
    }
}
