# Web Scop API

> An API for asynchronous keyword tracking on websites, built with NestJS and focusing on clean architecture. It features PostgreSQL persistence, Redis caching, and a real-time web crawler.

## 🚀 Purpose

Web Scop is an API that performs asynchronous searches on websites based on user-provided keywords and a target URL. It returns the URLs where the keywords were found, backed by a persistent database and a performance-enhancing cache layer.

## ⚙️ Technologies

- **Framework**: NestJS with TypeScript
- **Architecture**: Modular (Controller, Service, Repository), SOLID, Clean Architecture
- **Database**: PostgreSQL with Prisma ORM for persistence
- **Caching**: Redis with `@nestjs/cache-manager` for performance optimization
- **Web Crawling**: Axios for making HTTP requests to external sites
- **Validation**: `class-validator` for robust DTO validation
- **API Documentation**: Swagger (OpenAPI) for interactive documentation
- **Containerization**: Docker and Docker Compose for easy environment setup

## 🔧 Features

- [x] Start a new search with a keyword and URL (`POST /search`)
- [x] Query status and results of a specific search (`GET /search/:id`)
- [x] List all previous search jobs (`GET /search`)
- [x] Delete a search job (`DELETE /search/:id`)
- [x] **PostgreSQL Persistence** with Prisma
- [x] **Redis Caching** for read-heavy operations
- [x] Real-time, asynchronous web crawling of a target URL
- [x] Robust validation and exception handling
- [x] Interactive API documentation via Swagger
- [ ] Kafka queue integration (coming soon)

## ▶️ Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

### 1\. Clone & Install Dependencies

```bash
git clone git@github.com:Maria-Leiliane/WebScope.git
cd WebScope
npm install
```

### 2\. Configure Environment Variables

Create a `.env` file in the root of the project by copying the example file:

```bash
cp .env.example .env
```

The default values in the `.env` file are configured to work with the `docker-compose.yml` setup below.

### 3\. Start Infrastructure Containers

In your terminal, run the following command to start the PostgreSQL and Redis containers in the background:

```bash
docker-compose up -d
```

### 4\. Run Database Migrations

Apply the database schema to your newly created PostgreSQL container using Prisma:

```bash
npx prisma migrate dev
```

### 5\. Start the API

Now you can start the NestJS application:

```bash
npm run start:dev
```

### 6\. Access the API & Docs

- **API Base URL**: `http://localhost:3000` (or the port you configured)
- **Swagger Docs**: `http://localhost:3000/api-docs`