module.exports = {
  moduleNameMapper: {
    '^react-router-dom$': '<rootDir>/node_modules/react-router-dom',
  },
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', 'src'],

  // 👇 Ajoute ceci
  setupFiles: ['<rootDir>/jest.setup.js'],
};
