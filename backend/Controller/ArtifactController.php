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

    public static function CreateArtifact(array $artifactData, int $userId, array $championsIds = [])
    {
        $filtered = array_filter($artifactData, function ($k) { return in_array($k, ARTIFACT_FILTER); }, ARRAY_FILTER_USE_KEY);

        foreach ($filtered['sub_stats'] as $key => $value) {
            $filteredSub = array_filter($value, function ($k) { return in_array($k, ARTIFACT_FILTER_SUBSTAT); }, ARRAY_FILTER_USE_KEY);
            $filtered['sub_stats'][$key] = $filteredSub;
        }

        $artifact = new Artifact();

        $artifact->slot = $filtered['slot'];

        $artifact->rarity = $filtered['rarity'];
        $artifact->quality = $filtered['quality'];
        $artifact->level = $filtered['level'];
        $artifact->main_stat = $filtered['main_stats'];
        $artifact->main_value = $filtered['main_value'];
        $artifact->sub_stats = $filtered['sub_stats'];
        $artifact->power = $filtered['power'];

        //var_dump($filtered['sets']);
        //var_dump($filtered['clan']);

        if (isset($filtered['sets'])) {
            $artifact->sets = $filtered['sets'];
        }

        if (isset($filtered['clan'])) {
            $artifact->clan = $filtered['clan'];
        }

        if (isset($artifactData['champion_id'])) {
            $artifact->champion_id = $championsIds[$artifactData['champion_id']];
        }

        $artifact->user_id = $userId;

        $artifact->save();

        return $artifact;
    }
}
