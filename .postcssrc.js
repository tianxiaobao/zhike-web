let saladConfig = require('./salad.config.json');
module.exports = ({webpack}) => {
  saladConfig.features.partialImport = {
    addDependencyTo: webpack
  };
  return {
    plugins: [
      require('postcss-salad')(saladConfig)
    ]
  }
}