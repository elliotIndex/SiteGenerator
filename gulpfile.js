var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var mustache = require('gulp-mustache')
var pkg = require('./package.json');

// Set the banner content
var banner = [
  '/*!\n', ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n', ' * Copyright 2013-' + (new Date()).getFullYear(),
  ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
  ' */\n',
  ''
].join('');

// Compile LESS files from /less into /css
gulp.task('less', function() {
  return gulp.src('less/creative.less')
    .pipe(less())
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({stream: true}))
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
  return gulp.src('css/creative.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename({suffix: '.min'}))
    .pipe(browserSync.reload({stream: true}))
    .pipe(gulp.dest('./dist/'));
});

// Minify JS
gulp.task('minify-js', function() {
  return gulp.src('js/creative.js')
    .pipe(uglify()).pipe(header(banner, {pkg: pkg}))
    .pipe(rename({suffix: '.min'}))
    .pipe(browserSync.reload({stream: true}))
    .pipe(gulp.dest('./dist/'));
});

// Fill out HTML template-html with text
gulp.task('template-html', function () {
  return gulp.src('./html/template.mustache')
    .pipe(mustache('./text/practicalGuide.json'))
    .pipe(rename({basename: 'index', extname: ".html"}))
    .pipe(browserSync.reload({stream: true}))
    .pipe(gulp.dest('./dist/'));
})

// Copy vendor libraries from /node_modules into dist/vendor
gulp.task('copy', function() {
  gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
    .pipe(gulp.dest('dist/vendor/bootstrap'))

  gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('dist/vendor/jquery'))

  gulp.src(['node_modules/magnific-popup/dist/*'])
    .pipe(gulp.dest('dist/vendor/magnific-popup'))

  gulp.src(['node_modules/scrollreveal/dist/*.js'])
    .pipe(gulp.dest('dist/vendor/scrollreveal'))

  gulp.src([
    'node_modules/font-awesome/**',
    '!node_modules/font-awesome/**/*.map',
    '!node_modules/font-awesome/.npmignore',
    '!node_modules/font-awesome/*.txt',
    '!node_modules/font-awesome/*.md',
    '!node_modules/font-awesome/*.json'
  ])
    .pipe(gulp.dest('dist/vendor/font-awesome'))


  gulp.src(['img/**/*.jpg'])
    .pipe(gulp.dest('dist/img'))
})

// Build dist folder
gulp.task('build', ['less', 'template-html', 'minify-css', 'minify-js', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
})

// Dev task with browserSync
gulp.task('dev', [
  'browserSync', 'build'
], function() {
  gulp.watch('less/*.less', ['less']);
  gulp.watch('css/*.css', ['minify-css']);
  gulp.watch('js/*.js', ['minify-js']);
  gulp.watch('html/*.mustache', ['template-html']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('dist/*.html', browserSync.reload);
  gulp.watch('dist/*.css', browserSync.reload);
  gulp.watch('dist/*.js', browserSync.reload);
});
