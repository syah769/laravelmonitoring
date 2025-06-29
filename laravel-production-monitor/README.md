# Laravel Production Monitor

Professional monitoring package for Laravel applications with real-time analytics, error tracking, and performance insights.

## Features

- 🔐 **Secure API Authentication** - Token-based authentication
- 📊 **Real-time Metrics** - Memory, CPU, response time tracking
- 🚨 **Error Monitoring** - Comprehensive error logging and alerts
- 📈 **Performance Analytics** - Detailed performance insights
- 🎯 **Easy Integration** - Simple setup with minimal configuration
- 📱 **Dashboard Integration** - Works with centralized monitoring dashboard

## Installation

```bash
composer require your-company/laravel-production-monitor
```

## Quick Setup

1. **Publish Configuration:**
```bash
php artisan vendor:publish --provider="LaravelProductionMonitor\ProductionMonitorServiceProvider"
```

2. **Add Environment Variables:**
```env
PRODUCTION_MONITOR_API_URL=https://your-dashboard-url.com
PRODUCTION_MONITOR_API_KEY=pm_your_api_key_here
PRODUCTION_MONITOR_ENABLED=true
PRODUCTION_MONITOR_SAMPLE_RATE=0.1
```

3. **Setup Cron Job:**
```bash
# Add to crontab
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

4. **Add to Kernel Schedule:**
```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    $schedule->command('monitor:ping')->everyFiveMinutes();
}
```

## Usage

The package automatically starts collecting data once configured. No additional code required!

## Configuration

All configuration options are available in `config/production-monitor.php`:

- `enabled` - Enable/disable monitoring
- `api_url` - Your monitoring dashboard URL
- `api_key` - Your project API key
- `sample_rate` - Data collection sample rate (0.1 = 10%)
- `report_errors` - Enable error reporting

## Support

For issues or questions, please check the documentation or create an issue.

## License

MIT License