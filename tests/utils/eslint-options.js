const eslintOptions = {
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    babelOptions: {
      presets: [require.resolve('@babel/preset-react')]
   }
  }
};
module.exports = {eslintOptions};