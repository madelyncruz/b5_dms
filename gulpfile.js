console.log('****************************************');
console.log('** Bootstrap 5 SASS for DMS Template ***');
console.log('****************************************');

var gulp = require('gulp');
var requireDir = require('require-dir');
var tasks = requireDir('./config/tasks');

/* Default task */
gulp.task('default', gulp.parallel(
  'watch:all'
));
