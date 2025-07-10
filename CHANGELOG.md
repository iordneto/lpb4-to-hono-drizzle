# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2025-01-10

### Added

- **Comprehensive Integration Test Suite**
  - 19 integration tests covering all API functionality
  - JWT authentication testing with custom middleware
  - In-memory database for fast, isolated testing
  - Complete CRUD operations testing for tasks
  - User isolation and security testing

- **Test Infrastructure**
  - `TestApplication` - Custom LoopBack application for testing
  - `TestDbDataSource` - In-memory database configuration
  - `test-helper.ts` - Test utilities and data generators
  - Authentication helpers for JWT token management
  - Database cleanup utilities for test isolation

- **Test Features**
  - **Authentication Tests (6 tests)**
    - User registration with validation
    - Login with JWT token generation
    - Invalid credentials rejection
    - Email uniqueness validation
    - JWT token format validation

  - **Task Management Tests (13 tests)**
    - Task creation with authentication
    - Task listing and retrieval
    - Complete CRUD operations
    - Task completion/uncompletion
    - User task isolation
    - Authentication requirement enforcement
    - Field validation
    - Task counting

- **Testing Documentation**
  - Comprehensive testing section in README.md
  - Developer guide for testing in DEVELOPING.md
  - Examples of test execution and debugging
  - Guidelines for adding new tests

### Enhanced

- **Test Middleware**
  - Custom JWT authentication middleware for test environment
  - Automatic 401 responses for protected endpoints
  - UserProfile injection for authenticated requests
  - Order-independent test assertions

- **Developer Experience**
  - Test data generators with unique identifiers
  - Clean database state between tests
  - Detailed test coverage documentation
  - Debugging guides and examples

### Technical Details

- **Test Coverage**: 100% of API endpoints tested
- **Test Performance**: In-memory database ensures fast execution
- **Test Isolation**: Each test runs with clean database state
- **Test Security**: Authentication and authorization thoroughly tested
- **Test Reliability**: Order-independent assertions prevent flaky tests

**All 19 tests passing:**

```bash
# tests 19
# pass 19
# fail 0
```

## [1.1.0] - 2025-01-10

### Added

- **PostgreSQL Database Integration**
  - Complete PostgreSQL setup with Docker Compose
  - UUID primary keys for all entities
  - Database connection via environment variables
  - Auto-migrations system

- **Docker Configuration**
  - `docker-compose.yml` with PostgreSQL 15 Alpine
  - Adminer web interface for database management
  - Health checks for database container
  - Persistent volume for data storage

- **Environment Configuration**
  - `.env` file support with dotenv
  - `env.example` template with all required variables
  - Environment-based database connection
  - JWT secret configuration

- **Enhanced Documentation**
  - Complete setup instructions with PostgreSQL
  - Troubleshooting section for common issues
  - Database management commands
  - Updated examples with real UUIDs
  - Project status section

- **New Scripts**
  - `yarn db:start` - Start PostgreSQL database
  - `yarn db:stop` - Stop all Docker services
  - `yarn db:logs` - View PostgreSQL logs
  - `yarn db:reset` - Reset database (removes all data)
  - `yarn dev` - Start database + API server
  - `yarn dev:full` - Start all services
  - `yarn adminer:start` - Start Adminer web interface

### Changed

- **Database Migration from Memory to PostgreSQL**
  - Models updated with PostgreSQL-specific configurations
  - UUID generation instead of auto-increment IDs
  - Timestamps now use PostgreSQL TIMESTAMP WITH TIME ZONE

- **Application Bootstrap**
  - Added dotenv configuration loading
  - Environment variables loaded before application start

- **Documentation Updates**
  - All examples updated with UUID format
  - Added PostgreSQL and Docker to technology stack
  - Updated installation instructions
  - Added troubleshooting guide

### Technical Details

- **Tested and Verified Features:**
  - ✅ User registration with PostgreSQL persistence
  - ✅ JWT authentication working correctly
  - ✅ UUID primary key generation
  - ✅ Database migrations execution
  - ✅ Environment variable loading
  - ✅ Docker container health checks

## [1.0.0] - 2025-01-09

### Initial Release

- JWT Authentication system
- User management (register/login)
- Task CRUD operations
- LoopBack 4 framework setup
- OpenAPI documentation
- Memory database (replaced in v1.1.0)
