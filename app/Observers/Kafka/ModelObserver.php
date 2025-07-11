<?php

namespace App\Observers\Kafka;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Junges\Kafka\Facades\Kafka;
use Junges\Kafka\Message\Message;

class ModelObserver
{
    public function created(Model $model): void
    {
        $this->sendMessage('created', $model, $model->toArray());
    }

    public function updated(Model $model): void
    {
        $body = [
            'before' => array_intersect_key($model->getOriginal(), $model->getChanges()),
            'after'  => $model->getChanges(),
        ];
        $this->sendMessage('updated', $model, $body);
    }

    public function deleted(Model $model): void
    {
        $this->sendMessage('deleted', $model, $model->toArray());
    }

    private function sendMessage(string $eventType, Model $model, array $body): void
    {
        $topic = 'audit_events';

        $message = new Message(
            headers: [
                'eventType' => $eventType,
                'modelClass' => get_class($model),
                'userId' => Auth::id(),
                'userName' => Auth::user()?->name,
                'sourceIp' => Request::ip(),
                'timestamp' => now()->toIso8601String(),
            ],
            body: $body,
            key: (string) $model->getKey()
        );

        Kafka::publish()
            ->onTopic($topic)
            ->withMessage($message)
            ->send();
    }
}
