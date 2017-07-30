var gulp = require('gulp');
var i18next = require('i18next-parser');

gulp.task('translate', function() {
    gulp.src(['!node_modules/**', '**'])
        .pipe(i18next({
            output: 'i18n',
            locales: ['en', 'es'],
            functions: ['_'],
            extension: ".json",
            namespace: 'i18n',
            prefix: '$LOCALE.'
        }))
        .pipe(gulp.dest('i18n'));
});
