module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transform: {
    '^.+\\.(js|jsx|mjs)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios|@reduxjs|redux-thunk)'
  ],
  moduleNameMapper: {
    '^axios$': '<rootDir>/node_modules/axios/dist/axios.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  resetMocks: true,
  clearMocks: true
};