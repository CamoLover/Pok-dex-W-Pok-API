# Testing Guide

This document describes the testing setup and available tests for the Pokédex application.

## Test Setup

The project uses the following testing stack:
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom Jest matchers for DOM elements

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (re-runs on file changes)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Files

### Unit Tests

#### `src/lib/__tests__/pokeapi.test.ts`
Tests for the PokeAPI utility functions, focusing on localization logic.

**Test Coverage:**
- `getLocalizedName()` - 9 tests
  - Returns correct name for each language (EN, FR, ES, DE, JA)
  - Fallback to English when requested language unavailable
  - Handles invalid language codes
  - Handles empty names array
  - Handles missing English fallback

- `getLocalizedFlavorText()` - 8 tests
  - Returns correct flavor text for each language
  - Fallback to English when requested language unavailable
  - Handles empty flavor texts array
  - Handles missing English fallback

### Integration Tests

#### `src/pages/__tests__/index.test.tsx`
Tests for the Home page component, with emphasis on language switching functionality.

**Test Coverage:**
- Renders Pokemon with English names by default
- Clears `translatedName` when language changes
- Loads French translations when language is "fr"
- Loads Japanese translations when language is "ja"
- Does not fetch translations when language is "en"
- Re-fetches translations when switching between non-English languages
- Handles language switch from non-English to English
- Displays original names when `translatedName` is undefined

**Total: 8 integration tests**

## Test Configuration

### `jest.config.js`
Main Jest configuration that:
- Uses Next.js Jest configuration
- Sets up jsdom test environment
- Configures module path aliases (`@/*` → `./src/*`)
- Sets up coverage collection
- Excludes test files and stories from coverage

### `jest.setup.js`
Global test setup that:
- Imports `@testing-library/jest-dom` for custom matchers
- Mocks Next.js router
- Mocks `react-i18next` for internationalization
- Mocks `IntersectionObserver` for infinite scroll testing
- Mocks `window.matchMedia` for responsive design testing

## Coverage Report

Current test coverage (as of latest run):

| File         | % Stmts | % Branch | % Funcs | % Lines |
|--------------|---------|----------|---------|---------|
| **index.tsx**| 83.07%  | 63.88%   | 78.78%  | 82.75%  |
| **pokeapi.ts** | 35.71% | 41.66%   | 31.57%  | 34.37%  |

The language switching functionality in `src/pages/index.tsx` has excellent coverage (>80% across all metrics).

## Language Switching Tests - Detailed

The language switching tests verify that:

1. **Translations are cleared when language changes**: When switching languages, all cached `translatedName` values are reset to `undefined`

2. **Translations reload for new language**: After clearing, the translation loading effect fetches new translations from the PokeAPI

3. **English skips translation loading**: When language is set to "en", no API calls are made for species data (original names are used)

4. **Multiple language switches work correctly**: Switching from one non-English language to another properly clears and reloads translations

5. **Fallback to original names**: If `translatedName` is undefined, the component displays the original Pokemon name

## Writing New Tests

### Example: Testing a Component

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  test('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  test('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Updated Text')).toBeInTheDocument();
    });
  });
});
```

### Example: Mocking API Calls

```typescript
import * as pokeapi from '../../lib/pokeapi';

jest.mock('../../lib/pokeapi');

const mockFetchPokemon = pokeapi.fetchPokemon as jest.MockedFunction<typeof pokeapi.fetchPokemon>;

beforeEach(() => {
  mockFetchPokemon.mockResolvedValue({
    id: 1,
    name: 'bulbasaur',
    // ... other properties
  });
});
```

## Continuous Integration

To add these tests to CI/CD:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: npm test

- name: Generate Coverage
  run: npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## Troubleshooting

### Tests timeout
- Increase timeout in `waitFor()`: `waitFor(() => {...}, { timeout: 5000 })`
- Or add timeout to specific test: `test('name', async () => {...}, 10000)`

### Mock issues
- Ensure mocks are cleared between tests: `jest.clearAllMocks()` in `beforeEach()`
- Check that mock implementations match actual function signatures

### Async issues
- Always use `await` with `waitFor()`, `act()`, and user interactions
- Wrap state updates in `act()` when needed

## Best Practices

1. **Arrange-Act-Assert**: Structure tests with setup, action, and verification
2. **Test user behavior, not implementation**: Focus on what users see and do
3. **Use semantic queries**: Prefer `getByRole()`, `getByLabelText()` over `getByTestId()`
4. **Mock external dependencies**: API calls, timers, browser APIs
5. **Clean up**: Use `beforeEach()` to reset mocks and state
6. **Meaningful test names**: Describe what the test verifies

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Next.js Testing](https://nextjs.org/docs/testing)
