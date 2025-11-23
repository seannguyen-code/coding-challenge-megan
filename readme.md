# Code Challenge Solutions

## Overview

This repository contains three comprehensive solutions showcasing production-ready code, scalable architecture, and best practices:

| Problem       | Focus Area               |
| ------------- | ------------------------ |
| **Problem 4** | Algorithm Implementation |
| **Problem 5** | Backend Development      |
| **Problem 6** | System Design            |

## Problem 4: Sum to N

**Task**: Implement three different approaches to calculate `1 + 2 + 3 + ... + n`

**Solution**: Iterative, mathematical formula (O(1)), and recursive implementations with comprehensive testing.

📂 **Location**: `src/problem4/`  
📖 **Details**: [Problem 4 README](src/problem4/README.md)

**Key Features**:

- Three distinct algorithms with complexity analysis
- Makefile for streamlined execution
- Performance benchmarking included

---

## Problem 5: CRUD API Backend

**Task**: Build a RESTful backend service with Express.js and TypeScript, connected to a database for persistence

**Solution**: Production-grade API with clean architecture, comprehensive testing, and Docker containerization.

📂 **Location**: `src/problem5/`  
📖 **Details**: [Problem 5 README](src/problem5/README.md)

**Key Features**:

- Complete CRUD operations with pagination & filters
- PostgreSQL + Prisma ORM for type-safe queries
- 39 automated tests (16 unit + 23 integration)
- Winston structured logging with daily rotation
- Request validation (Zod), error handling, security middleware
- Docker Compose orchestration
- Postman collection for API testing

**Tech Stack**: Node.js 20, Express, TypeScript, PostgreSQL 16, Prisma, Jest, Docker

---

## Problem 6: Live Scoreboard System Design

**Task**: Design an API service module for a live top-10 scoreboard with real-time updates

**Solution**: Scalable & Performative architecture with anti-fraud mechanisms.

📂 **Location**: `src/problem6/`  
📖 **Details**: [Problem 6 README](src/problem6/README.md)

**Key Features**:

- Real-time updates via Server-Sent Events (SSE)
- Redis Cluster for atomic operations & sub-100ms latency
- JWT authentication with server-side score calculation
- Idempotency & rate limiting (30 updates/user/min)
- Horizontal scalability with 5K concurrent SSE connections
- Comprehensive sequence diagrams & architecture diagrams

**Architecture**: REST API, Redis ZSET leaderboard, SSE broadcast manager, JWT security

**Why Redis only**: Redis-first architecture optimized for performance and real-time experience. The Redis cluster is configured for high availability with automatic failover (promotion) and multi-region replication. For extended data usage, a log-based tool like Kafka can be integrated to capture events and process downstream data for analytics, notifications, and historical storage.

**Why SSE**: For real-time experience without bidirectional communication requirements, Server-Sent Events (SSE) provides optimal performance with lower overhead than WebSockets and more efficiency than long polling.

---

## Quick Start

Each problem includes standalone setup instructions:

```bash
# Problem 4: Algorithm
cd src/problem4
make install && make dev

# Problem 5: Backend API
cd src/problem5
docker compose up --build

# Problem 6: System Design
cd src/problem6
# See README for architecture details
```

## License

MIT
