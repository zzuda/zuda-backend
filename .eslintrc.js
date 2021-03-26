module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['plugin:@typescript-eslint/recommended', 'airbnb-base', 'eslint-config-prettier'],
    env: {
      node: true,
      jest: true,
    },
    rules: {
      'arrow-body-style': 'off',
      'comma-dangle': 'off',
      'object-curly-newline': 'off',
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
      'linebreak-style': 'off',
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': [ 
        'error', {
          'devDependencies': [
            '**/*.test.ts',
            '**/*.spec.ts',
            '**/*.e2e-spec.ts'
          ]
        }
      ],
      'class-methods-use-this': 'off',
      'no-useless-constructor': 'off',
      'no-empty-function': 'off',

      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': ['error'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error']
    }
  };
