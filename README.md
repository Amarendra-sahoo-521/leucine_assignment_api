# Leucine Assignment API

A TypeScript REST API for managing equipment, cleaning records, and cleaning audit history. The service uses Express, PostgreSQL, and TypeORM.

## Features

- Equipment creation, listing, updating, and deletion
- Equipment listing with pagination and active/retired filtering
- Cleaning records associated with equipment
- Cleaning record updates with audit entries
- Audit history returned with an individual cleaning record
- CORS and JSON request support

## Technology stack

- Node.js
- TypeScript
- Express 5
- PostgreSQL
- TypeORM
- Vitest

## Prerequisites

- Node.js 18 or newer
- npm
- A PostgreSQL database and a user with permission to create and modify tables

## Installation

1. Clone the repository and move into the project directory.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=leucine
   ```

   `PORT` is optional and defaults to `5000`. All database variables are required by the application.

## Running the application

### Development

Runs the TypeScript server with automatic restart:

```bash
npm run dev
```

### Production

Compile the project and start the compiled server:

```bash
npm run build
npm start
```

The API is available at `http://localhost:5000` by default.

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server with `ts-node-dev` |
| `npm run build` | Compile TypeScript into `dist/` |
| `npm start` | Start the compiled server |
| `npm test` | Run the Vitest test suite once |
| `npm run test:watch` | Run Vitest in watch mode |

## API

The default base URL is `http://localhost:5000`.

### Health check

```http
GET /
```

Response:

```json
{
  "message": "API is running"
}
```

### Equipment endpoints

#### List equipment

```http
GET /api/equipments?page=1&limit=10&active=true
```

Query parameters:

- `page` - Page number; defaults to `1`
- `limit` - Items per page; defaults to `10` and is capped at `100`
- `active` - Optional boolean. `true` returns active equipment and `false` returns retired equipment

#### Create equipment

```http
POST /api/equipments/create
Content-Type: application/json
```

Request body:

```json
{
  "name": "Filling Machine 01",
  "code": "FM-001",
  "status": "active"
}
```

`name` and `code` are required. `status` may be `active` or `retired` and defaults to `active`.

#### Update equipment

```http
PUT /api/equipments/:id
Content-Type: application/json
```

Example:

```bash
curl -X PUT http://localhost:5000/api/equipments/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Filling Machine 01","code":"FM-001","status":"retired"}'
```

#### Delete equipment

```http
DELETE /api/equipments/:id
```

Deleting an equipment record also deletes its associated cleaning records because of the database relationship configuration.

### Cleaning endpoints

#### List cleaning records for equipment

```http
GET /api/cleaning/:equipmentId?page=1&limit=10
```

The response is paginated using the same `page` and `limit` parameters as the equipment list endpoint.

#### Get one cleaning record and its audit history

```http
GET /api/cleaning/get_record/:id
```

#### Create a cleaning record

```http
POST /api/cleaning/create
Content-Type: application/json
```

Request body:

```json
{
  "cleanedBy": "Alex Smith",
  "cleanedAt": "2026-09-11T09:30:00.000Z",
  "method": "CIP",
  "notes": "Completed according to SOP-12",
  "eq_id": "1",
  "status": "pending"
}
```

Required fields are `cleanedBy`, `cleanedAt`, `method`, `notes`, `eq_id`, and `status`. `status` may be `pending` or `verified`. `eq_id` must identify an existing equipment record.

Creating a cleaning record also creates audit entries for its supplied record fields.

#### Update a cleaning record

```http
PATCH /api/cleaning/:id
Content-Type: application/json
```

Request body:

```json
{
  "cleanedBy": "Alex Smith",
  "cleanedAt": "2026-09-11T09:30:00.000Z",
  "method": "CIP",
  "notes": "Verified by supervisor",
  "changed_by": "Jordan Lee",
  "status": "verified"
}
```

The update creates audit entries for changed `notes` and `status` values. `changed_by` identifies the person who made the change.

## Response format

Paginated endpoints return this shape:

```json
{
  "data": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  },
  "status": true,
  "message": "Equipments fetched successfully"
}
```

Mutation endpoints return a `data`, `message`, and `status` object. Successful creates use HTTP `201`; successful reads use HTTP `200`.

## Database behavior

TypeORM is configured with `synchronize: true`, so the schema is synchronized automatically when the application starts. This is convenient for local development, but migrations should be used instead of automatic synchronization in production.

The database contains `Equipment`, `Cleaning`, and `Audit` entities. Equipment and cleaning records include automatic `createdAt` and `updatedAt` timestamps.

## Testing

Run the tests with:

```bash
npm test
```

The current test suite covers pagination parsing and paginated response formatting.

## Project structure

```text
src/
  config/       Database configuration
  entities/     TypeORM entities
  enum/         Equipment and cleaning status enums
  modules/      Equipment and cleaning routes, controllers, and services
  utils/        Shared pagination helpers
  app.ts        Express application and route registration
  server.ts     Database initialization and HTTP server startup
```
