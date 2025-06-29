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
        
        if ($memoryLimit <= 0) {
            return 0;
        }
        
        return ($memoryUsage / $memoryLimit) * 100;
    }

    protected function getCpuUsage()
    {
        // Simple CPU usage estimation using system load
        if (function_exists('sys_getloadavg')) {
            $load = sys_getloadavg();
            return isset($load[0]) ? min($load[0] * 100, 100) : 0;
        }
        
        return 0;
    }

    protected function getDiskUsage()
    {
        $path = storage_path();
        
        if (function_exists('disk_total_space') && function_exists('disk_free_space')) {
            $totalBytes = disk_total_space($path);
            $freeBytes = disk_free_space($path);
            
            if ($totalBytes && $freeBytes) {
                return (($totalBytes - $freeBytes) / $totalBytes) * 100;
            }
        }
        
        return 0;
    }

    protected function getActiveUsers()
    {
        try {
            // Count unique users in the last 5 minutes from sessions table
            if (\Schema::hasTable('sessions')) {
                return \DB::table('sessions')
                    ->where('last_activity', '>', now()->subMinutes(5)->timestamp)
                    ->distinct('user_id')
                    ->count();
            }
            
            // Fallback: count authenticated users
            return Auth::check() ? 1 : 0;
        } catch (\Exception $e) {
            return 0;
        }
    }

    protected function convertToBytes($value)
    {
        if (is_numeric($value)) {
            return (int) $value;
        }
        
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