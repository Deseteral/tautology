const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const watchify = require('watchify');
const uglify = require('gulp-uglify');

gulp.task('default', ['build-html', 'build-css', 'build-prod'], () => gulp);
gulp.task('watch', ['build-html', 'build-css'], () => watch(),);

gulp.task('build-html', () => gulp
.src('src/**/*.html')
.pipe(gulp.dest('build')));

gulp.task('build-css', () => gulp
.src('src/**/*.css')
.pipe(gulp.dest('build')));

gulp.task('build-prod', () => {
  let bundler = browserify({
    entries: [__dirname + '/src/page.js'],
    basedir: __dirname,
    globals: false,
  }).transform("babelify", { presets: ["@babel/preset-env"] });

  return bundler
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('build'));
})

function compile(watch) {
  let bundler = watchify(browserify({
    entries: [__dirname + '/src/page.js'],
    basedir: __dirname,
    globals: false,
    debug: true // enables source maps
  }).transform("babelify", { presets: ["@babel/preset-env"] }));
  
  function rebundle() {
    bundler
    .require(__dirname + '/src/page.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'));
  }
  
  if (watch) {
    bundler.on('update', () => {
      console.log('Bundling...');
      rebundle();
    });
  }
  
  rebundle();
}

function watch() {
  return compile(true);
}
