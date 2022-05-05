const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      USER: JSON.stringify(process.env.USER),
    }),
  ],
};
