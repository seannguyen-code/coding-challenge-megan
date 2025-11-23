# Resources CRUD API

RESTful API for managing resources built with TypeScript, Express, PostgreSQL, and Prisma ORM.

## Features

- Clean layered architecture (Routes → Services → Repositories → Database)
- Prisma ORM for type-safe database access
- Request validation with Zod
- Winston structured logging with daily rotation
- Comprehensive unit and integration tests (Jest + Supertest)
- Docker containerization
- Postman collection included

## Tech Stack

**Backend**: Node.js 20, Express, TypeScript  
**Database**: PostgreSQL 16, Prisma ORM  
**Testing**: Jest, Supertest  
**Quality**: ESLint, Prettier

## Data Model

**Resources Table**: `id`, `name`, `type`, `status`, `metadata` (JSONB), `created_at`, `updated_at`

## Quick Start

**Prerequisites**: Docker, Docker Compose

1. **Setup environment**:
```bash
cp .env.example .env
```

2. **Start services**:
```bash
docker compose up --build
```

3. **API available at**: `http://localhost:3000`

4. **Health check**: `curl http://localhost:3000/health`

5. **Stop services**: `docker compose down`

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string (format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`)
- `PORT`: API server port (default: 3000)
- `NODE_ENV`: Environment mode
- `DATABASE_URL_TEST`: Test database (optional)

## API Endpoints

**Base URL**: `http://localhost:3000/api/resources`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resources` | Create resource |
| GET | `/api/resources` | List resources (with pagination/filters) |
| GET | `/api/resources/:id` | Get resource by ID |
| PUT | `/api/resources/:id` | Full update |
| PATCH | `/api/resources/:id` | Partial update |
| DELETE | `/api/resources/:id` | Delete resource |

**Query Parameters** (GET list): `limit`, `offset`, `status`, `type`

**Example**:
```bash
# Create
curl -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -d '{"name": "Server", "type": "compute", "status": "active"}'

# List with filters
curl "http://localhost:3000/api/resources?limit=5&status=active"
```

## Development

### Local Development

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev          # or npm run dev:watch for auto-reload
```

### Scripts

```bash
npm run build        # Build for production
npm start            # Run production build
npm run lint         # Check code quality
npm run format       # Format code
npm test             # Run all tests
```

## Testing

```bash
npm test                  # All tests (39 tests: 16 unit + 23 integration)
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
npm run test:coverage     # With coverage report
```

**Test Database Setup** (for integration tests):
```bash
createdb resources_test_db
# Add DATABASE_URL_TEST to .env
DATABASE_URL=$DATABASE_URL_TEST npx prisma db push
```

## Postman Collection

Import `postman/ResourceAPI.postman_collection.json` into Postman for pre-configured API requests covering all CRUD operations.

## Utilities

```bash
# Access database
docker exec -it resources_db psql -U admin -d resources_db

# View logs
docker logs -f resources_api
docker logs -f resources_db
```

## License

MIT
