/**
 * Dependencies
 */

let nodeResolve = require('@rollup/plugin-node-resolve'); // Locate modules using the Node resolution algorithm, for using third party modules in node_modules.
let replace = require('@rollup/plugin-replace');          // Replace content while bundling.

/**
 * Base module configuration. Refer to the package for details on the available options.
 *
 * @source https://rollupjs.org
 *
 * @type {Object}
 */
const rollup = {
  sourcemap: 'inline',
  format: 'iife',
  strict: true
};

/**
 * Plugin configuration. Refer to the package for details on the available options.
 *
 * @source https://github.com/rollup/plugins
 *
 * @type {Object}
 */
let plugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  nodeResolve.nodeResolve({
    browser: true,
    moduleDirectories: [
      'node_modules'
    ]
  })
];

/**
 * ES Module Exports
 *
 * @type {Array}
 */
module.exports = [
  {
    input: `./src/js/default.js`,
    output: [
      {
        name: 'Default',
        file: `./dist/js/default.js`,
        sourcemap: rollup.sourcemap,
        format: rollup.format,
        strict: rollup.strict
      }
    ],
    plugins: plugins,
    devModule: true
  }
];