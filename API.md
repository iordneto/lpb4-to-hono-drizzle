# Task API - Documentation

This API allows managing users and tasks (todolist) with JWT authentication.

**Database**: PostgreSQL with UUID primary keys
**Authentication**: JWT tokens
**Data Format**: JSON

## Endpoints

### Authentication

#### POST /auth/register

Register a new user.

**Body:**

```json
{
  "name": "John Silva",
  "email": "john@email.com",
  "password": "123456"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "5479954a-2e60-4306-9909-c7265e6829d6",
    "name": "John Silva",
    "email": "john@email.com",
    "createdAt": "2025-01-10T00:01:56.051Z"
  }
}
```

#### POST /auth/login

User login.

**Body:**

```json
{
  "email": "john@email.com",
  "password": "123456"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "5479954a-2e60-4306-9909-c7265e6829d6",
    "name": "John Silva",
    "email": "john@email.com"
  }
}
```

### Tasks

**Note:** All task endpoints require authentication. Include the JWT token in the header:

```
Authorization: Bearer <your-token-here>
```

#### POST /tasks

Create a new task.

**Body:**

```json
{
  "title": "Study LoopBack",
  "description": "Learn how to use LoopBack 4 framework",
  "completed": false
}
```

**Response:**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Study LoopBack",
  "description": "Learn how to use LoopBack 4 framework",
  "completed": false,
  "userId": "5479954a-2e60-4306-9909-c7265e6829d6",
  "createdAt": "2025-01-10T00:01:56.051Z",
  "updatedAt": "2025-01-10T00:01:56.051Z"
}
```

#### GET /tasks

List all tasks from the logged user.

**Response:**

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Study LoopBack",
    "description": "Learn how to use LoopBack 4 framework",
    "completed": false,
    "userId": "5479954a-2e60-4306-9909-c7265e6829d6",
    "createdAt": "2025-01-10T00:01:56.051Z",
    "updatedAt": "2025-01-10T00:01:56.051Z"
  }
]
```

#### GET /tasks/{id}

Get a specific task.

**Response:**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Study LoopBack",
  "description": "Learn how to use LoopBack 4 framework",
  "completed": false,
  "userId": "5479954a-2e60-4306-9909-c7265e6829d6",
  "createdAt": "2025-01-10T00:01:56.051Z",
  "updatedAt": "2025-01-10T00:01:56.051Z"
}
```

#### PATCH /tasks/{id}

Update a task.

**Body:**

```json
{
  "title": "Study LoopBack 4 - Advanced",
  "description": "Learn advanced features of LoopBack 4"
}
```

#### PUT /tasks/{id}

Replace a task completely.

**Body:**

```json
{
  "title": "New task",
  "description": "New description",
  "completed": true
}
```

#### DELETE /tasks/{id}

Remove a task.

#### PATCH /tasks/{id}/complete

Mark a task as completed.

#### PATCH /tasks/{id}/uncomplete

Mark a task as uncompleted.

#### GET /tasks/count

Count the total number of tasks.

**Response:**

```json
{
  "count": 5
}
```

## How to use

1. **Register user**: Use `POST /auth/register`
2. **Login**: Use `POST /auth/login` to get the token
3. **Use token**: Include the token in all task requests in the header `Authorization: Bearer <token>`
4. **Manage tasks**: Use task endpoints to create, list, update and delete

## Examples with curl

### Register user

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Silva",
    "email": "john@email.com",
    "password": "123456"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@email.com",
    "password": "123456"
  }'
```

### Create task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "title": "My first task",
    "description": "Task description"
  }'
```

### List tasks

```bash
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer <your-token>"
```

## Run the application

```bash
# Install dependencies
yarn install

# Setup environment
cp env.example .env

# Start PostgreSQL database
yarn db:start

# Run in development mode
yarn start

# Or start everything together
yarn dev

# Build
yarn build

# Run tests
yarn test
```

The application will be available at:

- API: `http://localhost:3000`
- Database Admin: `http://localhost:8080` (Adminer)

## Explore API

Access `http://localhost:3000/explorer` to see the interactive API documentation.
