<?php
declare (strict_types = 1);

namespace Backend;

use json_decode;
use PDO;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ChampionController extends Controller
{

    function list(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface {

        $pdo = $this->service()->instance();
        $sql = 'SELECT * FROM champion WHERE user_id = ? ORDER BY id;';

        $sth = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
        $sth->execute([$this->userId()]);

        //$data = $sth->fetchAll(PDO::FETCH_ASSOC);
        $data = [];

        while ($row = $sth->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT)) {

            $champion = [];

            foreach ($row as $key => $value) {
                if ($key === "user_id") {
                    continue;
                }

                if ($key === "masteries") {
                    $champion[$key] = json_decode($value);
                    continue;
                }

                if ($key === "vault") {
                    $champion[$key] = (bool) $value;
                    continue;
                }

                $champion[$key] = (int) $value;
            }

            $data[] = $champion;

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
            ':champion_id' => $id,
            ':user_id' => $this->userId(),
        ];

        // Unassign artifact
        $sth = $pdo->prepare('UPDATE `artifact` SET `champion_id`= NULL WHERE `champion_id` = :champion_id AND `user_id` = :user_id');
        $sth->execute($param);
        $data['artifactsUpdated'] = $sth->rowCount();

        // Remove configuration using this champion
        $sth = $pdo->prepare('DELETE FROM `configuration` WHERE `champion_id` = :champion_id AND `user_id` = :user_id');
        $sth->execute($param);
        $data['configurationDeleted'] = $sth->rowCount();

        // Delete the champion
        // Remove configuration using this champion
        $sth = $pdo->prepare('DELETE FROM `champion` WHERE `id` = :champion_id AND `user_id` = :user_id');
        $sth->execute($param);
        $data['championDeleted'] = $sth->rowCount();

        $pdo->rollback();

        $payload = json_encode($data);

        $response->getBody()->write($payload);
        return $response
            ->withHeader('Content-Type', 'application/json');
    }
}
