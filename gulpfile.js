var gulp = require('gulp'),
	sass = require('gulp-sass'),
	bourbon = require('node-bourbon'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create(),
	useref = require('gulp-useref'),
	uglify = require('gulp-uglify'),
	minifyCss = require('gulp-minify-css'),
	gulpif = require('gulp-if'),
	imagemin = require('gulp-imagemin'),
	del = require('del'),
	runSequence = require('run-sequence');

gulp.task('sass', function () {
  return gulp.src('app/sass/**/*.sass')
    .pipe(sass({
    	includePaths: require('node-bourbon').includePaths
    }).on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 35 versions'], cascade: false }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function () {
  gulp.watch('app/sass/*.sass', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/**/*.php', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function() {
    browserSync.init({
        proxy: "Clean-gulp-project"
    });
});

gulp.task('useref', function () {
    return gulp.src('app/*.php')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
	return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'))
});

gulp.task('fonts', function () {
	return gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))
});

gulp.task('libs', function () {
	return gulp.src('app/libs/**/*')
		.pipe(gulp.dest('dist/libs'))
});

gulp.task('clean', function () {
	del('dist');
});

gulp.task('build', function (callback) {
	runSequence('clean', 'sass', 'useref', 'images', 'fonts', 'libs', callback);
});

gulp.task('default', function (callback) {
	runSequence(['sass', 'browserSync', 'watch'], callback)
});

