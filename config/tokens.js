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
    'dark-gray': {
      light: '#828282',
      DEFAULT: '#484848',
      dark: '#333333',
    },
    'light-gray': {
      light: '#F2F2F2',
      DEFAULT: '#E0E0E0',
      dark: '#BDBDBD'
    },
    red: {
      light: '#F4D8CD',
      DEFAULT: '#FF7C69',
      dark: '#EB5757',
    },
    'orange': '#F2994A',
    'yellow': '#FFD972',
    'green': {
      lightest: '#A7E8BD',
      light: '#6FCF97',
      DEFAULT: '#27AE60',
      dark: '#219653',
    },
    'blue-green': '#2AB7CA',
    'blue': {
      light: '#56CCF2',
      DEFAULT: '#2D9CDB',
      dark: '#2F80ED',
    },
    'purple': {
      light: '#F7B7FE',
      DEFAULT: '#BB6BD9',
      dark: '#9B51E0',
    }
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
    'default': {
      'body': '16px',
      'pre': '0.9em',
      'h1': '46px',
      'h2': '40px',
      'h3': '34px',
      'h4': '28px',
      'h5': '22px',
      'h6': '16px',
      'p': '16px',
      'small': '12px'
    },
    'desktop': {
      'body': '16px',
      'pre': '0.9em',
      'h1': '64px',
      'h2': '56px',
      'h3': '48px',
      'h4': '40px',
      'h5': '32px',
      'h6': '24px',
      'p': '16px',
      'small': '12px'
    }
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
  ],
  'screens': {
    'desktop': '1024px',
    'tablet': '768px',
    'mobile': '375px',
  },
};
