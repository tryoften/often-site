// gulpfile.js 
var gulp = require('gulp');
var server = require('gulp-express');
var clean = require('gulp-clean');
var less = require('gulp-less');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var path = require('path');

gulp.task('server', function () {
    // Start the server at the beginning of the task 
    server.run(['app.js']);
 
    // Restart the server when file changes 
    gulp.watch(['app/**/*.html'], server.notify);
    gulp.watch(['app/styles/**/*.scss'], ['styles:scss']);
    //gulp.watch(['{.tmp,app}/styles/**/*.css'], ['styles:css', server.notify]); 
    //Event object won't pass down to gulp.watch's callback if there's more than one of them. 
    //So the correct way to use server.notify is as following: 
    gulp.watch(['{.tmp,app}/styles/**/*.css'], function(event) {
        gulp.run('styles:css');
        server.notify(event);
        //pipe support is added for server.notify since v0.1.5, 
        //see https://github.com/gimm/gulp-express#servernotifyevent 
    });
 
    gulp.watch(['app/scripts/**/*.js'], ['jshint']);
    gulp.watch(['app/images/**/*'], server.notify);
    gulp.watch(['app.js', 'routes/**/*.js'], [server.run]);
});

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

