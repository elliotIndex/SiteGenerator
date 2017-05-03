var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var mustache = require('gulp-mustache');
var pkg = require('./package.json');
// var templateGuide = require('./text/context.js');
// var templateGuide = require('./text/practicalGuide.js');
var templateGuide = require('./text/editable.js');

// Fill out HTML template with text
gulp.task('template-html', function() {
  return gulp.src('./templates/template.html.mustache')
    .pipe(mustache(templateGuide))
    .pipe(rename({extname: ''}))
    .pipe(browserSync.reload({stream: true}))
    .pipe(gulp.dest('./dist/'));
});

// Fill out CSS variables template with text
gulp.task('template-less', function() {
  return gulp.src('./templates/variables.less.mustache')
    .pipe(mustache(templateGuide))
    .pipe(rename({extname: ''}))
    .pipe(browserSync.reload({stream: true}))
    .pipe(gulp.dest('less'));
});

// Compile LESS files from /less into /css
gulp.task('less', ['template-less'], function() {
  return gulp.src('less/creative.less')
    .pipe(less())
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
    .pipe(rename({suffix: '.min'}))
    .pipe(browserSync.reload({stream: true}))
    .pipe(gulp.dest('./dist/'));
});

// Copy vendor libraries from /node_modules into dist/vendor
gulp.task('copy', function() {
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

  // move wrapper html file to dist
  gulp.src(['wrapper/wrapper.html'])
    .pipe(rename({basename: 'index'}))
    .pipe(gulp.dest('dist'))
})

// Build dist folder
gulp.task('build', [
  'template-less',
  'less',
  'template-html',
  'minify-css',
  'minify-js',
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
  gulp.watch('text/*.json', ['template-html', 'minify-css']);
  gulp.watch('templates/index.html.mustache', ['template-html']);
  gulp.watch('templates/variables.less.mustache', ['template-less']);
  gulp.watch('less/*.less', ['less']);
  gulp.watch('css/*.css', ['minify-css']);
  gulp.watch('js/*.js', ['minify-js']);
  // Reloads the browser whenever HTML, JS, or CSS files change
  gulp.watch('dist/*.html', browserSync.reload);
  gulp.watch('dist/*.css', browserSync.reload);
  gulp.watch('dist/*.js', browserSync.reload);
});
