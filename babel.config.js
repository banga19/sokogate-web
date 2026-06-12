module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV);

  const isTest = api.env('test');

  return {
    presets: [
      ['@vue/babel-preset-app', {
        useBuiltIns: false,
        // In test mode, convert ES modules to CommonJS for Jest
        modules: isTest ? 'commonjs' : false,
      }],
    ],
  };
};
