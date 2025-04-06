// .eslintrc.js
module.exports = {
  env: {
    node: true,
    es2020: true, // Enable ES2020 features (dynamic import)
  },
  parserOptions: {
    ecmaVersion: 2020, // Parse dynamic imports
    sourceType: 'module', // Assume ES modules by default
  },
  plugins: ['import', 'node'],
  rules: {
    // Disallow `require` for ESM modules
    'node/no-unsupported-features/es-syntax': [
      'error',
      { ignores: ['modules'] },
    ],
    // Enforce dynamic imports for ESM modules
    'import/no-dynamic-require': 'off', // Allow dynamic imports
    'node/no-unsupported-features/node-builtins': [
      'error',
      { version: '>=14.0.0' }, // Adjust Node.js version as needed
    ],
    
    'no-restricted-imports': [ // Restrict `require` for specific ESM packages
      'error',
      {
        paths: [
          {
            name: '@react-navigation/native',
            message: 'Use dynamic import() instead of require() for ESM modules.',
          },
        ],
      },
    ],
  },
};
