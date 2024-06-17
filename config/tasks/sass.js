const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoPrefixer = require('gulp-autoprefixer');
const path = require('path');
const rename = require('gulp-rename');

const autoPrefixerSettings = {
  cascade: false,
};
const dest = './css';

// Configuration object for different SASS builds.
const builds = [
  // Keep this for future reference.
  // { src: './scss/components/**/*.scss', outputDir: 'components' },
  { src: './scss/bootstrap.scss', outputDir: '' },
  { src: './scss/libraries.scss', outputDir: '' },
  { src: './scss/modules.scss', outputDir: '' },
  { src: './scss/styles.scss', outputDir: '' },
  { src: './scss/typography.scss', outputDir: '' },
  { src: './scss/utilities.scss', outputDir: '' },
];

// Function to build SASS files.
function buildSass(entry) {
  return gulp
    .src(entry.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoPrefixer({ ...autoPrefixerSettings }))
    .pipe(rename({ dirname: entry.outputDir, extname: '.css' }))
    .pipe(gulp.dest(dest));
}

// Create build tasks for each SASS source file.
builds.forEach((entry) => {
  const taskName = `build:${entry.outputDir || path.basename(entry.src, '.scss')}`;
  gulp.task(taskName, function () {
    return buildSass(entry);
  });
});

// Create watch tasks for each SASS source file.
builds.forEach((entry) => {
  const sourceName = path.basename(entry.src).replace('.scss', '');
  const watchTaskName = `watch:${sourceName}`;
  gulp.task(watchTaskName, function () {
    gulp.watch(entry.src, gulp.series(`build:${entry.outputDir || sourceName}`));
  });
});

// Create a combined watch task for all SASS files.
const watchTasks = builds.map((entry) => `watch:${path.basename(entry.src).replace('.scss', '')}`);
gulp.task('watch:all', gulp.parallel(...watchTasks));

// Create a combined build:all task.
const buildTasks = builds.map((entry) => `build:${entry.outputDir || path.basename(entry.src, '.scss')}`);
gulp.task('build:all', gulp.parallel(...buildTasks));
