const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      ENV_VALUE: JSON.stringify(process.env.ENV_VALUE),
      BASE_URI: JSON.stringify(process.env.BASE_URI),
      CLIENT_ID: JSON.stringify(process.env.CLIENT_ID),
      PING_URI: JSON.stringify(process.env.PING_URI),
      PING_REDIRECT_URI: JSON.stringify(process.env.PING_REDIRECT_URI),
      USERNAME: JSON.stringify(process.env.USERNAME),
    }),
  ],
};
