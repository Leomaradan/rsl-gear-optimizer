<?php

declare(strict_types=1);

namespace Backend\Controller;

use Backend\Models\Configuration;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ConfigController extends Controller
{
    /**
     * GET /config.
     */
    public function list(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $payload = Configuration::owned($this->userId())->get();

        return $this->json($response, $payload);
    }

    /**
     * PUT /config/:id.
     */
    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->getBody()->write('Update');

        return $response;
    }

    /**
     * POST /config.
     */
    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $response->getBody()->write('Create');

        return $response;
    }

    /**
     * DELETE /config/:id.
     */
    public function remove(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $id = (int) $args['id'];

        $config = Configuration::findOwned($this->userId(), $id)->first();

        if ($config) {
            $config->delete();

            return $this->json($response, ['deleted_id' => $id]);
        }

        return $this->invalidQuery($response);
    }
}
