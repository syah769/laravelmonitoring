<?php

namespace LaravelProductionMonitor\Console;

use Illuminate\Console\Command;
use LaravelProductionMonitor\MonitoringClient;

class PingCommand extends Command
{
    protected $signature = 'monitor:ping';
    protected $description = 'Send ping to monitoring service to indicate application is alive';

    public function handle(MonitoringClient $client)
    {
        $this->info('Sending ping to monitoring service...');
        
        $success = $client->ping();
        
        if ($success) {
            $this->info('✅ Ping sent successfully');
        } else {
            $this->error('❌ Failed to send ping');
        }
        
        return $success ? 0 : 1;
    }
}