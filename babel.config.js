// babel.config.js
module.exports = {
  presets: [
    ['next/babel'],
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  // Ignore next/font files
  ignore: ['**/*.font.js'],
};
  