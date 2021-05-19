<?php

declare(strict_types=1);

namespace Backend\Controller;

use Backend\Models\Artifact;
use Backend\Models\Champion;
use Backend\Models\Configuration;
use GUMP;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ChampionController extends Controller
{
    /**
     * GET /champion.
     */
    public function list(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $payload = Champion::owned($this->userId())->get();

        return $this->json($response, $payload);
    }

    /**
     * PUT /champion/:id.
     */
    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $id = (int) $args['id'];

        $data = $request->getParsedBody();

        $is_valid = GUMP::is_valid($data, CHAMPION_VALIDATION);

        $champion = Champion::find($id);

        if (true === $is_valid && $champion->user_id === $this->userId()) {
            $filtered = array_filter($data, function ($k) { return in_array($k, CHAMPION_FILTER); }, ARRAY_FILTER_USE_KEY);

            $champion->update($filtered);
            $champion->save();

            return $this->json($response, $champion);
        }

        return $this->invalidQuery($response);
    }

    /**
     * POST /champion.
     */
    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $data = $request->getParsedBody();

        $is_valid = GUMP::is_valid($data, CHAMPION_VALIDATION);

        $response->getBody()->write(json_encode($is_valid));

        return $response;
    }

    /**
     * DELETE /champion/:id.
     */
    public function remove(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $id = (int) $args['id'];

        $champion = Champion::findOwned($this->userId(), $id)->first();

        if ($champion) {
            $artifacts = Artifact::owned($this->userId())->where('champion_id', $id)->get();
            $configurations = Configuration::owned($this->userId())->where('champion_id', $id)->get();

            foreach ($artifacts as $artifact) {
                $artifact->champion_id = null;
                $artifact->save();
            }

            foreach ($configurations as $configuration) {
                $configuration->delete();
            }

            $champion->delete();

            return $this->json($response, ['deleted_id' => $id]);
        }

        return $this->invalidQuery($response);
    }
}
