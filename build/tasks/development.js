'use strict';

const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
//const debug = require('gulp-debug');
//const path = require('path');
//const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const vueify = require('vueify');
const buffer = require('vinyl-buffer');
const postcss = require('gulp-postcss');
const precss = require('precss');
const cssnext = require('postcss-cssnext');
const postcssMixins = require('postcss-mixins');
const postcssSimpleVars = require('postcss-simple-vars');
const postcssNested = require('postcss-nested');

module.exports = function(gulp, config){

    gulp.task('styles', function() {
        const plugins = [
            cssnext({browsers: ['> 1%'], cascade: false}),
            precss(),
            postcssMixins(),
            postcssSimpleVars(),
            postcssNested()
        ];

        return gulp.src(config.stylesPath)
            .pipe(sourcemaps.init())
            .pipe(postcss(plugins))
            .pipe(concat('app.css'))
            .pipe(sourcemaps.write('maps'))
            .pipe(gulp.dest(config.DIST));
    });

    gulp.task('vendor', () => {
        return browserify(config.jsVendorEntryPointPaths)
            .transform(babelify)
            .bundle()
            .pipe(source('vendor.js'))
            .pipe(gulp.dest(config.DIST));
    });

    gulp.task('app', () => {
        return browserify(config.jsAppEntryPointPaths)
            .transform(babelify)
            .transform(vueify)
            .bundle()
			.pipe(source('app.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init())
			.pipe(sourcemaps.write('maps'))
            .pipe(gulp.dest(config.DIST));
    });

    gulp.task('assets', function(){
       return gulp.src(config.assetsPaths)
           .pipe(gulp.dest(config.DIST));
    });

    gulp.task('html', function(){
       return gulp.src(config.indexHtmlPath)
           .pipe(gulp.dest(config.DIST));
    });

    gulp.task('watch', function(){
       gulp.watch(config.jsPaths, gulp.series('js','html'));

       gulp.watch(config.stylesPaths, gulp.series('less','html'));

       gulp.watch(config.assetsPaths, gulp.series('assets'));

       gulp.watch(config.indexHtmlPath, gulp.series('html'));
    });

    return [
        gulp.parallel( 'vendor', 'app', 'assets', 'html') //'styles',
        //,'watch'
    ];

};