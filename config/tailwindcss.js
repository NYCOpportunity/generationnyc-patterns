/**
 * Dependencies
 */

// const defaultConfig = require('tailwindcss/defaultConfig');
const tokens = require('./tokens.js');

/**
 * Config
 */

module.exports = {
  theme: {
    colors: tokens.color,
    textColor: tokens.color,
    backgroundColor: tokens.color,
    borderColor: tokens.color,
  }
};
