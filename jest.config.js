module.exports = {
    testEnvironment: "jsdom",
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1", // Adjust based on your alias
    },
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    },
  };