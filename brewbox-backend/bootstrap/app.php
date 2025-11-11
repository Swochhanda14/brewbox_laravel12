<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        // Register admin middleware alias
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);

        // Handle unauthenticated requests
        $middleware->redirectGuestsTo(function (Request $request) {
            // Don't redirect API requests, just return null to get 401
            if ($request->is('api/*') || $request->expectsJson()) {
                return null;
            }
            // For web routes, redirect to login
            return route('login');
        });
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Handle API exceptions
        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->is('api/*')) {
                // Handle not found
                if ($e instanceof NotFoundHttpException) {
                    return response()->json([
                        'message' => 'Route not found',
                    ], 404);
                }

                // Handle access denied
                if ($e instanceof AccessDeniedHttpException) {
                    return response()->json([
                        'message' => 'Access denied',
                    ], 403);
                }

                // Handle authentication errors
                if ($e instanceof \Illuminate\Auth\AuthenticationException) {
                    return response()->json([
                        'message' => 'Unauthenticated',
                    ], 401);
                }

                // Generic error for API
                return response()->json([
                    'message' => $e->getMessage(),
                    'error' => get_class($e),
                ], 500);
            }
        });
    })->create();
