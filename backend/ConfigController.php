<?php
declare (strict_types = 1);

namespace Backend;

use json_decode;
use PDO;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ConfigController extends Controller
{

    function list(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface {

        $pdo = $this->service()->instance();
        $sql = 'SELECT * FROM configuration WHERE user_id = ? ORDER BY id;';

        $sth = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
        $sth->execute([$this->userId()]);

        $data = [];

        while ($row = $sth->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT)) {

            $config = [];

            foreach ($row as $key => $value) {
                if ($key === "user_id") {
                    continue;
                }

                if ($key === "configuration") {
                    $config[$key] = json_decode($value);
                    continue;
                }

                if ($key === "champion_id" || $key === "id") {
                    $config[$key] = (int) $value;
                    continue;
                }

                if ($key === "activated" || $key === "locked") {
                    $config[$key] = (bool) $value;
                    continue;
                }

                $config[$key] = $value;
            }

            $data[] = $config;

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
            ':config_id' => $id,
            ':user_id' => $this->userId(),
        ];

        // Remove configuration using this champion
        $sth = $pdo->prepare('DELETE FROM `configuration` WHERE `id` = :config_id AND `user_id` = :user_id');
        $sth->execute($param);
        $data['configurationDeleted'] = $sth->rowCount();

        $pdo->rollback();

        $payload = json_encode($data);

        $response->getBody()->write($payload);
        return $response
            ->withHeader('Content-Type', 'application/json');
    }

    public function resultList(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->getBody()->write('Result List');

        return $response;
    }

    public function resultUpdate(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->getBody()->write('Result Update');

        return $response;
    }
}
