<?php

namespace App\Kafka\Consumers;

use Illuminate\Support\Collection;
use JeroenG\Explorer\Application\Explored;
use Junges\Kafka\Contracts\ConsumerMessage;
use Junges\Kafka\Contracts\MessageConsumer;
use Junges\Kafka\Contracts\Consumer;
use Laravel\Scout\EngineManager;

class ModelEventConsumer extends Consumer
{
    private $engine;

    public function __construct()
    {
        $this->engine = app()->make(EngineManager::class)->engine();
    }

    public function handle(ConsumerMessage $message, MessageConsumer $consumer): void
    {
        $headers = $message->getHeaders();
        $body = $message->getBody();

        $logEntry = [
            'timestamp'    => $headers['timestamp'] ?? now()->toIso8601String(),
            'event_type'   => $headers['eventType'] ?? 'unknown',
            'model_class'  => $headers['modelClass'] ?? 'unknown',
            'model_id'     => $message->getKey(),
            'user_id'      => $headers['userId'] ?? null,
            'user_name'    => $headers['userName'] ?? 'System',
            'source_ip'    => $headers['sourceIp'] ?? '127.0.0.1',
            'data'         => $body,
        ];

        // Create a mock model object to pass to the engine's update method.
        $mockModel = $this->getMockModel($logEntry);
        // Use the engine directly to update the index.
        $this->engine->update(new Collection([$mockModel]));
    }

    protected function getMockModel(array $logData)
    {
        $mockModel = new class implements Explored {
            public string $index = 'audit_logs';
            public array $logData;

            public function searchableAs(): string
            {
                return $this->index;
            }

            public function toSearchableArray(): array
            {
                return $this->logData;
            }

            public function getScoutKey() 
            {
                return uniqid(); // We need a unique key for each log entry
            }

            public function getScoutKeyName()
            {
                return 'id';
            }

            public function mappableAs(): array
            {
                return [];
            }
        };

        $mockModel->logData = $logData;

        return $mockModel;
    }
}