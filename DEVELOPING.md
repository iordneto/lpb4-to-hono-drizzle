# Developer's Guide

We use Visual Studio Code for developing this Task API and recommend the same to our contributors.

## VSCode setup

Install the following extensions:

- [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [TypeScript and JavaScript Language Features](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)

## Development workflow

### Visual Studio Code

1. Start the build task (Cmd+Shift+B) to run TypeScript compiler in the
   background, watching and recompiling files as you change them. Compilation
   errors will be shown in the VSCode's "PROBLEMS" window.

2. Execute "Run Rest Task" from the Command Palette (Cmd+Shift+P) to re-run the
   test suite and lint the code for both programming and style errors. Linting
   errors will be shown in VSCode's "PROBLEMS" window. Failed tests are printed
   to terminal output only.

### Other editors/IDEs

1. Open a new terminal window/tab and start the continuous build process via
   `yarn build:watch`. It will run TypeScript compiler in watch mode,
   recompiling files as you change them. Any compilation errors will be printed
   to the terminal.

2. In your main terminal window/tab, run `yarn test:dev` to re-run the test
   suite and lint the code for both programming and style errors. You should run
   this command manually whenever you have new changes to test. Test failures
   and linter errors will be printed to the terminal.

## Project Structure

```
src/
├── models/           # Data models (User, Task)
├── repositories/     # Data access layer
├── controllers/      # REST API controllers
├── services/         # Business logic services
├── datasources/      # Database configuration
└── application.ts    # Main application setup
```

## Common Commands

```bash
# Development
yarn start              # Start the development server
yarn build             # Build the TypeScript code
yarn build:watch       # Watch for changes and rebuild
yarn test              # Run tests
yarn test:dev          # Run tests in development mode
yarn lint              # Run linter
yarn lint:fix          # Fix linting issues automatically

# Database
yarn migrate           # Run database migrations

# Documentation
yarn openapi-spec      # Generate OpenAPI specification
```

## Testing

This project includes comprehensive integration tests using LoopBack 4's testing framework with an in-memory database for fast, isolated testing.

### Test Architecture

**Test Application (`TestApplication`)**

```typescript
export class TestApplication extends LoopbackPrismaToHonoDrizzleApplication {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Custom JWT middleware for tests
    this.middleware((ctx, next) => {
      // Handles JWT authentication in test environment
      // Returns 401 for protected endpoints without valid tokens
      // Binds UserProfile to context for authenticated requests
    });
  }
}
```

**In-Memory Database (`TestDbDataSource`)**

```typescript
const config = {
  name: 'testdb',
  connector: 'memory',
  localStorage: '',
  file: false, // Don't persist to file in tests
};
```

### Test Structure

```
src/__tests__/
├── acceptance/
│   ├── test-application.ts     # Custom test app with JWT middleware
│   ├── test-helper.ts          # Test utilities and data generators
│   ├── auth.controller.simple.ts  # Authentication integration tests
│   └── ping.controller.acceptance.ts  # Existing LoopBack tests
└── datasources/
    └── test-db.datasource.ts   # In-memory database configuration
```

### Running Tests

```bash
# Run all tests
yarn test

# Run with specific reporter
yarn test --reporter=tap
yarn test --reporter=json
yarn test --reporter=spec

# Run specific test files
yarn test --grep "AuthController"
yarn test --grep "TaskController"

# Run specific test cases
yarn test --grep "successfully creates a task"
yarn test --grep "rejects task creation without authentication"

# Debug mode (useful for development)
yarn test --inspect-brk
```

### Test Utilities

**Data Generators**

```typescript
// Generate test user data with unique emails
const userData = givenUserData({
  email: 'custom@test.com',
  name: 'Custom User',
});

// Generate test task data
const taskData = givenTaskData({
  title: 'Custom Task',
  completed: true,
});

// Create authenticated user and get JWT token
const {user, token} = await givenLoggedInUser(client, userData);

// Generate authorization headers
const headers = getAuthHeaders(token);
```

**Database Management**

```typescript
// Clean database between tests (called in beforeEach)
await cleanupDatabase(app);

// Setup test application with clean state
const {app, client} = await setupApplication();
```

### Test Coverage Areas

**Authentication Tests (`auth.controller.simple.ts`)**

- User registration with validation
- Login with JWT token generation
- Email uniqueness validation
- Invalid credentials handling
- JWT token format validation

**Task Management Tests**

- CRUD operations with authentication
- User isolation (tasks are user-specific)
- Authentication requirement enforcement
- Task completion status management
- Field validation and error handling

### Test Development Guidelines

**1. Test Isolation**

```typescript
beforeEach(async () => {
  await cleanupDatabase(app); // Clean state for each test
});
```

**2. Unique Test Data**

```typescript
// Use unique emails to avoid conflicts
const userData = givenUserData({
  email: `test-${Date.now()}@example.com`,
});
```

**3. Authentication Patterns**

```typescript
// Standard pattern for authenticated requests
const {token} = await givenLoggedInUser(client);
const res = await client
  .post('/tasks')
  .set(getAuthHeaders(token))
  .send(taskData)
  .expect(200);
```

**4. Order-Independent Assertions**

```typescript
// Don't assume order of results
const titles = res.body.map(task => task.title);
expect(titles).to.containEql('Task 1');
expect(titles).to.containEql('Task 2');
```

### Debugging Tests

**Run specific failing test:**

```bash
yarn test --grep "specific failing test name"
```

**Add debug logs in tests:**

```typescript
console.log('Response:', res.body);
console.log('Headers:', res.headers);
```

**Inspect database state:**

```typescript
// In test, before cleanup
const tasks = await app.get('repositories.TaskRepository').find();
console.log('Current tasks:', tasks);
```

### Adding New Tests

**1. Create test file:**

```typescript
// src/__tests__/acceptance/new-feature.acceptance.ts
describe('NewFeature (Integration)', () => {
  let app: TestApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(async () => {
    await cleanupDatabase(app);
  });

  // Your tests here
});
```

**2. Use existing patterns:**

- Use `givenLoggedInUser()` for authenticated tests
- Use `cleanupDatabase()` for test isolation
- Follow naming convention: `feature.acceptance.ts`

### Continuous Testing

For continuous testing during development:

```bash
yarn test:dev
```

This will watch for file changes and re-run tests automatically.

## Code Style

This project uses ESLint and Prettier for code formatting. Run:

```bash
yarn lint:fix
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-new-feature`
3. Make your changes
4. Run tests: `yarn test`
5. Commit your changes: `git commit -am 'Add some feature'`
6. Push to the branch: `git push origin feature/my-new-feature`
7. Submit a pull request
