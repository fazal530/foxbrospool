const gulp = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const del = require('del');
const webpack = require('webpack');
const webpack_stream = require('webpack-stream');

gulp.task('styles', () => {
    return gulp.src('css/drupal.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('scripts', () => {
    return gulp.src('js/drupal.es6.js')
        .pipe(webpack_stream({
            mode: 'development',
            devtool: false,
            resolve: {
                fallback: {
                    buffer: require.resolve("buffer/"),
                    url: require.resolve("url/"),
                    util: require.resolve("util/"),
                },
            },
            output: {
                filename: 'drupal.js',
            },
            externals: {
                jquery: 'jQuery',
                drupal: 'Drupal',
                drupal_settings: 'drupalSettings',
            },
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    }
                ]
            },
            plugins: [
                new webpack.DefinePlugin({
                    'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG),
                })
            ]
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', () => {
    return del([
        'dist/*.css',
        'dist/*.js',
    ]);
});

gulp.task('default', gulp.series(['clean', 'styles', 'scripts']));
