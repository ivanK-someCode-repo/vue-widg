'use strict';

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const config = require('./build/config.js');
const packs = require('require-dir')('./build/tasks');
const packsKeys = Object.keys(packs);
let tasks = [];

//const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

for (let i=0; i < packsKeys.length; i++){
    let packTasks = packs[packsKeys[i]](gulp, config);

    for (let j=0; j < packTasks.length; j++){
        tasks.push(packTasks[j]);
    }
}

// gulp.task('watch', function(){
//     gulp.watch(config.allFiles, gulp.series(tasks));
// });

gulp.task('default', gulp.series(tasks));