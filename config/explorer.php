<?php

declare(strict_types=1);

return [
    /*
     * There are different options for the connection. Since Explorer uses the Elasticsearch PHP SDK
     * under the hood, all the host configuration options of the SDK are applicable here. See
     * https://www.elastic.co/guide/en/elasticsearch/client/php-api/current/configuration.html
     */
    'connection' => [
        'host' => env('ELASTICSEARCH_HOST', 'localhost'),
        'port' => env('ELASTICSEARCH_PORT', '9200'),
        'scheme' => env('ELASTICSEARCH_SCHEME', 'http'),
        'auth' => [
            'username' => env('ELASTICSEARCH_USERNAME'),
            'password' => env('ELASTICSEARCH_PASSWORD')
        ],
    ],

    /**
     * The default index settings used when creating a new index. You can override these settings
     * on a per-index basis by implementing the IndexSettings interface on your model or defining
     * them in the index configuration below.
     */
    'default_index_settings' => [
        //'index' => [],
        //'analysis' => [],
    ],

    /**
     * An index may be defined on an Eloquent model or inline below. A more in depth explanation
     * of the mapping possibilities can be found in the documentation of Explorer's repository.
     */
    'indexes' => [
        \App\Models\Report::class,
        \App\Models\Transaction::class,
        'audit_logs' => [
            'properties' => [
                'timestamp' => 'date',
                'event_type' => 'keyword',
                'model_class' => 'keyword',
                'model_id' => 'keyword',
                'user_id' => 'keyword',
                'user_name' => 'text',
                'source_ip' => 'ip',
                'data' => [
                    'type' => 'object',
                    'enabled' => false, // Just store the data, don't index sub-fields
                ],
            ]
        ]
    ],

    /**
     * You may opt to keep the old indices after the alias is pointed to a new index.
     * A model is only using index aliases if it implements the Aliased interface.
     */
    'prune_old_aliases' => true,

    /**
     * When set to true, sends all the logs (requests, responses, etc.) from the Elasticsearch PHP SDK
     * to a PSR-3 logger. Disabled by default for performance.
     */
    'logging' => env('EXPLORER_ELASTIC_LOGGER_ENABLED', false),
    'logger' => null,
];
