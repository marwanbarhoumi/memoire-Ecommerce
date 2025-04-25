import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => store[key] = value.toString(),
    removeItem: key => delete store[key],
    clear: () => store = {}
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock axios
jest.mock('axios', () => ({
  create: () => ({
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  })
}));