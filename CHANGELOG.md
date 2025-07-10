# Changelog

All notable changes to this project will be documented in this file.

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
