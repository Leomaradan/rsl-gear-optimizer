<?php

declare(strict_types=1);

use Apix\Log\Logger\File as ApixLogger;
use Backend\Container\EloquentContainer;
use DI\Container;
use Dotenv\Dotenv;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpNotFoundException;
use Slim\Factory\AppFactory;
use Tuupola\Middleware\CorsMiddleware;

require __DIR__.'/vendor/autoload.php';

require __DIR__.'/backend/validation.php';

session_start();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Origin, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$dotenv->required(['DB_PASS']);

$dotenv->required(['DB_HOST', 'DB_NAME', 'DB_USER', 'APP_SECRET'])->notEmpty();

$container = new Container();

$container->set('Service', function () {
    return new EloquentContainer($_ENV['DB_HOST'], $_ENV['DB_NAME'], $_ENV['DB_USER'], $_ENV['DB_PASS']);
});

$container->set('logger', function () {
    if (!file_exists(__DIR__.'/temp')) {
        mkdir(__DIR__.'/temp');
    }

    return new ApixLogger(__DIR__.'/temp/server.log');
});

// Set container to create App with on AppFactory
//AppFactory::setContainer($container);
$app = AppFactory::createFromContainer($container);

$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

/*$app->add(new CorsMiddleware([
    'origin' => ['*'],
    'methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    'headers.allow' => ['Authorization'],
    'headers.expose' => [],
    'credentials' => true,
    'cache' => 0,
]));*/

/*$app->add(function ($request, $handler) {
    $response = $handler->handle($request);

    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Credentials', 'true')
        ->withHeader('Access-Control-Allow-Origin-Headers', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    ;
});*/

$routes = require __DIR__.'/backend/router.php';
$routes($app);

/*$app->map(['GET', 'POST', 'PUT', 'DELETE'], '/{routes:.+}', function ($request, $response) {
    throw new HttpNotFoundException($request);
});*/

$container->get('Service');

// Define Custom Error Handler
$customErrorHandler = function (
    ServerRequestInterface $request,
    Throwable $exception,
) use ($app, $container) {
    $logger = $container->get('logger');
    $logger->error($exception->getMessage());

    throw new Exception($exception->getMessage());
    $payload = ['error' => 'Server Error'];

    $response = $app->getResponseFactory()->createResponse();
    $response->getBody()->write(
        json_encode($payload, JSON_UNESCAPED_UNICODE)
    );

    return $response->withStatus(500);
};

$app->addBodyParsingMiddleware();

//$app->addRoutingMiddleware();

//$errorMiddleware = $app->addErrorMiddleware(true, true, true);
//$errorMiddleware->setDefaultErrorHandler($customErrorHandler);

$app->run();
