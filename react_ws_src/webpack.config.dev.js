var path = require('path')
var webpack = require('webpack')

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: [
		'eventsource-polyfill',
		'webpack-hot-middleware/client',
		'./src/app'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	],
	module: {
    rules: [
      {
        test: /\.jsx?/,
        loaders: ["babel-loader"],
        include: path.join(__dirname, "src"),
      },
      {
        test: /(flickity|fizzy-ui-utils|get-size|unipointer|imagesloaded)/,
        loader: "imports-loader?define=>false&this=>window",
      }, 
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(ico|css|gif|png|html|jpg|xml|svg)$/,
        loader: "file-loader?name=[path][name].[ext]&context=./static",
      },
    ],
  },
}