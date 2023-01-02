const { InjectManifest } = require('workbox-webpack-plugin');
const path = require('path');

module.exports = {
  webpack: function (config, env) {
    if (env === 'production') {
      config = removeSWPrecachePlugin(config);
      config.plugins.push(
        new InjectManifest({
          swDest: 'service-worker.js',
          swSrc: path.join(process.cwd(), 'public', 'service-worker.js'),
        }),
      );
    }
    return config;
  },
};

function removeSWPrecachePlugin(config) {
  const swPrecachePluginIndex = config.plugins.findIndex((element) => {
    return element.constructor.name === 'SWPrecacheWebpackPlugin';
  });
  if (swPrecachePluginIndex !== -1) {
    config.plugins.splice(swPrecachePluginIndex, 1);
  }
  return config;
}
