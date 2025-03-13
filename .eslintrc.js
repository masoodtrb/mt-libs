module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,  // allows modern ECMAScript features
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    // project: './tsconfig.json', // if using rules that require type info
  },
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'jsx-a11y',
    'jest',
    'testing-library',
    'jest-dom',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:jest/recommended',
    'plugin:jest-dom/recommended',
    'plugin:testing-library/react',
    'plugin:prettier/recommended',  // keep Prettier last
  ],
  rules: {
    // Relaxing/adjusting some rules for flexibility and modern React:
    'react/react-in-jsx-scope': 'off',            // Not required for React 17+ JSX transform
    'react/prop-types': 'off',                   // We use TypeScript's types for props instead
    'no-unused-vars': 'off',                     // turn off base rule in favor of TS-specific one
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
    '@typescript-eslint/no-explicit-any': 'warn',// allow 'any' but warn to discourage overuse
    '@typescript-eslint/explicit-module-boundary-types': 'off',  // not forcing return types on exports
  },
  settings: {
    react: {
      version: 'detect',  // Automatically detect the installed React version
    },
  },
};
