'use strict';

// require gulp
var gulp = require('gulp');

// Other required packages
var concat = require('gulp-concat');
var cssmin = require('gulp-minify-css');
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var php  = require('gulp-connect-php');
var browserSync = require('browser-sync').create();

var reload  = browserSync.reload;


// Default Gulp task
gulp.task('default', function() {
  // Intentionally left blank. You can add tasks for the gulp command here.
});



// Styles | Compiles Sass
// -----------------------------------
gulp.task('styles', function() {
  return gulp.src('assets/sass/**/*.scss')
    .pipe(sass({
      onError: function(err) {
            return notify().write(err);
        }
    }))
    .pipe(gulp.dest('assets/css/'))
});



// Image Optimization | Compresses images
// -----------------------------------
 gulp.task('image', function() {
  gulp.src('./assets/images/*')
    .pipe(imagemin({
      progressive: true,
      optimization: 8,
    }))
    .pipe(gulp.dest('assets/images'));
});



// PHP | Starts a new PHP server
// -----------------------------------
gulp.task('php', function() {
    php.server({ base: './', port: 8080, keepalive: true});
});

// BrowserSync | Loads BrowserSync
// -----------------------------------
gulp.task('browsersync', ['php'], function() {
    browserSync.init({
        proxy: '127.0.0.1:8080',
        port: 8080,
        open: true,
        notify: false,
        online: true
    });
});



// Serve | Launches your project
// * Use this to work on your project *
// -----------------------------------
gulp.task('serve', ['browsersync'], function() {
    gulp.watch(['./assets/sass/index.scss'], [reload]);
    gulp.watch(['./assets/sass/**/*.scss'], [reload]);
    gulp.watch(['./site/**/*.php'], [reload]);

});



// Build | Optimizes everything for deployment.
// Runs image and styles tasks and minifies CSS, adds brower prefixes
// * Use this before deploying your project *
// -----------------------------------
gulp.task('build', ['styles']['imagemin'], function() {
  return gulp.src('assets/css/index.css')
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
    .pipe(gulp.dest('./assets/css/dist'))  // Outputs minified CSS to /assets/dist
});