module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '^axios$': '<rootDir>/src/__mocks__/axios.js'
  },
  transformIgnorePatterns: [
    'node_modules/(?!axios)/'
  ]
};