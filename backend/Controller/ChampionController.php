<?php
declare (strict_types = 1);

namespace Backend\Controller;

use Backend\Models\Champion;
use GUMP;
//use Illuminate\Database\Capsule\Manager as Capsule;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ChampionController extends Controller
{

    function list(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface {

        $payload = Champion::where('user_id', $this->userId())->get()->toJson(JSON_PRETTY_PRINT);

        return $this->json($response, $payload);
    }

    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $id = (int) $args['id'];

        $data = $request->getParsedBody();

        $is_valid = GUMP::is_valid($data, CHAMPION_VALIDATION);

        $champion = Champion::find($id);

        if($is_valid === true && $champion->user_id === $this->userId()) {
            $filtered = array_filter($data, function($k) { return in_array($k, CHAMPION_FILTER);  }, ARRAY_FILTER_USE_KEY);

            $champion->update($filtered);
            $champion->save();

            return $this->json($response, $champion->toJson(JSON_PRETTY_PRINT));
            
        }


        return $this->invalidQuery($response);
    }

    public function create(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $data = $request->getParsedBody();

        $is_valid = GUMP::is_valid($data, CHAMPION_VALIDATION);

        $response->getBody()->write(json_encode($is_valid));

        return $response;
    }

    public function remove(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {

        $id = (int) $args['id'];

        $champion = Champion::find($id)->with(['artifacts', 'configurations']);

        if ($champion->user_id === $this->userId()) {
            $champion->artifacts()->detach();
            $champion->configurations()->delete();
            $champion->delete();

            return $this->json($response);
        }

        return $this->invalidQuery($response);
    }
}
