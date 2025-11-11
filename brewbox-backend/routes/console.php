<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Run subscription check daily at midnight
Schedule::command('subscriptions:check')->daily();

// Or run every hour
// Schedule::command('subscriptions:check')->hourly();
