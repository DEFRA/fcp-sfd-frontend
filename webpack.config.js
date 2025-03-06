import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'path'
import CopyPlugin from 'copy-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import WebpackAssetsManifest from 'webpack-assets-manifest'

const { NODE_ENV = 'development' } = process.env

const require = createRequire(import.meta.url)
const dirname = path.dirname(fileURLToPath(import.meta.url))

const govukFrontendPath = path.dirname(
  require.resolve('govuk-frontend/package.json')
)

const ruleTypeAssetResource = 'asset/resource'

/**
 * @type {Configuration}
 */
export default {
  context: path.resolve(dirname, 'src/client'),
  entry: {
    application: {
      import: ['./stylesheets/application.scss']
    }
  },
  experiments: {
    outputModule: true
  },
  mode: NODE_ENV === 'production' ? 'production' : 'development',
  devtool: NODE_ENV === 'production' ? 'source-map' : 'inline-source-map',
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000
  },
  output: {
    filename:
      NODE_ENV === 'production'
        ? 'stylesheets/[name].[contenthash:7].min.css'
        : 'stylesheets/[name].css',
    path: path.join(dirname, '.public'),
    publicPath: '/public/',
    libraryTarget: 'module',
    module: true
  },
  resolve: {
    alias: {
      '/public/assets': path.join(govukFrontendPath, 'dist/govuk/assets')
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        loader: 'source-map-loader',
        enforce: 'pre'
      },
      {
        test: /\.scss$/,
        type: ruleTypeAssetResource,
        generator: {
          binary: false,
          filename:
            NODE_ENV === 'production'
              ? 'stylesheets/[name].[contenthash:7].min.css'
              : 'stylesheets/[name].css'
        },
        use: [
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                loadPaths: [
                  path.join(dirname, 'src/client/stylesheets'),
                  path.join(dirname, 'src/server/common/components'),
                  path.join(dirname, 'src/server/common/templates/partials')
                ],
                quietDeps: true,
                sourceMapIncludeSources: true,
                style: 'expanded'
              },
              warnRuleAsWarning: true
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        type: ruleTypeAssetResource,
        generator: {
          filename: 'assets/images/[name][ext]'
        }
      },
      {
        test: /\.(ico)$/,
        type: ruleTypeAssetResource,
        generator: {
          filename: 'assets/images/[name][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: ruleTypeAssetResource,
        generator: {
          filename: 'assets/fonts/[name][ext]'
        }
      }
    ]
  },
  optimization: {
    minimize: NODE_ENV === 'production',
    providedExports: true,
    sideEffects: true,
    usedExports: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WebpackAssetsManifest(),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(govukFrontendPath, 'dist/govuk/assets'),
          to: 'assets'
        }
      ]
    })
  ],
  stats: {
    errorDetails: true,
    loggingDebug: ['sass-loader'],
    preset: 'minimal'
  },
  target: 'web'
}

/**
 * @import { Configuration } from 'webpack'
 */
