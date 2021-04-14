<?php
declare (strict_types = 1);

namespace Backend\Middleware;

use PDO;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Psr7\Response;
use Backend\Models\User;

class TokenAuth
{

    protected $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * Check against the DB if the token is valid
     *
     * @param string $token
     */
    public function authenticate($token)
    {
        $user = User::where('token', $token)->first();

        if(!$user) {
            return null;
        }

        if($user->verify_token) {
            return null;
        }

        return $user;
    }

    public function parseToken($tokenHeader)
    {
        $format = preg_match_all('/Bearer\s+([a-f0-9]{32})$/i', $tokenHeader, $matches, PREG_SET_ORDER, 0);

        if ($format === 0) {
            return false;
        }

        return $matches[0][1];

    }

    public function __invoke(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        return $this->process($request, $handler);
    }

    private function reject()
    {
        $response = new Response();
        $response->getBody()->write(json_encode([['message' => 'Unauthorized']]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
    }

    /**
     * Call
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler)
    {
        //Get the token sent from jquery
        $tokenRequest = $request->getHeader('Authorization');

        if (count($tokenRequest) === 0) {
            return $this->reject();
        }

        $token = $this->parseToken($tokenRequest[0]);

        if (!$token) {
            return $this->reject();
        }

        $needUser = true;

        if (isset($_SESSION['user'])) {
            if ($_SESSION['user']['token'] === $token) {
                //$needUser = false;
            }
        }

        if ($needUser) {
            $user = $this->authenticate($token);

            if (!$user) {
                return $this->reject();
            }


            $_SESSION['user'] = $user;
        }

        return $handler->handle($request);
    }

}