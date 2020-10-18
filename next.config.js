module.exports = {
  distDir: 'build',
  webpack: (config) => {
    // import markdown files
    config.module.rules.push(
      {
        test: /\.md$/,
        use: 'raw-loader'
      }
    )
    
    // generate source map
    config.devtool = 'source-map';
    for (const options of config.plugins) {
      if (options['constructor']['name'] === 'UglifyJsPlugin') {
        options.options.sourceMap = true;
        break;
      }
    }

    return config
  },
}