// Signal @vue/babel-preset-app to transform ES modules to CommonJS for Jest
process.env.VUE_CLI_BABEL_TRANSPILE_MODULES = 'true';

module.exports = {
  rootDir: '.',
  moduleFileExtensions: ['js', 'vue', 'json'],
  transform: {
    '^.+\\.vue$': '@vue/vue2-jest',
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\.(css|scss|less)$': 'identity-obj-proxy',
    '\.(png|jpg|jpeg|gif|svg|webp)$': '<rootDir>/tests/frontend/__mocks__/fileMock.js',
  },
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/tests/frontend/**/*.test.js'],
  collectCoverage: false,
  setupFiles: ['<rootDir>/tests/frontend/setup.js'],
};
