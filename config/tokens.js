/**
 * Dependencies
 */

const package = require(`${process.env.PWD}/package.json`);

/**
 * Config
 */

module.exports = {
  'output': '"./src/config/_tokens.scss"',
  'version': `"${package.version}"`,
  'cdn': `"https://cdn.jsdelivr.net/gh/NYCOpportunity/generationnyc-patterns@v${package.version}/dist/"`,
  'animate': {
    'ease-in-quint': 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
    'ease-out-quint': 'cubic-bezier(0.23, 1, 0.32, 1)',
    'animate-scss-speed': '0.75s',
    'animate-timing-function': 'cubic-bezier(0.23, 1, 0.32, 1)'
  },
};