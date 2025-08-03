# Web Scop API

> API under development for asynchronous keyword tracking on websites, focusing on clean architecture and good engineering practices.

## 🚀 Purpose

Web Scop is an API that performs asynchronous searches on websites based on user-provided terms. It returns the URLs where the keywords were found, simulating a content monitoring and web crawling system.

## ⚙️ Technologies

- NestJS with TypeScript
- Modular architecture (Controller, Service, Store)
- SOLID and Clean Architecture principles
- Validation with DTOs and enums
- Automated testing with Jest
- In-memory storage (persistence simulation)
- Kafka and Redis-ready
- Git Flow for lifecycle organization

## 🔧 Features

- [x] Start a new search with a keyword (`POST /search`)
- [x] Query status and results (`GET /search/:id`)
- [x] Timeout and search status control
- [x] Validations and exception handling
- [ ] Redis integration (coming soon)
- [ ] Kafka queue integration (coming soon)
- [ ] Database persistence (future)

## 📂 Files

src/
├── app.module.ts <-- Application root module
├── main.ts <-- Entry point
├── search/
│ ├── controller/ <-- SearchController
│ ├── service/ <-- SearchService
│ ├── store/ <-- SearchStoreService + repository implementation
│ ├── dto/ <-- Search DTOs (Request/Response)
│ ├── interfaces/ <-- ISearchJobRepository, SearchJob, SearchResult, etc.
│ └── enums/ <-- SearchStatus
├── shared/ <-- Pipes, decorators, exceptions, generic utils

## 🧪 Tests

Running tests with Jest:

```bash
npm run test
