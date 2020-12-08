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
  'border': {
    'width': '3px',
    'style': 'solid',
    'radius': '16px'
  },
  'color': {
    'black': '#000',
    'white': '#FFF',
    'dark-gray-dark': '#333333',
    'dark-gray': '#4F4F4F',
    'dark-gray-light': '#828282',
    'ight-gray-dark': '#BDBDBD',
    'light-gray': '#E0E0E0',
    'light-gray-light': '#F2F2F2',
    'red': '#EB5757',
    'orange': '#F2994A',
    'yellow': '#F2C94C',
    'green-dark': '#219653',
    'green': '#27AE60',
    'green-light': '#6FCF97',
    'blue-dark': '#2F80ED',
    'blue': '#2D9CDB',
    'blue-light': '#56CCF2',
    'purple': '#9B51E0',
    'purple-light': '#BB6BD9'
  },
  'font-family': {
    'system': [
      '-apple-system', 
      'BlinkMacSystemFont', 
      '"Segoe UI"', 
      'Roboto', 
      'Oxygen-Sans', 
      'Ubuntu', 
      'Cantarell', 
      '"Helvetica Neue"', 
      'sans-serif'
    ],
    'monospace': 'monospace',
    'display-sans': [
      'Gothic A1', 'sans-serif'
    ],
    'text-sans': [
      'Istok Web', 'sans-serif'
    ]
  },
  'font': {
    'body': 'system',
    'pre': 'monospace'
  },
  'font-weight': {
    'body': 'normal',
    'pre': 'normal'
  },
  'font-style': {
    'body': 'normal',
    'pre': 'normal'
  },
  'font-size': {
    'body': '1em',
    'pre': '0.9em'
  },
  'line-height': {
    'body': '1.2',
    'pre': '1.5'
  },
  'grid': '8px', // 8px grid system
  'typography': {
    'small': '16px',
    'mobile': '18px',
    'tablet': '20px',
    'desktop': '22px'
  }
};
