<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\SentimentAnalyzer;
use App\Services\RecommendationService;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(SentimentAnalyzer::class, function ($app) {
            return new SentimentAnalyzer();
        });

        $this->app->singleton(RecommendationService::class, function ($app) {
            return new RecommendationService();
        });
    }

    public function boot(): void
    {
        //
    }
}
