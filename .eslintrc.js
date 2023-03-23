module.exports = {
    env: {
        browser: true,
        commonjs: true,
        node: true,
        es2021: true,
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    overrides: [],
    plugins: ['prettier'],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
        'linebreak-style': 'off',
        quotes: ['error', 'single', { avoidEscape: true }],
        semi: ['error', 'always'],
        'no-console': 'off',
        'no-trailing-spaces': 'error',
    },
};
