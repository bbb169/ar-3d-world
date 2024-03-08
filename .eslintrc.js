module.exports = {
  root: true,
  extends: [
    '@react-native',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
  ],
  parser: '@typescript-eslint/parser', // Parse TypeScript code
  parserOptions: {
    parser: '@babel/eslint-parser', // Specify eslint parser for JSX syntax
    sourceType: 'module',
    ecmaVersion: 'latest',
    ecmaFeatures: { jsx: true },
  },
  plugins: [
    'react-refresh',
    '@typescript-eslint',
    'eslint-plugin-import',
    'eslint-plugin-react',
    'react',
  ],
  rules: {
    'no-cond-assign': 'error',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslintno-empty-interface': 'off',
    '@typescript-eslint/camelcase': 'off',
    // Disallow using quotes for object keys when unnecessary
    'quote-props': ['error', 'as-needed', { numbers: true }],
    // Disallow {some:some}
    'object-shorthand': ['error'],
    // Disallow new Object()
    'no-new-object': ['error'],
    // Disallow using 'var'
    'no-var': ['error'],
    // Disallow using new Array()
    'no-array-constructor': ['error'],
    // Prefer single quotes
    quotes: [1, 'single'],
    // Prefer using template strings
    'prefer-template': [1],
    // Template string spacing
    'template-curly-spacing': [1],
    // Disallow illegal escape characters in strings
    'no-useless-escape': ['error'],
    // Recommend using 'function foo(){}' and not 'const foo = function(){}'
    'func-style': [1, 'declaration', { allowArrowFunctions: true }],
    // Require wrapping immediately invoked expressions with parentheses
    'wrap-iife': ['error'],
    // Disallow using Object.assign, use {...obj} instead
    'prefer-rest-params': ['error'],
    // Disallow using new Function
    'no-new-func': ['error'],
    // Align function parameters when they span multiple lines
    'function-paren-newline': ['error', 'multiline'],
    // Disallow multiple imports of the same module
    'no-duplicate-imports': ['error'],
    // Disallow multiple imports from the same module
    'import/no-mutable-exports': [1],
    // Use arrow functions in callback functions
    'prefer-arrow-callback': ['error'],
    // Disallow >= and <= in arrow functions without parentheses
    'no-confusing-arrow': ['error'],
    // Disallow duplicate keys within an object
    'no-dupe-class-members': ['error'],
    // Disallow using 'forEach' and 'for...of'; use 'Array.forEach' instead
    'no-iterator': ['error'],
    // Disallow obj['key']; use obj.key instead
    'dot-notation': ['error'],
    // Disallow defining multiple variables with a single 'let' or 'const' statement
    'one-var': ['error', 'never'],
    // Disallow multiple assignments in a single statement (e.g., let a = b = c = 1)
    'no-multi-assign': ['error'],
    'operator-linebreak': [1],
    // Disallow unnecessary ternary expressions like 'a ? true : false'
    'no-unneeded-ternary': [1],
    // Use parentheses to clarify the order of operations in complex expressions on a single line
    'no-mixed-operators': ['error'],
    // Disallow splitting the if statement and its block onto separate lines when not using braces
    'nonblock-statement-body-position': ['error'],
    // Disallow line breaks before the opening brace of a block statement
    'brace-style': ['error'],
    // Don't use 'else' after a 'return' in an 'if' statement
    'no-else-return': ['error'],
    // Place each method call or property access on a new line when chaining multiple method calls
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 3 }],
    // Disallow padding within block scopes
    'padded-blocks': [1, 'never'],
    // Disallow multiple consecutive empty lines
    'no-multiple-empty-lines': [1],
    // Disallow direct mutation of state
    'react/no-direct-mutation-state': ['error'],
    // Require keys in lists
    'react/jsx-key': ['error'],
    '@typescript-eslint/ban-ts-ignore': 'off',
    // Require or disallow props to be placed on separate lines when using JSX
    'react/jsx-max-props-per-line': [
      'error',
      {
        maximum: 4,
        when: 'always',
      },
    ],
    'react/forbid-elements': ['off'],
    'arrow-spacing': ['error', { before: true, after: true }],
    // 'react/jsx-indent': 'error',
    'no-unused-vars': ['warn', { varsIgnorePattern: '' }],
    'no-shadow': ['off'],
    'no-undef': ['error'],
    'no-debugger': ['error'],
    // Allow '.js', '.jsx', and '.tsx' file extensions for React components
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.tsx'] },
    ],
    'import/first': 'off',
    'import/prefer-default-export': ['off'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'max-statements': ['error', 100],
    // Require or disallow the use of semicolons instead of ASI
    semi: [2, 'always'],
    // Enforce consistent spacing before and after semicolons
    'semi-spacing': 0,
    // Require variables within the same declaration block to be sorted
    'sort-vars': 0,
    // Require consistent spacing before blocks
    'space-before-blocks': [2, 'always'],
    // Require consistent spacing within parentheses
    'space-in-parens': [2, 'never'],
    // Require spaces around operators
    'space-infix-ops': 2,
    // Require consistent spacing before and after unary operators
    'space-unary-ops': [
      2,
      {
        words: true,
        nonwords: false,
      },
    ],
    '@typescript-eslint/no-explicit-any': ['warn'],
    // Require or disallow consistent spacing in comments (// or /*)
    'spaced-comment': [
      'error',
      'always',
      {
        line: {
          markers: ['/', 'eslint-disable'],
          exceptions: ['-', '+'],
        },
        block: {
          markers: ['!'],
          exceptions: ['*'],
          balanced: true,
        },
      },
    ],
    // Require or disallow Unicode BOM (Byte Order Mark)
    'unicode-bom': 1,
    // Require regular expressions to be enclosed in parentheses
    'wrap-regex': 0,
    // Require a space after a comma and disallow a space before a comma
    'comma-spacing': [
      2,
      {
        before: false,
        after: true,
      },
    ],
    // Require the use of triple equals (===)
    eqeqeq: 1,
    // Require a trailing comma after the last element in multi-line arrays/objects to prevent polluting the Git log in the previous line when adding elements in the future
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'ignore',
        exports: 'ignore',
        functions: 'ignore',
      },
    ],
    'react/react-in-jsx-scope': 0,
    'react/no-unknown-property': 0,
    'prettier/prettier': ['off'],
  },
};
