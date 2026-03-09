module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'script',
    requireConfigFile: false,
  },
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  ignorePatterns: ['node_modules/', 'dist/'],
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'off',
  },
};
