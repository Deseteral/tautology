const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ['build-js', 'build-html', 'build-css'], () => gulp);

gulp.task('build-js', () => gulp
  .src('src/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['es2015'],
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('build')));

gulp.task('build-html', () => gulp
  .src('src/**/*.html')
  .pipe(gulp.dest('build')));

gulp.task('build-css', () => gulp
  .src('src/**/*.css')
  .pipe(gulp.dest('build')));
