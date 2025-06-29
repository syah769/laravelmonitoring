# 🚀 Packagist Setup Guide (Public Repository)

## Step 1: Prepare GitHub Repository

1. **Create PUBLIC GitHub repository:**
```bash
# Create repo di GitHub dengan nama: laravel-production-monitor
# Set sebagai PUBLIC repository
```

2. **Upload package code:**
```bash
cd laravel-production-monitor
git init
git add .
git commit -m "Laravel Production Monitor Package v1.0.0"
git remote add origin https://github.com/YOUR-USERNAME/laravel-production-monitor.git
git push -u origin main
```

3. **Create release tag:**
```bash
git tag v1.0.0
git push origin v1.0.0
```

## Step 2: Submit to Packagist

1. **Go to [packagist.org](https://packagist.org)**
2. **Login/Register** dengan GitHub account
3. **Click "Submit"** button
4. **Enter repository URL:**
   ```
   https://github.com/YOUR-USERNAME/laravel-production-monitor
   ```
5. **Click "Check"** - Packagist akan validate package
6. **Click "Submit"** untuk publish

## Step 3: Install dalam Laravel Project

Sekarang package boleh install macam package lain:

```bash
composer require your-username/laravel-production-monitor
```

## Step 4: Configure Laravel

1. **Publish config:**
```bash
php artisan vendor:publish --provider="LaravelProductionMonitor\ProductionMonitorServiceProvider"
```

2. **Add to .env:**
```env
PRODUCTION_MONITOR_API_URL=https://your-dashboard-url.com
PRODUCTION_MONITOR_API_KEY=pm_your_api_key_here
PRODUCTION_MONITOR_ENABLED=true
```

3. **Setup cron:**
```bash
# Add to crontab
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

4. **Add to Kernel.php:**
```php
protected function schedule(Schedule $schedule)
{
    $schedule->command('monitor:ping')->everyFiveMinutes();
}
```

## Step 5: Test

```bash
php artisan monitor:ping
```

## 🎉 Done!

Package awak sekarang available publicly di Packagist! Anyone boleh install dengan:

```bash
composer require your-username/laravel-production-monitor
```

---

## 📋 Benefits Packagist:

✅ **Easy Installation** - Standard `composer require`  
✅ **Auto Updates** - Composer update akan dapat latest version  
✅ **Version Management** - Semantic versioning support  
✅ **Public Discovery** - Orang lain boleh jumpa package awak  
✅ **Statistics** - Download stats di Packagist  

## 🔄 Update Package:

Untuk release version baru:
```bash
# Update code
git add .
git commit -m "Update to v1.1.0"
git tag v1.1.0
git push origin main
git push origin v1.1.0
```

Packagist akan auto-update dalam beberapa minit!