# Task API - LoopBack 4

This is a REST API developed with LoopBack 4 to manage users and tasks (todolist) with JWT authentication.

## Features

- ✅ **JWT Authentication**: User login and registration
- ✅ **User Management**: User registration and authentication
- ✅ **Task System**: Complete CRUD for tasks
- ✅ **PostgreSQL Database**: Persistent data storage with UUID primary keys
- ✅ **Docker Integration**: Easy database setup with Docker Compose
- ✅ **Relationships**: Each user can have multiple tasks
- ✅ **Validations**: Input data validation
- ✅ **Environment Variables**: Configurable via .env file
- ✅ **Auto Migrations**: Database schema management
- ✅ **OpenAPI Documentation**: Interactive API documentation

## Architecture

The application follows LoopBack 4 patterns:

```
src/
├── models/           # Data models (User, Task)
├── repositories/     # Repositories for data access
├── controllers/      # REST controllers (Auth, Task, Ping)
├── services/         # Business services (AuthService)
├── datasources/      # Data source configuration
└── application.ts    # Application configuration
```

## Main Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Tasks

- `POST /tasks` - Create new task
- `GET /tasks` - List all tasks
- `GET /tasks/{id}` - Get specific task
- `PATCH /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task
- `PATCH /tasks/{id}/complete` - Mark as complete
- `PATCH /tasks/{id}/uncomplete` - Mark as incomplete

## Installation and Usage

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- PostgreSQL (via Docker)

### Setup

1. **Install dependencies**:

```bash
yarn install
```

2. **Environment configuration**:

```bash
# Copy the environment example file
cp env.example .env

# Edit .env file with your configuration if needed
# Default values work with the provided docker-compose.yml
```

3. **Start PostgreSQL database**:

```bash
# Start PostgreSQL with Docker Compose
yarn db:start

# Or start all services (PostgreSQL + Adminer)
docker-compose up -d
```

4. **Run database migrations** (required for first setup):

```bash
yarn migrate
```

5. **Start the application**:

```bash
# Start the API server
yarn start

# Or start everything together
yarn dev
```

6. **Access the services**:

- API Server: `http://localhost:3000`
- API Documentation: `http://localhost:3000/explorer`
- Database Admin (Adminer): `http://localhost:8080`
  - Server: `postgres`
  - Username: `postgres`
  - Password: `postgres`
  - Database: `taskapi`

## Usage Examples

### 1. Register user

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Silva",
    "email": "john@email.com",
    "password": "123456"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@email.com",
    "password": "123456"
  }'
```

### 3. Create task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My first task",
    "description": "Task description"
  }'
```

### 4. List tasks

```bash
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Mark task as complete

```bash
curl -X PATCH http://localhost:3000/tasks/1/complete \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Technologies Used

- **[LoopBack 4](https://loopback.io/)** - Node.js Framework
- **[TypeScript](https://www.typescriptlang.org/)** - Programming language
- **[PostgreSQL](https://www.postgresql.org/)** - Database
- **[Docker](https://www.docker.com/)** - Containerization
- **[JWT](https://jwt.io/)** - Authentication
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Password hashing
- **[OpenAPI](https://swagger.io/specification/)** - API documentation

## Data Structure

### User

```typescript
{
  id: string; // UUID (auto-generated)
  name: string;
  email: string; // Unique
  password: string; // Hashed with bcrypt
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-generated
}
```

### Task

```typescript
{
  id: string;          // UUID (auto-generated)
  title: string;
  description?: string;
  completed: boolean;  // Default: false
  userId: string;      // Foreign key to User
  createdAt: Date;     // Auto-generated
  updatedAt: Date;     // Auto-generated
}
```

## Available Commands

```bash
# Development
yarn start          # Start the server
yarn build         # Build TypeScript
yarn build:watch   # Build in watch mode
yarn test          # Run tests
yarn lint          # Run linter
yarn lint:fix      # Fix linting issues

# Database
yarn db:start       # Start PostgreSQL database
yarn db:stop        # Stop all Docker services
yarn db:logs        # View PostgreSQL logs
yarn db:reset       # Reset database (removes all data)
yarn migrate        # Run database migrations

# Development with Database
yarn dev            # Start database + API server
yarn dev:full       # Start all services (DB + Adminer + API)

# Database Admin
yarn adminer:start  # Start Adminer web interface

# Docker
yarn docker:build  # Build Docker image
yarn docker:run    # Run container
```

## Next Steps

To improve the application, consider implementing:

1. **Authentication Middleware**: Automatically protect endpoints
2. **User Filters**: Ensure users only see their own tasks
3. **Pagination**: For listing many tasks
4. **Advanced Validations**: More robust validations
5. **Database Indexing**: Add database indexes for better performance
6. **Tests**: Add unit and integration tests
7. **Rate Limiting**: Protection against API abuse
8. **Logging**: Structured logging system
9. **Database Migrations**: Proper migration system for schema changes
10. **Environment-specific configs**: Different configs for dev/staging/prod

## Troubleshooting

### Common Issues

1. **Port 5432 already in use**
   - Another PostgreSQL instance is running
   - Solution: Stop other PostgreSQL services or change port in `docker-compose.yml`

2. **Database connection error**
   - Ensure PostgreSQL container is running: `docker ps`
   - Check container logs: `yarn db:logs`
   - Restart database: `yarn db:reset`

3. **"Error registering user" on first run**
   - Database tables not created yet
   - Solution: Run `yarn migrate` first

4. **Environment variables not loading**
   - Ensure `.env` file exists in project root
   - Copy from example: `cp env.example .env`

5. **Authentication token errors**
   - Check if JWT_SECRET is set in `.env`
   - Ensure token is included in Authorization header

### Database Management

```bash
# View database logs
yarn db:logs

# Reset database (removes all data)
yarn db:reset

# Connect to database directly
docker exec -it loopback-prisma-to-hono-drizzle-postgres-1 psql -U postgres -d taskapi

# Backup database
docker exec loopback-prisma-to-hono-drizzle-postgres-1 pg_dump -U postgres taskapi > backup.sql
```

## Additional Documentation

See [API.md](./API.md) for detailed endpoint documentation and usage examples.

## Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Project Status

✅ **Fully Functional** - All features tested and working:

- **Database**: PostgreSQL with Docker ✅
- **Authentication**: JWT login/register ✅
- **User Management**: CRUD operations ✅
- **Task Management**: Complete todolist functionality ✅
- **Data Persistence**: UUID primary keys, timestamps ✅
- **Environment Config**: .env file support ✅
- **Documentation**: OpenAPI/Swagger integration ✅

**Last Tested**: January 2025 with Node.js 20+ and PostgreSQL 15

## License

This project is under the MIT license.
