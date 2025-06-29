# Installation Guide - Private Repository

## Step 1: Create GitHub Repository

1. **Create new private repository on GitHub:**
   - Repository name: `laravel-production-monitor`
   - Set as **Private**
   - Add README.md

2. **Upload package code:**
```bash
cd laravel-production-monitor
git init
git add .
git commit -m "Initial Laravel monitoring package"
git remote add origin https://github.com/YOUR-USERNAME/laravel-production-monitor.git
git push -u origin main
```

## Step 2: Install in Laravel Project

1. **Add repository to your Laravel project's `composer.json`:**
```json
{
    "repositories": [
        {
            "type": "vcs",
            "url": "https://github.com/YOUR-USERNAME/laravel-production-monitor.git"
        }
    ],
    "require": {
        "your-company/laravel-production-monitor": "^1.0"
    }
}
```

2. **Install the package:**
```bash
composer install
```

## Step 3: Configure Laravel

1. **Publish configuration:**
```bash
php artisan vendor:publish --provider="LaravelProductionMonitor\ProductionMonitorServiceProvider"
```

2. **Add to `.env`:**
```env
PRODUCTION_MONITOR_API_URL=https://your-dashboard-url.com
PRODUCTION_MONITOR_API_KEY=pm_your_api_key_here
PRODUCTION_MONITOR_ENABLED=true
PRODUCTION_MONITOR_SAMPLE_RATE=0.1
```

3. **Setup cron job:**
```bash
# Add to crontab
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

4. **Add to `app/Console/Kernel.php`:**
```php
protected function schedule(Schedule $schedule)
{
    $schedule->command('monitor:ping')->everyFiveMinutes();
}
```

## Step 4: Test Installation

```bash
# Test ping command
php artisan monitor:ping

# Check if middleware is working
# Visit your Laravel app - metrics should be collected automatically
```

## Done! 🎉

Your Laravel application is now connected to the monitoring dashboard!