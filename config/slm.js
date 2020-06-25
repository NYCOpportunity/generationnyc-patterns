/**
 * Dependencies
 */

const package = require(`${process.env.PWD}/package.json`);
const tokens = require(`${process.env.PWD}/config/tokens`);

/**
 * Config
 */

module.exports = {
  src: 'src',
  views: 'views',
  dist: 'dist',
  marked: {
    gfm: true,
    headerIds: true,
    smartypants: true
  },
  beautify: {
    indent_size: 2,
    indent_char: ' ',
    preserve_newlines: false,
    indent_inner_html: false,
    wrap_line_length: 80,
    indent_inner_html: false,
  },
  package: package,
  process: {
    env: {
      NODE_ENV: process.env.NODE_ENV
    }
  },
  tokens: tokens,
  urls: {
    production: 'https://NYCOpportunity.github.io/generationnyc-patterns',
    cdn: `https://cdn.jsdelivr.net/gh/CityOfNewYork/generationnyc-patterns@v${package.version}/dist`
  }
};