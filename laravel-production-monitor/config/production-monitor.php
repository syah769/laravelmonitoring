<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Production Monitor Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for Laravel Production Monitor package
    |
    */

    'enabled' => env('PRODUCTION_MONITOR_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | API Configuration
    |--------------------------------------------------------------------------
    |
    | Your monitoring dashboard URL and API key
    |
    */

    'api_url' => env('PRODUCTION_MONITOR_API_URL', 'https://your-monitoring-dashboard.com'),

    'api_key' => env('PRODUCTION_MONITOR_API_KEY'),

    /*
    |--------------------------------------------------------------------------
    | Sampling Rate
    |--------------------------------------------------------------------------
    | 
    | To avoid overwhelming your monitoring service, you can set a sample rate.
    | 1.0 = collect all requests, 0.1 = collect 10% of requests
    |
    */

    'sample_rate' => env('PRODUCTION_MONITOR_SAMPLE_RATE', 0.1),

    /*
    |--------------------------------------------------------------------------
    | Error Reporting
    |--------------------------------------------------------------------------
    |
    | Enable/disable automatic error reporting to monitoring service
    |
    */

    'report_errors' => env('PRODUCTION_MONITOR_REPORT_ERRORS', true),

    /*
    |--------------------------------------------------------------------------
    | Ping Interval
    |--------------------------------------------------------------------------
    | 
    | How often to ping the monitoring service (in minutes)
    | Used by the scheduled command
    |
    */

    'ping_interval' => env('PRODUCTION_MONITOR_PING_INTERVAL', 5),

    /*
    |--------------------------------------------------------------------------
    | Performance Settings
    |--------------------------------------------------------------------------
    |
    | Configure performance monitoring settings
    |
    */

    'timeout' => env('PRODUCTION_MONITOR_TIMEOUT', 5),
    
    'retry_attempts' => env('PRODUCTION_MONITOR_RETRY_ATTEMPTS', 3),
];