import '@testing-library/jest-dom';
import { fetch, Request, Response } from 'cross-fetch';

// Set up global fetch
global.fetch = fetch;
global.Request = Request;
global.Response = Response;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn((index: number) => null),
  [Symbol.iterator]: function* () {
    yield* [];
  }
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Clear mocks between tests
beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});