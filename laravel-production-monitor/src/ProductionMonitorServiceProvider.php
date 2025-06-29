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
            $this->registerCommands();
            $this->registerErrorHandler();
        }
    }

    protected function registerMiddleware()
    {
        $kernel = $this->app->make(\Illuminate\Contracts\Http\Kernel::class);
        $kernel->pushMiddleware(Middleware\MonitoringMiddleware::class);
    }

    protected function registerCommands()
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                Console\PingCommand::class,
            ]);
        }
    }

    protected function registerErrorHandler()
    {
        // Register custom error handler
        $this->app->singleton(
            \Illuminate\Contracts\Debug\ExceptionHandler::class,
            ErrorHandler::class
        );
    }
}