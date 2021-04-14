<?php

declare(strict_types=1);

namespace Backend\Controller;

use Backend\Models\Artifact;
use Backend\Models\Champion;
use Backend\Models\Configuration;
use Backend\Models\Option;
use Backend\Models\Result;
use Backend\Models\User;
use GUMP;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class AccountController extends Controller
{
    /**
     * GET /account.
     */
    public function list(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $payload = User::owned($this->userId())->with('option')->first();

        return $this->json($response, $payload);
    }

    /**
     * PUT /account.
     */
    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $data = $request->getParsedBody();

        $is_valid = GUMP::is_valid($data, OPTIONS_VALIDATION);

        $userId = $this->userId();
        $user = User::owned($userId)->first();
        $options = Option::owned($userId)->first();

        if (true === $is_valid && $user) {
            $filtered = array_filter($data, function ($k) { return in_array($k, OPTIONS_FILTER); }, ARRAY_FILTER_USE_KEY);
            if (!$options) {
                $options = new Option();
                $options->user_id = $userId;
            }

            $options->update($filtered);
            $options->save();

            $user->language = $data['language'];
            $user->save();

            return $this->json($response, ['language' => $user->language, 'options' => $options]);
        }

        return $this->invalidQuery($response);
    }

    /**
     * POST /account.
     */
    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->getBody()->write('Create');

        return $response;
    }

    /**
     * DELETE /account.
     */
    public function remove(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $userId = $this->userId();

        $user = User::owned($userId);

        if ($user) {
            $artifacts = Artifact::owned($userId)->get();
            $configurations = Configuration::owned($userId)->get();
            $champions = Champion::owned($userId)->get();
            $results = Result::owned($userId)->get();
            $options = Option::owned($userId)->get();

            foreach ($artifacts as $item) {
                $item->delete();
            }

            foreach ($configurations as $item) {
                $item->delete();
            }

            foreach ($champions as $item) {
                $item->delete();
            }

            foreach ($results as $item) {
                $item->delete();
            }

            foreach ($results as $item) {
                $item->delete();
            }

            $user->delete();

            return $this->json($response, ['deleted_id' => $userId]);
        }

        return $this->invalidQuery($response);
    }

    /**
     * POST /account/login.
     */
    public function login(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $data = $request->getParsedBody();

        $is_valid = GUMP::is_valid($data, LOGIN_VALIDATION);

        if (true === $is_valid) {
            ['email' => $email, 'password' => $password] = GUMP::filter_input($data, LOGIN_FILTER);

            $user = $this->proceedLogin($email, $password);

            if (null !== $user) {
                $token = $this->hash($email.microtime(), 'md5');

                $user->token = $token;
                $user->save();

                return $this->json($response, ['token' => $token]);
            }
        }

        return $this->invalidQuery($response);
    }

    /**
     * GET /account/verify/:id.
     */
    public function verify(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $is_valid = GUMP::is_valid($args, TOKEN_VALIDATION);

        if (true === $is_valid) {
            $user = User::where('verify_token', $args['id'])->first();

            if ($user) {
                $user->verify_token = null;
                $user->save();

                return $this->json($response);
            }
        }

        return $this->invalidQuery($response);
    }

    /**
     * GET /account/reset/:email.
     */
    public function reset(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->getBody()->write('Reset');

        return $response;
    }

    /**
     * POST /account/import.
     */
    public function import(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->getBody()->write('Import');

        return $response;
    }

    /**
     * Generate the hash with the salt.
     */
    private function hash(string $pass, string $algo = 'sha256'): string
    {
        return hash($algo, $pass.$_ENV['APP_SECRET']);
    }

    /**
     * Try to login the user.
     */
    private function proceedLogin(string $email, string $password): ?User
    {
        $user = User::where('email', $email)->first();

        if (null === $user) {
            var_dump('user not found');

            return null;
        }

        var_dump('user has been found');

        if (null !== $user->verify_token) {
            var_dump('verify token is not null');

            return null;
        }

        var_dump('verify token is null');

        $hashed = $this->hash($password);

        if ($user->password !== $hashed) {
            var_dump('invalid hash. Needed: '.$user->password.', sent: '.$hashed);

            return null;
        }

        var_dump('user is validated!');

        return $user;
    }
}
