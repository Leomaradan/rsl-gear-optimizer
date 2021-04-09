<?php
declare (strict_types = 1);

use Backend\Service;
use DI\Container;
use Dotenv\Dotenv;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';

session_start();

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$dotenv->required(['DB_PASS']);

$dotenv->required(['DB_HOST', 'DB_NAME', 'DB_USER'])->notEmpty();

$container = new Container();

$container->set('Service', function () {
    return new Service($_ENV['DB_HOST'], $_ENV['DB_NAME'], $_ENV['DB_USER'], $_ENV['DB_PASS']);
});

// Set container to create App with on AppFactory
AppFactory::setContainer($container);
$app = AppFactory::create();

$routes = require __DIR__ . '/backend/router.php';
$routes($app);

// Define Custom Error Handler
$customErrorHandler = function (
    ServerRequestInterface $request,
    Throwable $exception,
    bool $displayErrorDetails,
    bool $logErrors,
    bool $logErrorDetails //,
    //?LoggerInterface $logger = null
) use ($app) {
    //$logger->error($exception->getMessage());

    $payload = ['error' => $exception->getMessage()];

    $response = $app->getResponseFactory()->createResponse();
    $response->getBody()->write(
        json_encode($payload, JSON_UNESCAPED_UNICODE)
    );

    return $response;
};

$errorMiddleware = $app->addErrorMiddleware(true, true, true);
$errorMiddleware->setDefaultErrorHandler($customErrorHandler);

$app->run();
