<?php
declare (strict_types = 1);

namespace Backend\Controller;

use Backend\Models\Option;
use Backend\Models\Result;
use Backend\Models\User;
use GUMP;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class AccountController extends Controller
{

    function list(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface {

        $payload = User::find($this->userId())->with('option')->get()->toJson(JSON_PRETTY_PRINT);

        return $this->json($response, $payload);
    }

    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $data = $request->getParsedBody();

        $is_valid = GUMP::is_valid($data, OPTIONS_VALIDATION);
    }

    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->getBody()->write('Create');

        return $response;
    }

    public function remove(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {

        $userId = $this->userId();

        $user = User::find($userId);

        $user->artifacts()->delete();
        $user->configurations()->delete();
        $user->champions()->delete();
        $user->result()->delete();
        $user->option()->delete();

        $user->delete();

        return $this->json($response);
    }

    private function hash(string $pass, string $algo = 'sha256'): string
    {
        return hash($algo, $pass . $_ENV['APP_SECRET']);
    }

    private function proceedLogin(string $email, string $password): ?User
    {
        $user = User::where('email', $email)->first();

        if ($user === null) {
            var_dump('user not found');
            return null;
        }

        var_dump('user has been found');

        if ($user->verify_token !== null) {
            var_dump('verify token is not null');
            return null;
        }

        var_dump('verify token is null');

        $hashed = $this->hash($password);

        if ($user->password !== $hashed) {
            var_dump('invalid hash. Needed: ' . $user->password . ', sent: ' . $hashed);
            return null;
        }

        var_dump('user is validated!');

        return $user;
    }

    public function login(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $data = $request->getParsedBody();

        $is_valid = GUMP::is_valid($data, LOGIN_VALIDATION);

        if ($is_valid === true) {

            ['email' => $email, 'password' => $password] = GUMP::filter_input($data, LOGIN_FILTER);

            $user = $this->proceedLogin($email, $password);

            if ($user !== null) {

                $token = $this->hash($email . microtime(), 'md5');

                $user->token = $token;
                $user->save();

                return $this->json($response, ['token' => $token]);

            }

        }

        return $this->invalidQuery($response);
    }

    public function verify(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $is_valid = GUMP::is_valid($args, TOKEN_VALIDATION);

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
