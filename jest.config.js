// jest.config.js
export default {
  // Your existing configuration
  rootDir: '.',
  verbose: true,
  resetModules: true,
  clearMocks: true,
  silent: false,
  testMatch: ['**/test/**/*.test.js'],
  reporters: ['default', ['github-actions', { silent: false }], 'summary'],
 //setupFiles: ['<rootDir>/.jest/setup-file.js'],
  //setupFilesAfterEnv: ['<rootDir>/.jest/setup-file-after-env.js'],
  transform: {}, // No transforms needed
  
  // Mock mappings 
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^ioredis$': '<rootDir>/.jest/mocks/ioredis.cjs'
  },
  
  // Rest of your existing config
  collectCoverageFrom: ['src/**/*.js'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.server',
    '<rootDir>/.public',
    '<rootDir>/src/server/common/test-helpers',
    '<rootDir>/src/client/javascripts/application.js',
    '<rootDir>/src/index.js',
    '<rootDir>/test'
  ],
  coverageDirectory: '<rootDir>/coverage',
  transformIgnorePatterns: [
    `node_modules/(?!${[
      '@defra/hapi-tracing'
    ].join('|')}/)`
  ],
  testEnvironment: 'node'
}
