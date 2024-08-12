module.exports = {
  plugins: [
    [
      // https://github.com/csstools/postcss-preset-env?tab=readme-ov-file#browsers
      'postcss-preset-env',
      {
        browsers: ['>0.2%', 'not dead', 'not op_mini all'],
      },
    ],
  ],
};
