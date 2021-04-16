<?php

declare(strict_types=1);

namespace Backend\Controller;

use Backend\Models\Artifact;
use Backend\Models\Champion;
use Backend\Models\Configuration;
use Backend\Models\Option;
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
            Artifact::owned($userId)->delete();
            Configuration::owned($userId)->delete();
            Champion::owned($userId)->delete();

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

                $options = Option::owned($user->id)->first();
                $user->token = $token;
                $user->save();

                return $this->json($response, [
                    'token' => $token,
                    'email' => $user->email,
                    'username' => $user->username,
                    'language' => $user->language,
                    'option' => $options,
                ]);
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
        $data = $request->getParsedBody();

        $is_valid = GUMP::is_valid($data, [
            'champions' => 'required',
            'artifacts' => 'required',
        ]);

        $errors = false;
        $errorsMessage = [];

        $champions = [];
        $championsTempId = [];
        $artifacts = [];

        $payloadChampions = [];
        $payloadArtifacts = [];

        if (true === $is_valid) {
            foreach ($data['champions'] as $championData) {
                $is_valid_champion = GUMP::is_valid($championData, CHAMPION_VALIDATION);

                if (true === $is_valid_champion) {
                    $champions[] = $championData;
                } else {
                    $errors = true;
                    $errorsMessage[] = $is_valid_champion;
                }
            }

            //var_dump($data['artifacts']);
            foreach ($data['artifacts'] as $artifactData) {
                //var_dump(json_encode($artifactData));

                if ('' === $artifactData['clan']) {
                    unset($artifactData['clan']);
                }

                if ('' === $artifactData['sets']) {
                    unset($artifactData['sets']);
                }

                $is_valid_artifact = GUMP::is_valid($artifactData, ARTIFACT_VALIDATION);

                if (!isset($artifactData['clan']) && !isset($artifactData['sets'])) {
                    $is_valid_artifact = 'Missing both clan AND artifact';
                }

                $validSubStats = true;

                foreach ($artifactData['sub_stats'] as $subStat) {
                    $is_valid_artifact_substat = GUMP::is_valid($subStat, ARTIFACT_VALIDATION_SUBSTAT);

                    if (true !== $is_valid_artifact_substat) {
                        $errorsMessage[] = ['message' => $is_valid_artifact_substat, 'data' => $artifactData];
                        $validSubStats = false;
                    }
                }

                if (true === $is_valid_artifact && $validSubStats) {
                    $artifacts[] = $artifactData;
                } else {
                    $errors = true;
                    $errorsMessage[] = ['message' => $is_valid_artifact, 'data' => $artifactData];
                }
            }

            if ($errors) {
                return $this->invalidQuery($response, $errorsMessage);
            }

            Configuration::owned($this->userId())->delete();
            Artifact::owned($this->userId())->delete();
            Champion::owned($this->userId())->delete();

            foreach ($champions as $championData) {
                $champion = ChampionController::CreateChampion($championData, $this->userId());

                $championsTempId[$championData['id']] = $champion->id;
                $payloadChampions[] = $champion;
            }

            foreach ($artifacts as $artifactData) {
                $artifact = ArtifactController::CreateArtifact($artifactData, $this->userId(), $championsTempId);

                $payloadArtifacts[] = $artifact;
            }

            return $this->json($response, ['artifacts' => $payloadArtifacts, 'champions' => $payloadChampions]);
        }

        return $this->invalidQuery($response);
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
            return null;
        }

        if (null !== $user->verify_token) {
            return null;
        }

        $hashed = $this->hash($password);

        if ($user->password !== $hashed) {
            return null;
        }

        return $user;
    }
}
