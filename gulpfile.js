const gulp = require('gulp');
const babelify = require('babelify');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

gulp.task('default', ['move-translations', 'browserify', 'build-html', 'build-css'], () => gulp);

gulp.task('move-translations', () => gulp
  .src(['./i18next/*.json'])
  .pipe(gulp.dest('build/i18next')));
  
gulp.task('browserify', (cb) => {
  const bundler = browserify({
    entries: [__dirname + '/src/page.js'],
    basedir: __dirname,
    globals: false,
    debug: true // enables source maps
  })
  bundler
    .transform(babelify.configure({
      presets: ["es2015"]
    }))
    .require(__dirname + '/src/page.js')
    .bundle()
    .on('error', cb)
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'))
    .on('end', cb)
})
  
gulp.task('build-html', () => gulp
.src('src/**/*.html')
.pipe(gulp.dest('build')));

gulp.task('build-css', () => gulp
.src('src/**/*.css')
.pipe(gulp.dest('build')));
