# Finance Tracker

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![Kafka](https://img.shields.io/badge/Apache%20Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)
![Elasticsearch](https://img.shields.io/badge/Elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

A robust and scalable personal finance management system, built with a modern event-driven architecture using Laravel, Apache Kafka, and Elasticsearch.

## About The Project

Finance Tracker is more than just a simple CRUD application. It was developed as a practical case study on how to build modern, resilient, and scalable software systems. The project uses Laravel as its foundation and integrates cutting-edge technologies like Apache Kafka and Elasticsearch for two distinct and crucial purposes:

1.  **High-Performance Data Search:** Using Laravel Scout and the Explorer driver, the system indexes transactional data (like transactions and reports) in Elasticsearch, enabling complex and ultra-fast searches.

2.  **Audit Log Pipeline:** Independently, the system uses Apache Kafka to capture data change events (creations, updates, and deletions). These events are processed by an asynchronous worker that stores them in a separate Elasticsearch index, creating an immutable and decoupled audit trail from the main application.

## Main Features

- **User Authentication:** Complete user registration and login system.
- **Account Management:** Create and manage multiple accounts (e.g., Checking, Savings, Credit Card).
- **Categorization:** Organize your transactions with custom categories.
- **Transaction Logging:** Add income and expenses, associating them with accounts and categories.
- **Report Generation:** Create financial performance reports based on specific periods.

## Architecture Highlights

- **Event-Driven Architecture:** Uses Laravel's `ModelObserver` to capture CRUD events, which are published to a Kafka topic. This decouples the audit logic from the main business logic.
- **Asynchronous Processing:** A dedicated `Consumer`, running as a background process, listens for Kafka events and sends them to Elasticsearch. This ensures the main application remains fast and responsive, even under a high load of events.
- **Resilience:** If Elasticsearch is temporarily unavailable, log messages accumulate in Kafka and are processed as soon as the service is restored, with no data loss.
- **Horizontal Scalability:** The event processing can be scaled by simply running more instances of the Consumer process, allowing for the processing of millions of events.
- **Code Best Practices:** The project utilizes modern PHP and Laravel features, such as Enums for data types and Casts to ensure data integrity and code readability.

## Technology Stack

**Backend:**
- PHP 8+
- Laravel
- Laravel Scout
- Jeroen-G/Explorer (Scout Driver for Elasticsearch)
- MateusJunges/laravel-kafka

**Frontend:**
- Inertia.js
- React
- TypeScript
- Vite
- TailwindCSS

**Infrastructure and Services:**
- Docker
- Apache Kafka
- Elasticsearch

## Getting Started

Follow the steps below to set up and run the project locally.

### Prerequisites

- PHP 8.1+
- Composer
- Node.js and NPM
- Docker and Docker Compose

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/melkyv/finance-tracker.git
    cd finance-tracker
    ```

2.  **Install PHP dependencies:**
    ```sh
    composer install
    ```

3.  **Set up the environment:**
    ```sh
    cp .env.example .env
    php artisan key:generate
    ```

4.  **Adjust the `.env` file** with your credentials for the database (`DB_*`), Elasticsearch (`ELASTICSEARCH_*`), and Kafka (`KAFKA_*`).

5.  **Start the Docker services:**
    ```sh
    docker-compose up -d
    ```

6.  **Run the database migrations:**
    ```sh
    php artisan migrate --seed
    ```

7.  **Install Frontend dependencies:**
    ```sh
    npm install
    ```

8.  **Compile Frontend assets:**
    ```sh
    npm run build
    ```

9.  **Create the indexes and import the Models into Elasticsearch:**
    ```sh
    php artisan scout:import "App\Models\Transaction"
    php artisan scout:import "App\Models\Report"
    php artisan scout:index audit_logs
    ```

10. **Create the audit topic in Kafka:**
    ```sh
    docker exec -it broker kafka-topics.sh --create --topic audit_events --bootstrap-server localhost:9092 --replication-factor 1 --partitions 3
    ```

## Running the Application

1.  **Start the Laravel web server:**
    ```sh
    php artisan serve
    ```

2.  **In a new terminal, start the Kafka consumer.** This process will remain active, waiting for new messages to process.
    ```sh
    php artisan kafka:consume --consumer=\App\Kafka\Consumers\ModelEventConsumer --topics=audit_events
    ```

You can now access the application in your browser, usually at `http://localhost:8000`!