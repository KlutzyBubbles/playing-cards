const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
var PACKAGE = require('./package.json');

module.exports = {
  mode: 'development',
  entry: {
    playingcards: [path.join(__dirname, "/ts/main")],
    style: [path.join(__dirname, "/sass/main.scss")],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    library: {
      name: "playingcards",
      type: "var",
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    fallback: {
      // fs: false,
      // buffer: require.resolve("buffer"),
      // os: require.resolve("os-browserify"),
      // stream: require.resolve("stream-browserify"),
      // path: require.resolve("path-browserify"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
      {
        test: /\.scss$/i,
        exclude: /node_modules/,
        type: "asset/resource",
        use: [
          {
            loader: "sass-loader",
          },
        ],
        generator: {
          filename: "style.css"
        }
      },
      {
        test: /\.(svg|path)$/,
        loader: 'svg-inline-loader'
      }
    ],
  },
  externals: {},
  plugins: [
    new webpack.DefinePlugin({
      VERSION_RELEASE: JSON.stringify(PACKAGE.version) || undefined,
    }),
    // new TerserPlugin({
    //   extractComments: false,
    //   terserOptions: {
    //     compress: {
    //       warnings: false,
    //     },
    //   },
    // }),
    new webpack.BannerPlugin({
      banner:
        "Playing Cards " +
        PACKAGE.version +
        "\n" +
        "https://github.com/KlutzyBubbles/playing-cards",
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new HtmlWebpackPlugin({
      chunks: ["playingcards"],
      template: "./html/index.html",
      inject: "header",
      filename: "index.html",
    }),
  ],
  devtool: "source-map",
  target: "web",
};
