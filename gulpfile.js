var argv         = require('minimist')(process.argv.slice(2));
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync').create();
var concat       = require('gulp-concat');
var flatten      = require('gulp-flatten');
var gulpif       = require('gulp-if');

//var changed      = require('gulp-changed');

var gulp         = require('gulp');
var lazypipe     = require('lazypipe');
var minifyCss    = require('gulp-minify-css');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var jshint       = require('gulp-jshint');
var imagemin     = require('gulp-imagemin');
var tap          = require('gulp-tap');
var nodemon      = require('gulp-nodemon');
var merge        = require('merge-stream');
var plumber      = require('gulp-plumber');
var git          = require('gulp-git');

var manifest = require('asset-builder')('./assets/manifest.json');

var versionAfterBump;

// `path` - Paths to base asset directories. With trailing slashes.
// - `path.source` - Path to the source files. Default: `assets/`
// - `path.dist` - Path to the build directory. Default: `dist/`
var path = manifest.paths;

// `config` - Store arbitrary configuration values here.
var config = manifest.config || {};

config.production = argv.production === 1;

if(config.production)
    console.log(' >>> production mode enabled');

// `globs` - These ultimately end up in their respective `gulp.src`.
// - `globs.js` - Array of asset-builder JS dependency objects. Example:
//   ```
//   {type: 'js', name: 'main.js', globs: []}
//   ```
// - `globs.css` - Array of asset-builder CSS dependency objects. Example:
//   ```
//   {type: 'css', name: 'main.css', globs: []}
//   ```
// - `globs.fonts` - Array of font path globs.
// - `globs.images` - Array of image path globs.
// - `globs.bower` - Array of all the main Bower files.
var globs = manifest.globs;

// `project` - paths to first-party assets.
// - `project.js` - Array of first-party JS assets.
// - `project.css` - Array of first-party CSS assets.
var project = manifest.getProjectGlobs();

// Common js dev tasks
var jsDevTasks = function (buildName, path) {
    return lazypipe()
        .pipe(plumber)
        .pipe(function () {
            return gulpif(!config.production, sourcemaps.init());
        })
        .pipe(concat, buildName)
        .pipe(function(){
                return uglify({
                    compress: {
                        'drop_debugger': true
                    }
                });
            }
        )
        .pipe(function () {
            return gulpif(!config.production, sourcemaps.write('./'));
        })
        .pipe(browserSync.stream);;
};

var cssTasks = function (filename) {
    return lazypipe()
        .pipe(plumber)
        .pipe(function () {
            return gulpif(!config.production, sourcemaps.init());
        })
/*
        .pipe(function() {
            return gulpif('*.less', less());
        })
*/
        .pipe(function () {
                return gulpif('*.scss',
                    sass({
                        outputStyle: 'nested',
                        precision: 10,
                        includePaths: ['.'],
                        errLogToConsole: !config.production
                    })
                );
            }
        )
        .pipe(autoprefixer, {
            browsers: [
                'last 2 versions',
                'ie 10',
                'android 2.3',
                'android 4',
                'opera 12'
            ]
        })
        .pipe(minifyCss, {
            advanced: false,
            rebase: false,
            processImport: false
        })
        .pipe(concat, filename)
        .pipe(function () {
                return gulpif(!config.production,
                                sourcemaps.write('.')
                                );
                }
        )
        //.pipe(gulpif(config.production, rev()))
        .pipe(gulp.dest, path.dist)
        .pipe(browserSync.stream);
};


// Styles
// 'gulp styles' -> Compiles, combines, and optimizes Bower CSS and project CSS.
gulp.task('styles', function() {
    var _merge = merge();
    manifest.forEachDependency('css', function(dep) {
        var cssTasksInstance = cssTasks(dep.name);
        _merge
            .add(gulp.src(dep.globs, {base: 'styles'})
                    .pipe(
                        cssTasksInstance()
                    )
            );
    });
    return _merge.pipe(gulp.dest(path.dist));
});


// Builds dependencies, spcified in manifest.json
function buildJsDependencies(name){
    var _merge = merge();
    var dep = manifest.getDependencyByName(name);
    if(dep == undefined)
        return;
    _merge.add(
        gulp.src(dep.globs)
            .pipe(
            jsDevTasks(dep.name, dep.path)()
        )
    );

    return _merge
        .pipe(gulp.dest(path.dist));
}

// Builds App Scripts
gulp.task('js:app', function() {
    buildJsDependencies('app.js');
});

// Builds Vendor Scripts
gulp.task('js:vendor', function() {
    buildJsDependencies('jquery.js');
    buildJsDependencies('vendor.js');
});

// Moves Fonts to dist
gulp.task('fonts', function() {
    return gulp.src(globs.fonts)
        .pipe(flatten())
        .pipe(gulp.dest(path.dist+'/fonts'))
        .pipe(browserSync.stream());
});

//Optimizes and moves asset images
gulp.task('images', function() {
    return gulp.src('assets/images/**/**')
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}]
        }))
        .pipe(gulp.dest(path.dist+'/images'))
        .pipe(browserSync.stream());
});

// JSHint Task
gulp.task('jshint', function() {
    return gulp.src(['gulpfile.js','./app/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
        //.pipe(gulpif(!config.production, jshint.reporter('fail')));
});

//Remove all built files
gulp.task('clean', require('del').bind(null, path.dist));

//Start mock api server
gulp.task('apiserver', function (cb) {
    var started = false;

    return nodemon({
        script: 'server/index.js',
        watch:[]
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        if (!started) {
            cb();
            started = true;
        }
    });
});

// ### Wiredep
// `gulp wiredep` - Automatically inject Less and Sass Bower dependencies. See
// https://github.com/taptapship/wiredep
/*
gulp.task('wiredep', function() {
    var wiredep = require('wiredep').stream;

    return gulp.src('./index.html')
        .pipe(wiredep())
        .pipe(gulp.dest(path.dist ));
});
*/

// Git Release management
gulp.task('release:commit', ['release:rebuild'], function() {
    return gulp.src(['./package.json', 'dist/**/*'])
        .pipe(git.add())
        .pipe(git.commit(versionAfterBump));
});

gulp.task('release:tag', ['release:commit'], function() {
    git.tag(versionAfterBump, versionAfterBump);
});

gulp.task('release:commit', ['release:rebuild'], function() {
    return gulp.src(['./package.json', 'dist/**/*'])
        .pipe(git.add())
        .pipe(git.commit(versionAfterBump));
});

gulp.task('release:tag', ['release:commit'], function() {
    git.tag(versionAfterBump, versionAfterBump);
});

// End of the git release management


gulp.task('watch', function() {
    gulp.start('apiserver');

    browserSync.init({
        //server: "./",
        proxy: "http://localhost:5000",
        files: ["./*.html","./dist/**/**"],
        production : false,
        debug: true
    });

    gulp.watch(['assets/sass/**'], ['styles']);
    gulp.watch(['app/**'], ['js:app']);
    gulp.watch(['assets/fonts/**'], ['fonts']);
    gulp.watch(['assets/images/**'], ['images']);
    gulp.watch(['bower.json'], ['build']);
    gulp.watch(['assets/manifest.json'], ['build']);
});

gulp.task('build', ['styles', 'js:app', 'js:vendor', 'fonts', 'images']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});


