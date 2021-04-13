<?php
declare (strict_types = 1);

namespace Backend\Controller;

use json_decode;
use GUMP;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ConfigController extends Controller
{

    function list(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface {

        $payload = Configuration::where('user_id', $this->userId())->get()->toJson(JSON_PRETTY_PRINT);

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
        $payload = Result::where('user_id', $this->userId())->get()->toJson(JSON_PRETTY_PRINT);

        return $this->json($response, $payload);
    }

    public function resultUpdate(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $is_valid = GUMP::is_valid($args, RESULT_VALIDATION);


        $isValidArtifact = GUMP::is_valid($args, ARTIFACT_VALIDATION);

        var_dump($is_valid);

        if ($is_valid === true) {

            $user = User::where('verify_token', $args['id'])->first();

            if ($user) {
                $user->verify_token = null;
                $user->save();

                return $this->json($response);
            }
        }

        return $this->invalidQuery($response);
    }
}
