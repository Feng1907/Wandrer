/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Không load dotenv trong test — dùng mock thay thế
  setupFiles: [],
  collectCoverageFrom: ['src/services/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
};
