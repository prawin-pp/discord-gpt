module.exports = {
  root: true,
  env: {
    es2017: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint"],
  ignorePatterns: ["*.cjs"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off"
  },
  overrides: [],
  settings: {},
};
