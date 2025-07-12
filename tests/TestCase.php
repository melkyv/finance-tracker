<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Junges\Kafka\Facades\Kafka;
use Mockery;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Mock Kafka facade
        $messageProducerMock = Mockery::mock(\Junges\Kafka\Contracts\MessageProducer::class);
        $messageProducerMock->shouldReceive('onTopic')->andReturnSelf();
        $messageProducerMock->shouldReceive('withMessage')->andReturnSelf();
        $messageProducerMock->shouldReceive('send')->andReturn(true);

        Kafka::shouldReceive('publish')->andReturn($messageProducerMock);
    }
}
