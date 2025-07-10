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

Run tests with:

```bash
yarn test
```

For continuous testing during development:

```bash
yarn test:dev
```

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
