<?php
declare (strict_types = 1);

namespace Backend;

use in_array;
use json_decode;
use PDO;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ArtifactController extends Controller
{

    private $integerProperties = ['id', 'quality', 'level', 'main_value', 'power'];

    function list(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface {
        $pdo = $this->service()->instance();
        $sql = 'SELECT * FROM artifact WHERE user_id = ? ORDER BY id;';

        $sth = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
        $sth->execute([$this->userId()]);

        //$data = $sth->fetchAll(PDO::FETCH_ASSOC);
        $data = [];

        while ($row = $sth->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT)) {

            $artifact = [];

            foreach ($row as $key => $value) {
                if ($key === "user_id") {
                    continue;
                }

                if ($key === "sub_stats") {
                    $artifact[$key] = json_decode($value);
                    continue;
                }

                if ($key === "champion_id" && $value !== null) {

                    $artifact[$key] = (int) $value;
                    continue;
                }

                if (in_array($key, $this->integerProperties)) {
                    $artifact[$key] = (int) $value;
                    continue;
                }

                $artifact[$key] = $value;
            }

            $data[] = $artifact;

        }

        $payload = json_encode($data);

        $response->getBody()->write($payload);
        return $response
            ->withHeader('Content-Type', 'application/json');
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
