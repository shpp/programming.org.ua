module.exports = {
  printWidth: 100,
  singleQuote: true,
  useTabs: false,
  tabWidth: 2,
  semi: true,
  bracketSpacing: true,
  endOfLine: 'lf',
  arrowParens: 'always',
  trailingComma: 'es5',
  overrides: [
    {
      files: ['**/*.hbs'],
      options: {
        // no other parser works correctly with handlebars :)
        parser: 'angular',
      },
    },
  ],
};
