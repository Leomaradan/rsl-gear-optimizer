<?php

declare(strict_types=1);

namespace Backend\Controller;

use Backend\Models\Artifact;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ArtifactController extends Controller
{
    private $integerProperties = ['id', 'quality', 'level', 'main_value', 'power'];

    /**
     * GET /artifact.
     */
    public function list(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $payload = Artifact::owned($this->userId())->get();

        return $this->json($response, $payload);
    }

    /**
     * PUT /artifact/:id.
     */
    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->getBody()->write('Update');

        return $response;
    }

    /**
     * POST /artifact.
     */
    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->getBody()->write('Create');

        return $response;
    }

    /**
     * DELETE /artifact/:id.
     */
    public function remove(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $id = (int) $args['id'];

        $artifact = Artifact::findOwned($this->userId(), $id)->first();

        if ($artifact) {
            $artifact->delete();

            return $this->json($response, ['deleted_id' => $id]);
        }

        return $this->invalidQuery($response);
    }
}
