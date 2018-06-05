const debug = require('debug')('com:dev-compile');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const tasks = require('./tasks');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const theme = require('./theme');

const dist = 'dev';

const runDevServer = () => {
    const compileConfig = {
        entry: {
            vendor: [
                'react',
                'react-dom'
            ],
            example: './example/src/example.tsx',
            exampleCon: './example/src/exampleCon.tsx'
        },
        output: {
            filename: '[name].js',
            publicPath: ''
        },
        devtool: 'source-map',
        plugins: [
            new webpack.DefinePlugin({'process.env': {NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')}}),
            new CopyWebpackPlugin([
                {from: './gulp/antd/localfont/iconfont.eot', to: 'antd_iconfont.eot'},
                {from: './gulp/antd/localfont/iconfont.svg', to: 'antd_iconfont.svg'},
                {from: './gulp/antd/localfont/iconfont.ttf', to: 'antd_iconfont.ttf'},
                {from: './gulp/antd/localfont/iconfont.woff', to: 'antd_iconfont.woff'}
            ])
        ],
        resolve: {extensions: ['.ts', '.tsx', '.js', '.json']},
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        getCustomTransformers: () => ({
                            before: [tsImportPluginFactory({
                                libraryName: 'antd',
                                libraryDirectory: 'lib',
                                style: true
                            })]
                        }),
                        compilerOptions: {module: 'es2015'}
                    },
                    exclude: /node_modules/
                },
                {test: /\.css$/, use: ['style-loader', 'css-loader']},
                {
                    test: /\.less$/, use: [
                        {loader: 'style-loader'},
                        {loader: 'css-loader'},
                        {
                            loader: 'less-loader',
                            options: {modifyVars: theme}
                        }
                    ]
                },
                {test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader']},
                {enforce: 'pre', test: /\.js$/, loader: 'source-map-loader'},
                {
                    test: /\.(png|jpe?g|gif)(\?.*)?$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 8192,
                                name: '[name].[ext]'
                            }
                        }
                    ]
                }
            ]
        }
    };

    const compiler = webpack(compileConfig);
    const port = process.env.PORT || 8888;
    const server = new WebpackDevServer(
        compiler,
        {
            publicPath: '/',
            contentBase: './example/static/',
            inline: true
        }
    );

    server.listen(port, '0.0.0.0', () => {
        debug(`🌎  server on http://localhost:${port}`);
    });
}

gulp.task('clean', () => tasks.clean(dist));

gulp.task('compile', () => tasks.compile(dist, debug));

gulp.task('cssCompile', () => tasks.cssCompile(dist, debug));

gulp.task('watch', ['compile', 'cssCompile'], () => {
    runDevServer();

    gulp.watch([
        tasks.src,
        tasks.css
    ], () => {
        debug('detecting files changed, recompile');
        tasks.compile(dist, debug);
        tasks.cssCompile(dist, debug);
        debug('recompile complete');
    });
});

gulp.task('default', () => {
    runSequence('clean', 'watch');
});
