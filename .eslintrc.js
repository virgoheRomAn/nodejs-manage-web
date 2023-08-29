module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	parser: 'vue-eslint-parser',
	parserOptions: {
		parser: '@typescript-eslint/parser',
		ecmaVersion: 12,
		sourceType: 'module'
	},
	extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', 'alloy', 'alloy/vue', 'alloy/typescript'],
	plugins: ['vue', '@typescript-eslint'],
	overrides: [
		{
			files: ['*.ts', '*.tsx', '*.vue'],
			rules: {
				'no-undef': 'off'
			}
		}
	],
	globals: {},
	rules: {
		'@typescript-eslint/consistent-type-definitions': 'off',
		'@typescript-eslint/prefer-for-of': 'off',
		'@typescript-eslint/ban-ts-ignore': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-redeclare': 'error',
		'@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/no-inferrable-types': 'off',
		'@typescript-eslint/consistent-type-assertions': 'off',
		'@typescript-eslint/no-useless-constructor': 'off',
		'@typescript-eslint/explicit-member-accessibility': 'off',
		'@typescript-eslint/no-invalid-this': 'off',
		'@typescript-eslint/no-unused-expressions': 'off',
		'@typescript-eslint/prefer-optional-chain': 'off',
		'vue/no-irregular-whitespace': [
			'error',
			{
				skipStrings: true,
				skipComments: false,
				skipRegExps: false,
				skipTemplates: false,
				skipHTMLAttributeValues: false,
				skipHTMLTextContents: false
			}
		],
		'vue/html-indent': [
			'off',
			'tab',
			{
				attribute: 1,
				baseIndent: 1,
				closeBracket: 0,
				alignAttributesVertically: true,
				ignores: []
			}
		],
		'vue/v-on-event-hyphenation': 0,
		'vue/no-duplicate-attributes': 'off',
		'vue/valid-v-model': 'off',
		'vue/no-unused-vars': 'off',
		'vue/custom-event-name-casing': 'error',
		'vue/attributes-order': 'off',
		'vue/one-component-per-file': 'off',
		'vue/html-closing-bracket-newline': 'off',
		'vue/max-attributes-per-line': 'off',
		'vue/multiline-html-element-content-newline': 'off',
		'vue/singleline-html-element-content-newline': 'off',
		'vue/attribute-hyphenation': 'off',
		'vue/html-self-closing': 'off',
		'vue/no-multiple-template-root': 'off',
		'vue/require-default-prop': 'off',
		'vue/no-v-model-argument': 'off',
		'vue/no-arrow-functions-in-watch': 'off',
		'vue/no-template-key': 'off',
		'vue/no-v-html': 'off',
		'vue/comment-directive': 'off',
		'vue/no-parsing-error': 'off',
		'vue/no-deprecated-v-on-native-modifier': 'off',
		'vue/multi-word-component-names': 'off',
		'vue/no-duplicate-attr-inheritance': 'off',
		'no-useless-escape': 'off',
		'no-async-promise-executor': 'off',
		'no-param-reassign': 'off',
		'no-sparse-arrays': 'error',
		'no-prototype-builtins': 'off',
		'no-constant-condition': 'off',
		'no-use-before-define': 'off',
		'no-restricted-globals': 'off',
		'no-restricted-syntax': 'off',
		'no-constant-binary-expression': 'off',
		'no-return-assign': 'off',
		'no-unreachable': 'off',
		'no-multiple-template-root': 'off',
		'no-unused-vars': 'off',
		'no-v-model-argument': 'off',
		'no-case-declarations': 'off',
		'no-console': 'off',
		// 函数重载
		'no-redeclare': 'off',
		'no-sequences': 'off',
		'no-extra-boolean-cast': 'off',
		'no-mixed-spaces-and-tabs': 'off',
		'no-extra-semi': 'error',
		'no-unexpected-multiline': 'error',
		'no-unsafe-finally': 'error',
		'no-fallthrough': 'error',
		'no-eq-null': 'error',
		'no-eval': 'error',
		'no-extend-native': 'error',
		'no-self-assign': 'off',
		'no-throw-literal': 'error',
		'no-shadow-restricted-names': 'error',
		'no-useless-constructor': 'off',
		'no-undefined': 'off',
		'no-class-assign': 'error',
		'no-const-assign': 'error',
		'no-invalid-this': 'off',
		'use-isnan': 'error',
		'guard-for-in': 'off',
		'valid-typeof': 'error',
		'constructor-super': 'error',
		'generator-star-spacing': 'off',
		'max-params': ['error', 10],
		'max-depth': ['error', 10],
		'max-nested-callbacks': ['error', 10],
		'no-empty': ['error', { allowEmptyCatch: true }],
		'no-multi-spaces': [
			'error',
			{
				ignoreEOLComments: true,
				exceptions: {
					Property: true,
					BinaryExpression: false,
					VariableDeclarator: true,
					ImportDeclaration: true
				}
			}
		],
		radix: 'off',
		complexity: 'off',
		quotes: [
			'error',
			'single',
			{
				avoidEscape: true,
				allowTemplateLiterals: true
			}
		]
	}
};
