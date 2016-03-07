var gulp = require('gulp'),
  $ = require("gulp-load-plugins")(),
  runSequence = require('run-sequence'),
  stylus = require('gulp-stylus'),
  browserSync = require('browser-sync'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  browserifyShim = require('browserify-shim'),
  source = require('vinyl-source-stream');

var dir = {
  src: 'src',
  dist: 'dist'
};

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: dir.dist
    }
  });
});

gulp.task('browserify', function() {
  browserify(dir.src + '/scripts/app.js', { debug: true })
    .transform(babelify)
    .bundle()
    .on("error", function (err) { console.log("Error : " + err.message); })
    .pipe(source('scripts/bundle.js'))
    .pipe(gulp.dest(dir.dist))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('stylus', function() {
  return gulp.src([dir.src + '/{,**/}*.styl', '!src/stylesheets/{,**/}_*.styl'])
    .pipe($.plumber({
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    }))
    .pipe($.stylus({
      compress: false
    }))
    .pipe(gulp.dest(dir.dist))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('jade', function() {
  gulp.src([dir.src + '/{,**/}*.jade', '!src/partial/{,**/}_*.jade'])
    .pipe($.plumber())
    .pipe($.jade({
      pretty: true
    }))
    .pipe(gulp.dest(dir.dist))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('watch', function() {
  gulp.watch([
    dir.src + '/{,**/}*.styl'
  ], ['stylus']);

  gulp.watch([
    dir.src + '/{,**/}*.jade'
  ], ['jade']);

  gulp.watch([
    dir.src + '/scripts/{,**/}*.js'
  ], ['browserify']);

  gulp.watch([
    dir.src + '/{,**/}*.html',
    dir.src + '/{,**/}*.css',
    dir.src + '/{,**/}tiltable.js'
  ], ['copy']);

});


gulp.task('copy', function() {
  return gulp.src([
      dir.src + '/{,**/}*.html',
      dir.src + '/{,**/}*.css',
      dir.src + '/{,**/}*.{png,jpg,jpeg,gif,svg}',
      dir.src + '/{,**/}/lib/*.js',
      dir.src + '/{,**/}tiltable.js',
      dir.src + '/{,**/}rubbable.js'
    ])
    .pipe(gulp.dest(dir.dist));
});

gulp.task('default', [
  'browser-sync',
  'watch'
]);

gulp.task('build', function(callback) {
  return runSequence(
    'stylus',
    'jade',
    'browserify',
    'copy',
    callback
  );
});
