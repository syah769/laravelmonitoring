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
            return true;
        } catch (RequestException $e) {
            Log::warning('Failed to send metrics to monitoring service', [
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    public function sendError(array $error)
    {
        try {
            $response = $this->client->post($this->apiUrl . '/functions/v1/api-errors', [
                'json' => $error
            ]);
            
            Log::info('Error sent successfully', ['response' => $response->getStatusCode()]);
            return true;
        } catch (RequestException $e) {
            Log::warning('Failed to send error to monitoring service', [
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    public function ping()
    {
        try {
            $response = $this->client->post($this->apiUrl . '/functions/v1/api-ping');
            
            Log::info('Ping sent successfully', ['response' => $response->getStatusCode()]);
            return true;
        } catch (RequestException $e) {
            Log::warning('Failed to ping monitoring service', [
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
}