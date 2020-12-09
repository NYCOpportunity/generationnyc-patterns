/**
 * Dependencies
 */

const package = require(`${process.env.PWD}/package.json`);

/**
 * Config
 */

module.exports = {
  'output': `"${process.env.PWD}/src/config/_tokens.scss"`,
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
    'light-gray-dark': '#BDBDBD',
    'light-gray': '#E0E0E0',
    'light-gray-light': '#F2F2F2',
    'red-dark': '#EB5757',
    'red': '#FF7C69',
    'red-light': '#F4D8CD',
    'orange': '#F2994A',
    'yellow': '#FFD972',
    'green-dark': '#219653',
    'green': '#27AE60',
    'green-light': '#6FCF97',
    'blue-green': '#2AB7CA',
    'blue-dark': '#2F80ED',
    'blue': '#2D9CDB',
    'blue-light': '#56CCF2',
    'purple-dark': '#9B51E0',
    'purple': '#BB6BD9',
    'purple-light': '#F7B7FE'
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
  'google-fonts': '"https://fonts.googleapis.com/css2?family=Gothic+A1:wght@400;700&family=Istok+Web:wght@400;700"',
  'font': {
    'body': 'text-sans',
    'pre': 'monospace',
    'h1': 'display-sans',
    'h2': 'display-sans',
    'h3': 'display-sans',
    'h4': 'display-sans',
    'h5': 'display-sans',
    'h6': 'display-sans',
    'p': 'text-sans',
  },
  'font-weight': {
    'body': 'normal',
    'pre': 'normal',
    'h1': 'bold',
    'h2': 'bold',
    'h3': 'bold',
    'h4': 'bold',
    'h5': 'bold',
    'h6': 'bold',
  },
  'font-style': {
    'body': 'normal',
    'pre': 'normal'
  },
  'font-size': {
    'body': '1em',
    'pre': '0.9em',
    'h1': '30px',
    'h2': '26px',
    'h3': '22px',
    'h4': '20px',
    'h5': '18px',
    'h6': '14px',
    'p': '16px',
    'small': '10px'
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
  },
  'icons': [
    'icon-gen-chevron-up',
    'icon-gen-chevron-down',
    'icon-gen-chevron-left',
    'icon-gen-chevron-right'
  ]
};
