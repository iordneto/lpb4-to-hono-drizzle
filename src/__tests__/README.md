# Tests

This directory contains the comprehensive test suite for the Task API, implementing integration tests using LoopBack 4's testing framework.

## Test Architecture

Our test suite leverages LoopBack 4's built-in testing capabilities with custom enhancements for JWT authentication and in-memory database testing.

### Directory Structure

```
src/__tests__/
├── acceptance/                      # Integration tests
│   ├── test-application.ts          # Custom test application with JWT middleware
│   ├── test-helper.ts               # Test utilities and data generators
│   ├── auth.controller.simple.ts    # Authentication integration tests
│   ├── ping.controller.acceptance.ts # Ping endpoint tests (LoopBack default)
│   └── home-page.acceptance.ts      # Home page tests (LoopBack default)
├── datasources/
│   └── test-db.datasource.ts        # In-memory database configuration
└── README.md                        # This file
```

## Test Components

### TestApplication (`test-application.ts`)

Custom LoopBack application that extends the main application with test-specific configurations:

- **JWT Middleware**: Custom middleware to handle JWT authentication in test environment
- **401 Responses**: Automatically returns 401 for protected endpoints without valid tokens
- **UserProfile Injection**: Binds authenticated user to request context
- **In-Memory Database**: Uses memory connector for fast, isolated tests

### TestDbDataSource (`test-db.datasource.ts`)

In-memory database configuration for testing:

```typescript
const config = {
  name: 'testdb',
  connector: 'memory',
  localStorage: '',
  file: false, // Don't persist to file
};
```

### Test Helpers (`test-helper.ts`)

Utility functions for test setup and data generation:

- `setupApplication()`: Initializes test app with clean database
- `cleanupDatabase()`: Resets database between tests
- `givenUserData()`: Generates test user data with unique emails
- `givenTaskData()`: Generates test task data
- `givenLoggedInUser()`: Creates authenticated user and returns JWT token
- `getAuthHeaders()`: Formats authorization headers

## Test Coverage

### Authentication Tests (6 tests)

**File**: `auth.controller.simple.ts`

Tests the complete authentication flow:

1. **User Registration**
   - ✅ Successfully registers new users
   - ✅ Rejects duplicate email addresses
   - ✅ Validates required fields
   - ✅ Validates email format
   - ✅ Validates password minimum length

2. **User Login**
   - ✅ Successfully logs in with valid credentials
   - ✅ Rejects invalid email/password combinations
   - ✅ Validates required fields
   - ✅ Generates valid JWT tokens

3. **JWT Token Validation**
   - ✅ Generates properly formatted JWT tokens
   - ✅ Includes correct user information in payload

### Task Management Tests (13 tests)

**File**: `task.controller.simple.ts` (now integrated into main test suite)

Tests complete task lifecycle and security:

1. **Task Creation**
   - ✅ Creates tasks with valid authentication
   - ✅ Rejects requests without authentication
   - ✅ Validates required fields
   - ✅ Associates tasks with correct user

2. **Task Retrieval**
   - ✅ Returns empty array for users with no tasks
   - ✅ Returns user's tasks (order-independent)
   - ✅ Rejects requests without authentication
   - ✅ Ensures user isolation (users only see their own tasks)

3. **Task Operations**
   - ✅ Complete CRUD cycle (Create, Read, Update, Delete)
   - ✅ Task completion/uncompletion
   - ✅ Task counting
   - ✅ Proper error handling for non-existent tasks

## Running Tests

### Basic Commands

```bash
# Run all tests
yarn test

# Run tests with different reporters
yarn test:tap          # TAP reporter (good for CI)
yarn test --reporter=json    # JSON output

# Run specific test groups
yarn test:auth          # Authentication tests only
yarn test:tasks         # Task management tests only
yarn test:integration   # All integration tests
```

### Specific Test Execution

```bash
# Run specific test files
yarn test --grep "AuthController"
yarn test --grep "TaskController"

# Run specific test cases
yarn test --grep "successfully registers a new user"
yarn test --grep "rejects task creation without authentication"
yarn test --grep "performs complete CRUD cycle"
```

### Development and Debugging

```bash
# Continuous testing during development
yarn test:dev

# Debug mode
yarn test --inspect-brk

# Verbose output
yarn test --verbose
```

## Test Data Management

### Unique Data Generation

Tests use time-based unique identifiers to avoid conflicts:

```typescript
// Generates unique email for each test run
const userData = givenUserData({
  email: `test-${Date.now()}-${Math.random()}@example.com`,
});
```

### Database Isolation

Each test runs with a clean database state:

```typescript
beforeEach(async () => {
  await cleanupDatabase(app); // Drops and recreates schema
});
```

## Test Patterns

### Authentication Pattern

Standard pattern for testing authenticated endpoints:

```typescript
it('should do something with authentication', async () => {
  // Setup: Create authenticated user
  const {token} = await givenLoggedInUser(client);

  // Action: Make authenticated request
  const res = await client
    .post('/protected-endpoint')
    .set(getAuthHeaders(token))
    .send(data)
    .expect(200);

  // Assertion: Verify response
  expect(res.body).to.have.properties(['expectedProperty']);
});
```

### Order-Independent Assertions

Avoid assuming order of results from database:

```typescript
// ❌ Bad: Assumes specific order
expect(res.body[0]).to.have.property('title', 'Task 1');
expect(res.body[1]).to.have.property('title', 'Task 2');

// ✅ Good: Order-independent
const titles = res.body.map(task => task.title);
expect(titles).to.containEql('Task 1');
expect(titles).to.containEql('Task 2');
```

## Adding New Tests

### Creating Test Files

1. **Create test file** following naming convention:

   ```
   src/__tests__/acceptance/feature-name.acceptance.ts
   ```

2. **Use standard test structure**:

   ```typescript
   describe('FeatureName (Integration)', () => {
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

3. **Follow existing patterns**:
   - Use `givenLoggedInUser()` for authenticated tests
   - Use data generators for test data
   - Implement proper cleanup between tests

### Test Guidelines

1. **Test Isolation**: Each test should be independent
2. **Descriptive Names**: Test names should clearly describe what is being tested
3. **Arrange-Act-Assert**: Structure tests with clear setup, action, and verification
4. **Error Cases**: Test both success and failure scenarios
5. **Authentication**: Always test both authenticated and unauthenticated access

## Troubleshooting

### Common Issues

1. **Tests hanging**: Check if `await app.stop()` is called in `after` hook
2. **Database conflicts**: Ensure `cleanupDatabase()` is called in `beforeEach`
3. **Authentication failures**: Verify token format and headers
4. **Order-dependent failures**: Use order-independent assertions

### Debugging Tips

```typescript
// Add debug logs in tests
console.log('Response:', JSON.stringify(res.body, null, 2));
console.log('Status:', res.status);
console.log('Headers:', res.headers);

// Inspect database state
const tasks = await app.get('repositories.TaskRepository').find();
console.log('Current tasks in DB:', tasks);
```

## Performance

- **Fast Execution**: In-memory database ensures quick test runs (~2-3 seconds for full suite)
- **Parallel Safe**: Tests can be run in parallel without conflicts
- **Resource Efficient**: No external dependencies required for testing

## Integration with CI/CD

The test suite is designed to work well in CI/CD environments:

```bash
# CI-friendly command
yarn test --reporter=tap

# With coverage (if coverage tools are added)
yarn test --coverage
```

## Best Practices

1. **Keep tests focused**: Each test should verify one specific behavior
2. **Use meaningful test data**: Use realistic data that represents actual usage
3. **Test edge cases**: Include tests for error conditions and boundary cases
4. **Maintain test quality**: Regularly review and refactor tests
5. **Document complex tests**: Add comments for complex test logic

For more information about LoopBack 4 testing, see the [official documentation](https://loopback.io/doc/en/lb4/Testing-your-application.html).
