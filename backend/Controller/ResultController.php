<?php

declare(strict_types=1);

namespace Backend\Controller;

use Backend\Models\Result;
use Backend\Models\User;
use GUMP;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ResultController extends Controller
{
    /**
     * GET /result.
     */
    public function list(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $payload = Result::owned($this->userId())->get();

        return $this->json($response, $payload);
    }

    /**
     * PUT /result.
     */
    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $is_valid = GUMP::is_valid($args, RESULT_VALIDATION);

        $isValidArtifact = GUMP::is_valid($args, ARTIFACT_VALIDATION);

        var_dump($is_valid);

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
}
