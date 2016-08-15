var gulp = require('gulp');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var webserver = require('gulp-webserver');

gulp.task('build-vendor-scripts', function () {
  return gulp.src('./vendor/*.js')
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./app/'))
});

gulp.task('build-sources', function () {

  return gulp.src('./bin/index.js')
    .pipe(browserify({
      insertGlobals: true,
      debug: true,
    }))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./app/'));
});

gulp.task('web', ['default'], function() {

  gulp.watch('./bin/**/*.*', ['build-sources']);

  return gulp.src('app')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

gulp.task('default', ['build-sources']);
