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
    // Image mocks must come BEFORE the @ alias rule,
    // otherwise images imported via @/assets/... would be
    // caught by @/ rule and never checked against the image pattern.
    '^@/(.*)\.(png|jpg|jpeg|gif|svg|webp)$': '<rootDir>/tests/frontend/__mocks__/fileMock.js',
    // Also catch comma-separated extensions (e.g. womenShop1,png, kids1,png)
    '^@/(.*)\,(png|jpg)$': '<rootDir>/tests/frontend/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\.(css|scss|less)$': 'identity-obj-proxy',
    '\.(png|jpg|jpeg|gif|svg|webp)$': '<rootDir>/tests/frontend/__mocks__/fileMock.js',
  },
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/tests/frontend/**/*.test.js'],
  collectCoverage: false,
  setupFiles: ['<rootDir>/tests/frontend/setup.js'],
};
