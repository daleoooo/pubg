import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import glob from 'glob';
import pkg from './package.json';

const ignoreFolders = ['node_modules'];
const unMatchPattern = ignoreFolders.reduce((pattern, val) => `${pattern}|${val}`, '');
const matches = glob.sync(`!(${unMatchPattern})/index.js`);

function rollupPluginsCreator(plugins = []) {
  return plugins.concat([
    babel({
      exclude: ['node_modules/**'],
      plugins: ['external-helpers'],
    }),
    replace({
      'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
      __VERSION__: `"${pkg.version}"`,
    }),
    uglify(),
  ]);
}

const rollupConfigs = [];
matches.forEach((input) => {
  const outputBase = `dist/${input.match(/^(\S+)\//)[1]}`;

  rollupConfigs.push({
    input,
    output: {
      file: `${outputBase}/index.umd.js`,
      format: 'umd',
      name: 'train-constants',
    },
    plugins: rollupPluginsCreator([
      resolve(), // so Rollup can find `es6-polyfill`
      commonjs(), // so Rollup can convert `es6-polyfill` to an ES module
    ]),
  });

  rollupConfigs.push({
    input,
    output: [
      { file: `${outputBase}/index.cjs.js`, format: 'cjs' },
      { file: `${outputBase}/index.esm.js`, format: 'es' },
    ],
    plugins: rollupPluginsCreator(),
  });
});

module.exports = rollupConfigs;
