const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: {
    playingcards: [path.join(__dirname, "/ts/main")],
    style: [path.join(__dirname, "/sass/main.scss")],
    playingcards_debug: [path.join(__dirname, "/ts/debug")],
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
      fs: false,
      buffer: require.resolve("buffer"),
      os: require.resolve("os-browserify"),
      stream: require.resolve("stream-browserify"),
      path: require.resolve("path-browserify"),
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
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
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
      VERSION_RELEASE: JSON.stringify(process.env.VERSION_RELEASE) || undefined,
    }),
    new TerserPlugin({
      extractComments: false,
      terserOptions: {
        compress: {
          warnings: false,
        },
      },
    }),
    new webpack.BannerPlugin({
      banner:
        "Playing Cards " +
        process.env.VERSION_RELEASE +
        "\n" +
        "https://github.com/KlutzyBubbles/playing-cards",
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new HtmlWebpackPlugin({
      chunks: ["playingcards"],
      template: "./html/index.html",
      inject: "header",
      filename: "index.html",
    }),
    new HtmlWebpackPlugin({
      chunks: ["playingcards_debug"],
      template: "./html/debug.html",
      inject: "header",
      filename: "debug.html",
    }),
  ],
  devtool: "source-map",
  target: "web",
};
