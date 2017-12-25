import rollupDefaultConfig from './../../rollup.config.js';

const globals = {
  '@angular/core': 'ng.core',
  'lodash-es': '_'
};
const external = Object.keys(globals);

const config = rollupDefaultConfig('changeDetection', {
  external,
  globals
});

export default config;
