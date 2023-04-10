module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint"],
  ignorePatterns: ["*.cjs"],
  overrides: [],
  settings: {},
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
  env: {
    es2017: true,
    node: true,
  },
};
