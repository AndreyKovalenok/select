const { src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass');
const sync = require('browser-sync').create();


function css() {
  return src('./select/**.scss')
    .pipe(sass())
    .pipe(dest('./select'))
}

function serve() {
  sync.init({
    server: './'
  });

  watch('**.html').on('change', sync.reload);
  watch('select/**.scss', series(css)).on('change', sync.reload);
  watch('**/**.js').on('change', sync.reload);
}

exports.start = series(css, serve);