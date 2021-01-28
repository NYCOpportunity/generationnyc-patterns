/**
 * Config
 */

const package = require(`${process.env.PWD}/package.json`);
const tokens = require(`${process.env.PWD}/config/tokens`);
const patterns = require(`${process.env.PWD}/src/slm/data/nav`);

/**
 * Config
 */

module.exports = {
  src: 'src',
  views: 'views',
  dist: 'dist',
  tokens: tokens,
  patterns: patterns,
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
  }
};