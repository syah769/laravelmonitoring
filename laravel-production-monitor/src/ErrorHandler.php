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
               config('production-monitor.report_errors', true) &&
               app()->environment('production');
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
                'user_id' => auth()->id() ? (string) auth()->id() : null,
                'ip_address' => request()->ip() ?? 'unknown',
                'user_agent' => request()->userAgent() ?? 'unknown',
                'request_url' => request()->fullUrl() ?? 'unknown',
                'request_method' => request()->method() ?? 'unknown',
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
        
        if ($exception instanceof \InvalidArgumentException) {
            return 'warning';
        }
        
        return 'error';
    }
}