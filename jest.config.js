// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
	// Provide the path to your Next.js app
	dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	testEnvironment: "jest-environment-jsdom",
	moduleNameMapper: {
		// Handle module aliases
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	// Add more setup options before each test is run
	testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
