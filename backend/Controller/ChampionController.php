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

    public static function CreateChampion($championData, $user_id) {
      $filtered = array_filter($championData, function ($k) { return in_array($k, CHAMPION_FILTER); }, ARRAY_FILTER_USE_KEY);

      $champion = new Champion();

      $champion->champion_ref = $filtered['champion_ref'];
      $champion->quality = $filtered['quality'];
      $champion->awaken = $filtered['awaken'];
      $champion->level = $filtered['level'];
      $champion->vault = $filtered['vault'];
      $champion->base_hp = $filtered['base_hp'];
      $champion->base_acc = $filtered['base_acc'];
      $champion->base_atk = $filtered['base_atk'];
      $champion->base_def = $filtered['base_def'];
      $champion->base_crate = $filtered['base_crate'];
      $champion->base_cdmg = $filtered['base_cdmg'];
      $champion->base_res = $filtered['base_res'];
      $champion->base_spd = $filtered['base_spd'];
      $champion->hp = $filtered['hp'];
      $champion->acc = $filtered['acc'];
      $champion->atk = $filtered['atk'];
      $champion->def = $filtered['def'];
      $champion->crate = $filtered['crate'];
      $champion->cdmg = $filtered['cdmg'];
      $champion->res = $filtered['res'];
      $champion->spd = $filtered['spd'];
      $champion->masteries = $filtered['masteries'];
      $champion->power = $filtered['power'];

      $champion->user_id = $user_id;

      $champion->save();

      return $champion;
    }
}
