export default {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFiles: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.test.json"
    }
  }
};
