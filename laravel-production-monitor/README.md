# Laravel Production Monitor 📊

[![Latest Version on Packagist](https://img.shields.io/packagist/v/your-username/laravel-production-monitor.svg?style=flat-square)](https://packagist.org/packages/your-username/laravel-production-monitor)
[![Total Downloads](https://img.shields.io/packagist/dt/your-username/laravel-production-monitor.svg?style=flat-square)](https://packagist.org/packages/your-username/laravel-production-monitor)
[![License](https://img.shields.io/packagist/l/your-username/laravel-production-monitor.svg?style=flat-square)](https://packagist.org/packages/your-username/laravel-production-monitor)

Professional monitoring package for Laravel applications with real-time analytics, error tracking, and performance insights. Monitor your Laravel applications from a centralized dashboard with comprehensive metrics and alerts.

## ✨ Features

- 🔐 **Secure API Authentication** - Token-based authentication
- 📊 **Real-time Metrics** - Memory, CPU, response time tracking
- 🚨 **Error Monitoring** - Comprehensive error logging and alerts
- 📈 **Performance Analytics** - Detailed performance insights
- 🎯 **Easy Integration** - Simple setup with minimal configuration
- 📱 **Dashboard Integration** - Works with centralized monitoring dashboard
- 🔄 **Auto-Discovery** - Laravel package auto-discovery support
- ⚡ **Lightweight** - Minimal performance impact with sampling
- 🛡️ **Production Ready** - Built for production environments

## 🚀 Installation

Install the package via Composer:

```bash
composer require your-username/laravel-production-monitor
```

## ⚙️ Configuration

1. **Publish the configuration file:**
```bash
php artisan vendor:publish --provider="LaravelProductionMonitor\ProductionMonitorServiceProvider"
```

2. **Add environment variables to your `.env` file:**
```env
PRODUCTION_MONITOR_API_URL=https://your-dashboard-url.com
PRODUCTION_MONITOR_API_KEY=pm_your_api_key_here
PRODUCTION_MONITOR_ENABLED=true
PRODUCTION_MONITOR_SAMPLE_RATE=0.1
```

3. **Setup scheduled commands in `app/Console/Kernel.php`:**
```php
protected function schedule(Schedule $schedule)
{
    $schedule->command('monitor:ping')->everyFiveMinutes();
}
```

4. **Setup cron job:**
```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

## 🎯 Usage

The package automatically starts collecting data once configured. No additional code required!

### Available Commands

```bash
# Send ping to monitoring service
php artisan monitor:ping
```

### Configuration Options

All configuration options are available in `config/production-monitor.php`:

- `enabled` - Enable/disable monitoring
- `api_url` - Your monitoring dashboard URL
- `api_key` - Your project API key
- `sample_rate` - Data collection sample rate (0.1 = 10%)
- `report_errors` - Enable error reporting
- `timeout` - API request timeout
- `retry_attempts` - Number of retry attempts

## 📊 What Gets Monitored

### System Metrics
- Memory usage percentage
- CPU usage
- Disk usage
- Active users count
- Response time

### Error Tracking
- Exception details
- Stack traces
- User context
- Request information
- Error levels (critical, error, warning, info)

### Performance Data
- Request response times
- Memory peaks
- Database query performance
- HTTP status codes

## 🔧 Advanced Configuration

### Custom Sampling Rate
```php
// Collect data from 50% of requests
'sample_rate' => 0.5,
```

### Environment-Specific Settings
```php
// Only monitor in production
'enabled' => env('APP_ENV') === 'production',
```

### Error Level Filtering
The package automatically categorizes errors:
- **Critical**: Fatal errors and system failures
- **Error**: Application errors and exceptions
- **Warning**: Non-critical issues
- **Info**: Informational messages

## 🛡️ Security

- All data is transmitted securely via HTTPS
- API key authentication for all requests
- No sensitive data is logged
- Configurable data sampling to minimize exposure

## 📈 Performance Impact

- Minimal overhead with configurable sampling
- Asynchronous data transmission
- Efficient memory usage
- Non-blocking error reporting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This package is open-sourced software licensed under the [MIT license](LICENSE).

## 🆘 Support

If you discover any security vulnerabilities or bugs, please create an issue on GitHub.

## 🙏 Credits

- **Author**: [Your Name](https://github.com/your-username)
- **Contributors**: [All Contributors](https://github.com/your-username/laravel-production-monitor/contributors)

---

**Made with ❤️ for the Laravel community**