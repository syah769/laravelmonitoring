# Laravel Production Monitor Package - Composer Installation

## 🎯 **Option 1: Install from Packagist (Recommended)**

### Step 1: Publish Package to Packagist

1. **Create GitHub Repository:**
```bash
# Create new repo di GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/laravel-production-monitor.git
git push -u origin main
```

2. **Submit to Packagist:**
- Go to [packagist.org](https://packagist.org)
- Click "Submit"
- Enter your GitHub repo URL: `https://github.com/your-username/laravel-production-monitor`
- Click "Check"

3. **Install in Laravel:**
```bash
composer require your-username/laravel-production-monitor
```

---

## 🎯 **Option 2: Private Composer Repository**

### Step 1: Setup Private Repository

Create `composer.json` for your package:

```json
{
    "name": "your-company/laravel-production-monitor",
    "description": "Laravel package for production monitoring",
    "type": "library",
    "license": "MIT",
    "authors": [
        {
            "name": "Your Name",
            "email": "your.email@example.com"
        }
    ],
    "require": {
        "php": "^8.0",
        "illuminate/support": "^9.0|^10.0|^11.0",
        "guzzlehttp/guzzle": "^7.0"
    },
    "autoload": {
        "psr-4": {
            "LaravelProductionMonitor\\": "src/"
        }
    },
    "extra": {
        "laravel": {
            "providers": [
                "LaravelProductionMonitor\\ProductionMonitorServiceProvider"
            ]
        }
    },
    "minimum-stability": "stable"
}
```

### Step 2: Package Structure

```
laravel-production-monitor/
├── composer.json
├── README.md
├── src/
│   ├── ProductionMonitorServiceProvider.php
│   ├── MonitoringClient.php
│   ├── Middleware/
│   │   └── MonitoringMiddleware.php
│   ├── Console/
│   │   └── PingCommand.php
│   └── ErrorHandler.php
├── config/
│   └── production-monitor.php
└── tests/
```

### Step 3: Install in Laravel

Add to your Laravel project's `composer.json`:

```json
{
    "repositories": [
        {
            "type": "vcs",
            "url": "https://github.com/your-username/laravel-production-monitor.git"
        }
    ],
    "require": {
        "your-company/laravel-production-monitor": "^1.0"
    }
}
```

Then run:
```bash
composer install
```

---

## 🎯 **Option 3: Local Development Package**

### Step 1: Create Package Directory

```bash
# Dalam Laravel project awak
mkdir packages/laravel-production-monitor
cd packages/laravel-production-monitor
```

### Step 2: Create composer.json

```json
{
    "name": "local/laravel-production-monitor",
    "description": "Local Laravel monitoring package",
    "type": "library",
    "require": {
        "php": "^8.0",
        "illuminate/support": "^9.0|^10.0|^11.0",
        "guzzlehttp/guzzle": "^7.0"
    },
    "autoload": {
        "psr-4": {
            "LaravelProductionMonitor\\": "src/"
        }
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

### Step 3: Update Main composer.json

```json
{
    "repositories": [
        {
            "type": "path",
            "url": "./packages/laravel-production-monitor"
        }
    ],
    "require": {
        "local/laravel-production-monitor": "*"
    }
}
```

### Step 4: Install

```bash
composer install
```

---

## 🚀 **Complete Package Files**

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
            $this->registerCommands();
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
            $response = $this->client->post($this->apiUrl . '/functions/v1/api-metrics', [
                'json' => $metrics
            ]);
            
            Log::info('Metrics sent successfully', ['response' => $response->getStatusCode()]);
        } catch (RequestException $e) {
            Log::warning('Failed to send metrics to monitoring service', [
                'error' => $e->getMessage()
            ]);
        }
    }

    public function sendError(array $error)
    {
        try {
            $response = $this->client->post($this->apiUrl . '/functions/v1/api-errors', [
                'json' => $error
            ]);
            
            Log::info('Error sent successfully', ['response' => $response->getStatusCode()]);
        } catch (RequestException $e) {
            Log::warning('Failed to send error to monitoring service', [
                'error' => $e->getMessage()
            ]);
        }
    }

    public function ping()
    {
        try {
            $response = $this->client->post($this->apiUrl . '/functions/v1/api-ping');
            
            Log::info('Ping sent successfully', ['response' => $response->getStatusCode()]);
        } catch (RequestException $e) {
            Log::warning('Failed to ping monitoring service', [
                'error' => $e->getMessage()
            ]);
        }
    }
}
```

---

## 📋 **Installation Steps Summary**

### For Packagist (Public):
1. Create GitHub repo with package code
2. Submit to Packagist
3. `composer require your-username/laravel-production-monitor`

### For Private Repository:
1. Create private repo
2. Add repo to composer.json
3. `composer install`

### For Local Development:
1. Create packages folder
2. Add path repository
3. `composer install`

---

## ⚙️ **Laravel Configuration**

After installation:

```bash
# Publish config
php artisan vendor:publish --provider="LaravelProductionMonitor\ProductionMonitorServiceProvider"

# Add to .env
PRODUCTION_MONITOR_API_URL=https://your-dashboard-url.com
PRODUCTION_MONITOR_API_KEY=pm_your_api_key_here

# Setup cron job
php artisan schedule:work
```

Add to `app/Console/Kernel.php`:
```php
protected function schedule(Schedule $schedule)
{
    $schedule->command('monitor:ping')->everyFiveMinutes();
}
```

---

## 🎉 **Ready to Use!**

Lepas install, package akan automatically:
- ✅ Collect system metrics
- ✅ Track errors
- ✅ Send data to dashboard
- ✅ Ping every 5 minutes

**Pilih option mana yang awak prefer?**