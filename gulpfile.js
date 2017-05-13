var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var mustache = require('gulp-mustache');
var browserify = require('gulp-browserify');
var cssimport = require('gulp-cssimport');

// var pageData = require('./page-data/context.js');
// var pageData = require('./page-data/practicalGuide.js');
var pageData = require('./page-data/preprocessor.js');

// Fill out HTML template with page-data
gulp.task('template-html', function() {
  return gulp.src('./templates/template.html.mustache')
    .pipe(mustache(pageData))
    .pipe(rename({extname: ''}))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({stream: true}));
});

// Fill out CSS variables template with page-data
gulp.task('variables-less', function() {
  return gulp.src('./templates/variables.less.mustache')
    .pipe(mustache(pageData))
    .pipe(rename({extname: ''}))
    .pipe(gulp.dest('less'))
    .pipe(browserSync.reload({stream: true}));
});

// Concat less files
gulp.task('concat-less', ['variables-less'], function() {
  return gulp.src("less/creative.less")
    .pipe(cssimport({}))
    .pipe(gulp.dest("dist"));
});

// Create css page for templating only
gulp.task('template-less', function() {
  return gulp.src('./wrapper/less/template.less')
    .pipe(less())
    .pipe(gulp.dest('temp-css'))
    .pipe(browserSync.reload({stream: true}));
});

// Create less for wrapper
gulp.task('wrapper-less', function () {
  return gulp.src('wrapper/less/wrapper.less')
    .pipe(less())
    .pipe(gulp.dest('temp-css'))
    .pipe(browserSync.reload({stream: true}));
})

// Compile LESS files from /less into /css
gulp.task('less', ['concat-less', 'wrapper-less', 'template-less'], function() {
  return gulp.src('less/creative.less')
    .pipe(less())
    .pipe(gulp.dest('temp-css'))
    .pipe(browserSync.reload({stream: true}));
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
  return gulp.src('temp-css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({stream: true}));
});

// Minify JS
gulp.task('minify-js', function() {
  return gulp.src('js/creative.js')
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('copy-wrapper', function () {
  // move wrapper html file to dist
  return gulp.src(['wrapper/wrapper.html'])
    .pipe(rename({basename: 'index'}))
    .pipe(gulp.dest('dist'));
});

// Concat wrapper JS
gulp.task('concat-wrapper-js', function() {
    return gulp.src('./wrapper/js/*.js')
      .pipe(concat('wrapper.js'))
      .pipe(gulp.dest('dist'))
      .pipe(rename('wrapper.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist'))
      .pipe(browserSync.reload({stream: true}));
});

// browserify and Concat wrapper JS
gulp.task('concat-wrapper-js', function() {
    // Single entry point to browserify
    gulp.src('wrapper/js/wrapper.js')
        .pipe(browserify({
          insertGlobals : true,
          debug : !gulp.env.production
        }))
        .pipe(gulp.dest('./dist'))
});

// Copy vendor libraries from /node_modules into dist/vendor
gulp.task('copy', ['copy-wrapper'], function() {
  gulp.src([
    'node_modules/bootstrap/dist/**/*',
    '!**/npm.js',
    '!**/bootstrap-theme.*',
    '!**/*.map'
  ])
    .pipe(gulp.dest('dist/vendor/bootstrap'))

  gulp.src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/jquery/dist/jquery.min.js'
  ])
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

  // move images to dist folder
  gulp.src(['img/**/*.jpg'])
    .pipe(gulp.dest('dist/img'))
});

// Build dist folder
gulp.task('build', [
  'variables-less',
  'less',
  'template-html',
  'minify-css',
  'minify-js',
  'concat-wrapper-js',
  'copy'
]);

// Build site to publish
gulp.task('build-publish', [
  'variables-less',
  'less',
  'template-html',
  'minify-css',
  'minify-js',
  'concat-wrapper-js',
  'copy'
]);


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
  gulp.watch('page-data/*.js', ['template-html', 'minify-css']);
  gulp.watch('templates/template.html.mustache', ['template-html']);
  gulp.watch('templates/variables.less.mustache', ['variables-less']);
  gulp.watch('less/*.less', ['less']);
  gulp.watch('temp-css/*.css', ['minify-css']);
  gulp.watch('js/*.js', ['minify-js']);
  gulp.watch('wrapper/*.html', ['copy-wrapper']);
  gulp.watch('wrapper/js/*.js', ['concat-wrapper-js']);
  // Reloads the browser whenever HTML, JS, or CSS files change
  gulp.watch('dist/*.html', browserSync.reload);
  gulp.watch('dist/*.css', browserSync.reload);
  gulp.watch('dist/*.js', browserSync.reload);
});
