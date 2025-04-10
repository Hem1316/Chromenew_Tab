const webpack = require("webpack");
const path = require("path");  // ✅ Import path
const PACKAGE = require("./package.json");

// WebPack Plugins.
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: [/node_modules/],
        use: ["babel-loader"],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack", "file-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.css$/,  // ✅ Add this rule to handle CSS files
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js"],
    alias: {
      "@twixt_chrome_new/images": path.resolve(
        __dirname,
        "src",
        "static",
        "assets",
        "images"
      ),
      "@twixt_chrome_new/components": path.resolve(
        __dirname,
        "src",
        "components"
      ),
    },
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "twixt_chrome_new.js",
    chunkFilename: "[name].js",
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.EnvironmentPlugin({
      VERSION: PACKAGE.version,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, "src/static/index.html"),
      APP_ROOT_ID: 'twixt_chrome_new',
      APP_VERSION: PACKAGE.version
    }),
    new CopyPlugin({
      patterns: [{ from: "./src/static/images", to: "images" }],
    }),
  ],
  devServer: {
    open: true,
    historyApiFallback: true,
    static: {
      directory: "./src/static",
    },
    hot: true,
    port: 3000,
    proxy: []
  },
};
