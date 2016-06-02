// gulpfile.js 
var gulp = require('gulp');
var server = require('gulp-express');
var clean = require('gulp-clean');
var less = require('gulp-less');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var path = require('path');

gulp.task('clean', function () {
    return gulp
        .src('build', {read: false})
        .pipe(clean({force: true}));
});

gulp.task('copy', ['clean'], function () {
    return gulp
        .src([
            'src/public/**/*.*',
            'src/views/**/*.*'
        ], {base: './src'})
        .pipe(gulp.dest('build'));
});

gulp.task('less', function () {
    return gulp.src('./src/less/style.less')
        .pipe(less())
        .pipe(gulp.dest('./build/public/css'));
});

gulp.task('build', ['copy', 'less'], function () {
    return tsProject.src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest(function (file) {
            file.path = file.path.replace('src/', '');
            return 'build';
        }));
});

gulp.task('server', ['build'], function () {
    // Start the server at the beginning of the task
    server.run(['build/app.js']);

    // Restart the server when file changes
    gulp.watch(['src/less/**/*.less'], ['less']);
    gulp.watch(['app/scripts/**/*.js'], ['jshint']);
    gulp.watch(['app/images/**/*'], server.notify);
    gulp.watch(['src/app.ts', 'routes/**/*.js'], [server.run]);
});