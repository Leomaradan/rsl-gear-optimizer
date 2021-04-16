<?php

declare(strict_types=1);

use Backend\Controller\AccountController;
use Backend\Controller\ArtifactController;
use Backend\Controller\ChampionController;
use Backend\Controller\ConfigController;
use Backend\Controller\ResultController;
use Backend\Middleware\TokenAuth;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {
    $app->get('/', function (Request $request, Response $response) {
        $response->getBody()->write('{}');

        return $response->withHeader('Content-Type', 'application/json');
    });

    $app->group('/account', function (Group $group) {
        $group->get('', AccountController::class.':list')->add(TokenAuth::class);
        $group->put('', AccountController::class.':update')->add(TokenAuth::class);
        $group->post('', AccountController::class.':create');
        $group->delete('', AccountController::class.':remove')->add(TokenAuth::class);
        $group->post('/login', AccountController::class.':login');
        $group->get('/verify/{id:[0-9a-f]+}', AccountController::class.':verify');
        $group->get('/reset/{email}', AccountController::class.':reset');
        $group->post('/import', AccountController::class.':import')->add(TokenAuth::class);
    });

    $app->group('/champion', function (Group $group) {
        $group->get('', ChampionController::class.':list');
        $group->put('/{id:[0-9]+}', ChampionController::class.':update');
        $group->post('', ChampionController::class.':create');
        $group->delete('/{id:[0-9]+}', ChampionController::class.':remove');
    })->add(TokenAuth::class);

    $app->group('/artifact', function (Group $group) {
        $group->get('', ArtifactController::class.':list');
        $group->put('/{id:[0-9]+}', ArtifactController::class.':update');
        $group->post('', ArtifactController::class.':create');
        $group->delete('/{id:[0-9]+}', ArtifactController::class.':remove');
    })->add(TokenAuth::class);

    $app->group('/config', function (Group $group) {
        $group->get('', ConfigController::class.':list');
        $group->put('/{id:[0-9]+}', ConfigController::class.':update');
        $group->post('', ConfigController::class.':create');
        $group->delete('/{id:[0-9]+}', ConfigController::class.':remove');
    })->add(TokenAuth::class);

    /* $app->group('/result', function (Group $group) {
        $group->get('', ResultController::class.':list');
        $group->put('', ResultController::class.':update');
    })->add(TokenAuth::class); */
};
