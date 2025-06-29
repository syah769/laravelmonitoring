# Laravel Production Monitor Package

This package allows you to send monitoring data from your Laravel applications to the centralized monitoring dashboard.

## Installation

1. Create a new directory for the package:
```bash
mkdir laravel-production-monitor
cd laravel-production-monitor
```

2. Create the package structure:

### composer.json
```json
{
    "name": "your-username/laravel-production-monitor",
    "description": "Laravel package for production monitoring",
    "type": "library",
    "license": "MIT",
    "autoload": {
        "psr-4": {
            "LaravelProductionMonitor\\": "src/"
        }
    },
    "require": {
        "php": "^8.0",
        "illuminate/support": "^9.0|^10.0|^11.0",
        "guzzlehttp/guzzle": "^7.0"
    },
    "extra": {
        "laravel": {
            "providers": [
                "LaravelProductionMonitor\\ProductionMonitorServiceProvider"
            ]
        }
    }
}
```

### src/ProductionMonitorServiceProvider.php
```php
<?php

namespace LaravelProductionMonitor;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class ProductionMonitorServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->mergeConfigFrom(__DIR__.'/../config/production-monitor.php', 'production-monitor');
        
        $this->app->singleton(MonitoringClient::class, function ($app) {
            return new MonitoringClient(
                config('production-monitor.api_url'),
                config('production-monitor.api_key')
            );
        });
    }

    public function boot()
    {
        $this->publishes([
            __DIR__.'/../config/production-monitor.php' => config_path('production-monitor.php'),
        ], 'config');

        if (config('production-monitor.enabled', true)) {
            $this->registerMiddleware();
            $this->registerErrorHandler();
        }
    }

    protected function registerMiddleware()
    {
        $kernel = $this->app->make(\Illuminate\Contracts\Http\Kernel::class);
        $kernel->pushMiddleware(Middleware\MonitoringMiddleware::class);
    }

    protected function registerErrorHandler()
    {
        $this->app->singleton(
            \Illuminate\Contracts\Debug\ExceptionHandler::class,
            ErrorHandler::class
        );
    }
}
```

### src/MonitoringClient.php
```php
<?php

namespace LaravelProductionMonitor;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;

class MonitoringClient
{
    protected $client;
    protected $apiUrl;
    protected $apiKey;

    public function __construct($apiUrl, $apiKey)
    {
        $this->apiUrl = rtrim($apiUrl, '/');
        $this->apiKey = $apiKey;
        $this->client = new Client([
            'timeout' => 5,
            'headers' => [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ]
        ]);
    }

    public function sendMetrics(array $metrics)
    {
        try {
            $this->client->post($this->apiUrl . '/api/metrics', [
                'json' => $metrics
            ]);
        } catch (RequestException $e) {
            Log::warning('Failed to send metrics to monitoring service', [
                'error' => $e->getMessage()
            ]);
        }
    }

    public function sendError(array $error)
    {
        try {
            $this->client->post($this->apiUrl . '/api/errors', [
                'json' => $error
            ]);
        } catch (RequestException $e) {
            Log::warning('Failed to send error to monitoring service', [
                'error' => $e->getMessage()
            ]);
        }
    }

    public function ping()
    {
        try {
            $this->client->post($this->apiUrl . '/api/ping');
        } catch (RequestException $e) {
            Log::warning('Failed to ping monitoring service', [
                'error' => $e->getMessage()
            ]);
        }
    }
}
```

### src/Middleware/MonitoringMiddleware.php
```php
<?php

namespace LaravelProductionMonitor\Middleware;

use Closure;
use Illuminate\Http\Request;
use LaravelProductionMonitor\MonitoringClient;
use Illuminate\Support\Facades\Auth;

class MonitoringMiddleware
{
    protected $monitoringClient;

    public function __construct(MonitoringClient $monitoringClient)
    {
        $this->monitoringClient = $monitoringClient;
    }

    public function handle(Request $request, Closure $next)
    {
        $startTime = microtime(true);
        $startMemory = memory_get_usage(true);

        $response = $next($request);

        // Only collect data for a sample of requests to avoid overwhelming the system
        if ($this->shouldCollectData()) {
            $this->collectMetrics($request, $response, $startTime, $startMemory);
        }

        return $response;
    }

    protected function shouldCollectData()
    {
        $sampleRate = config('production-monitor.sample_rate', 0.1);
        return mt_rand() / mt_getrandmax() < $sampleRate;
    }

    protected function collectMetrics($request, $response, $startTime, $startMemory)
    {
        $endTime = microtime(true);
        $responseTime = ($endTime - $startTime) * 1000; // Convert to milliseconds

        $metrics = [
            'timestamp' => now()->toISOString(),
            'memory_usage' => $this->getMemoryUsagePercentage(),
            'cpu_usage' => $this->getCpuUsage(),
            'disk_usage' => $this->getDiskUsage(),
            'active_users' => $this->getActiveUsers(),
            'response_time' => $responseTime,
        ];

        $this->monitoringClient->sendMetrics($metrics);
    }

    protected function getMemoryUsagePercentage()
    {
        $memoryUsage = memory_get_usage(true);
        $memoryLimit = $this->convertToBytes(ini_get('memory_limit'));
        
        return ($memoryUsage / $memoryLimit) * 100;
    }

    protected function getCpuUsage()
    {
        // Simple CPU usage estimation
        $load = sys_getloadavg();
        return isset($load[0]) ? $load[0] * 100 : 0;
    }

    protected function getDiskUsage()
    {
        $totalBytes = disk_total_space('/');
        $freeBytes = disk_free_space('/');
        
        if ($totalBytes && $freeBytes) {
            return (($totalBytes - $freeBytes) / $totalBytes) * 100;
        }
        
        return 0;
    }

    protected function getActiveUsers()
    {
        // Count unique users in the last 5 minutes
        // This is a simple implementation - you might want to use Redis or cache
        return \DB::table('sessions')
            ->where('last_activity', '>', now()->subMinutes(5)->timestamp)
            ->distinct('user_id')
            ->count();
    }

    protected function convertToBytes($value)
    {
        $unit = strtolower(substr($value, -1));
        $value = (int) substr($value, 0, -1);

        switch ($unit) {
            case 'g': $value *= 1024;
            case 'm': $value *= 1024;
            case 'k': $value *= 1024;
        }

        return $value;
    }
}
```

### src/ErrorHandler.php
```php
<?php

namespace LaravelProductionMonitor;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class ErrorHandler extends ExceptionHandler
{
    protected $monitoringClient;

    public function __construct(\Illuminate\Contracts\Container\Container $container)
    {
        parent::__construct($container);
        $this->monitoringClient = $container->make(MonitoringClient::class);
    }

    public function report(Throwable $exception)
    {
        parent::report($exception);

        if ($this->shouldReportToMonitoring($exception)) {
            $this->reportToMonitoring($exception);
        }
    }

    protected function shouldReportToMonitoring(Throwable $exception)
    {
        // Only report certain types of exceptions
        return !$this->shouldntReport($exception) && 
               config('production-monitor.report_errors', true);
    }

    protected function reportToMonitoring(Throwable $exception)
    {
        try {
            $errorData = [
                'timestamp' => now()->toISOString(),
                'level' => $this->getErrorLevel($exception),
                'message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTraceAsString(),
                'user_id' => auth()->id(),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'request_url' => request()->fullUrl(),
                'request_method' => request()->method(),
            ];

            $this->monitoringClient->sendError($errorData);
        } catch (\Exception $e) {
            // Don't let monitoring errors break the application
            \Log::warning('Failed to send error to monitoring service', [
                'error' => $e->getMessage()
            ]);
        }
    }

    protected function getErrorLevel(Throwable $exception)
    {
        // Determine error level based on exception type
        if ($exception instanceof \Error) {
            return 'critical';
        }
        
        if ($exception instanceof \ErrorException) {
            return 'error';
        }
        
        return 'warning';
    }
}
```

### config/production-monitor.php
```php
<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Production Monitor Settings
    |--------------------------------------------------------------------------
    */

    'enabled' => env('PRODUCTION_MONITOR_ENABLED', true),

    'api_url' => env('PRODUCTION_MONITOR_API_URL', 'https://your-monitoring-dashboard.com'),

    'api_key' => env('PRODUCTION_MONITOR_API_KEY'),

    /*
    |--------------------------------------------------------------------------
    | Sampling Rate
    |--------------------------------------------------------------------------
    | 
    | To avoid overwhelming your monitoring service, you can set a sample rate.
    | 1.0 = collect all requests, 0.1 = collect 10% of requests
    */

    'sample_rate' => env('PRODUCTION_MONITOR_SAMPLE_RATE', 0.1),

    /*
    |--------------------------------------------------------------------------
    | Error Reporting
    |--------------------------------------------------------------------------
    */

    'report_errors' => env('PRODUCTION_MONITOR_REPORT_ERRORS', true),

    /*
    |--------------------------------------------------------------------------
    | Ping Interval
    |--------------------------------------------------------------------------
    | 
    | How often to ping the monitoring service (in minutes)
    */

    'ping_interval' => env('PRODUCTION_MONITOR_PING_INTERVAL', 5),
];
```

### src/Console/PingCommand.php
```php
<?php

namespace LaravelProductionMonitor\Console;

use Illuminate\Console\Command;
use LaravelProductionMonitor\MonitoringClient;

class PingCommand extends Command
{
    protected $signature = 'monitor:ping';
    protected $description = 'Send ping to monitoring service';

    public function handle(MonitoringClient $client)
    {
        $client->ping();
        $this->info('Ping sent to monitoring service');
    }
}
```

## Usage in Laravel Application

1. Install the package:
```bash
composer require your-username/laravel-production-monitor
```

2. Publish the config:
```bash
php artisan vendor:publish --provider="LaravelProductionMonitor\ProductionMonitorServiceProvider"
```

3. Add to your `.env`:
```env
PRODUCTION_MONITOR_API_URL=https://your-monitoring-dashboard.com
PRODUCTION_MONITOR_API_KEY=pm_your_api_key_here
PRODUCTION_MONITOR_SAMPLE_RATE=0.1
```

4. Set up a cron job for pinging:
```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

Add to `app/Console/Kernel.php`:
```php
protected function schedule(Schedule $schedule)
{
    $schedule->command('monitor:ping')
             ->everyFiveMinutes();
}
```

The package will automatically start collecting and sending monitoring data to your centralized dashboard!