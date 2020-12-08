/**
 * Dependencies
 */

const package = require(`${process.env.PWD}/package.json`);
const tailwindcss = require('tailwindcss'); // utility framework/management
// const autoprefixer = require('autoprefixer'); // adds vendor spec prefixes
const cssnano = require('cssnano'); // modern css compiling/minification

/**
 * Config
 */

const PostCSS = {
  parser: 'postcss-scss',
  plugins: [
    // stylelint(package.stylelintConfig),
    tailwindcss(`${process.env.PWD}/config/tailwindcss.js`),
    // autoprefixer('last 4 version'),
    cssnano()
  ]
};

module.exports = PostCSS;
