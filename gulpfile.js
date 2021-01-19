let preprocessor = 'scss';

const { src, dest, parallel, series, watch} = require('gulp');

const browserSync   = require('browser-sync').create();
const concat        = require('gulp-concat');
const uglify        = require('gulp-uglify-es').default;
const babel         = require('gulp-babel');
const sass          = require('gulp-sass'); 
const scss          = require('gulp-sass'); 
const autoprefixer  = require('gulp-autoprefixer'); 
const sourcemaps    = require('gulp-sourcemaps'); 
const cleancss      = require('gulp-clean-css');
const pug           = require('gulp-pug');
const formatHtml    = require('gulp-format-html');
const imagemin      = require('gulp-imagemin');
const imgCompress   = require('imagemin-jpeg-recompress');
const imgPngquant   = require('imagemin-pngquant');
const webpp         = require('gulp-webp');
const svgsprite     = require('gulp-svg-sprite');
const svgmin        = require('gulp-svgmin');
const rename        = require('gulp-rename');
const notify        = require('gulp-notify');
const plumber       = require('gulp-plumber');
const newer         = require('gulp-newer');
const del           = require('del');


function browsersync() {
    browserSync.init({
        server: {baseDir: 'app/' },
        notify: false,
        online: true
    })
}

function scripts() {
    return src([ 
        'node_modules/jquery/dist/jquery.min.js',
        // 'node_modules/jquery.maskedinput/src/jquery.maskedinput.js',
        'app/libs/svgxuse-master/svgxuse.min.js',
        // 'node_modules/swiper/swiper-bundle.min.js',
        // 'node_modules/gsap/dist/gsap.min.js',
        // 'node_modules/gsap/dist/ScrollTrigger.min.js',
        // 'app/libs/bootstrap/js/bootstrap.bundle.min.js',
    ])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify()) // Сжимаем JavaScript
    .pipe(dest('app/js/'))
    .pipe(browserSync.stream()) // Триггер обновления страницы
}

function mainscripts() {
    return src([ 
        'app/js/main.js'
    ])
    .pipe(babel({
        presets: ["@babel/preset-env"]
    }))

    //.pipe(uglify()) // Сжимаем JavaScript
    .pipe(rename({
        basename: "main"
    }))
    .pipe(dest('dist/js/'))
    .pipe(browserSync.stream()) // Триггер обновления страницы
}

function styles() {
    return src([ 
        'node_modules/normalize.css/normalize.css',
        // 'app/libs/bootstrap/css/bootstrap.min.css',
        // 'node_modules/swiper/swiper-bundle.min.css',
    ])
    
    .pipe(concat('styles.min.css')) // Конкатенируем в styles.min.css
    .pipe(dest('app/css/')) // 
    .pipe(browserSync.stream()) // Триггер обновления страницы
}

function mainstyles() {
    return src('app/' + preprocessor + '/main.' + preprocessor + '')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(eval(preprocessor)({ outputStyle: 'expand' }).on("error", notify.onError())) // Преобразуем значение переменной "preprocessor" в функцию
    .pipe(concat('main.css'))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
    .pipe(cleancss( { level: { 1: { specialComments: 0 } }, format: 'beautify' } )) // Минифицируем стили
    .pipe(sourcemaps.write('.'))
    .pipe(dest('app/css/')) // 
    .pipe(browserSync.stream()) // Триггер обновления страницы
}

function pug2html() {
    return src('app/pug/*.pug')
    .pipe(plumber())
    .pipe(pug().on("error", notify.onError()))
    .pipe(formatHtml())
    .pipe(dest('app/')) 
    .pipe(browserSync.stream()) // Триггер обновления страницы
}


function images() {
    return src('app/img/**/*') // Источник изображений
    .pipe(newer('dist/img/')) // Проверяем, было ли изменено (сжато) изображение ранее
    .pipe(imagemin([ // Сжимаем и оптимизируем изображенbя
        imgCompress({
            progressive: true,
            min: 70,
            max: 75
        }),
        imgPngquant({quality: [0.7, 0.75]})
    ])) 
    .pipe(dest('dist/img/')) // Выгружаем оптимизированные изображения в папку назначения
}


// Convert images to WEBP
function webp() {
    return src([
        'app/img/**/*.png',
        'app/img/**/*.jpeg',
        'app/img/**/*.jpg',
    ])
    .pipe(imagemin([
        imgCompress({
            progressive: true,
            min: 70,
            max: 75
        }),
        imgPngquant({quality: [0.7, 0.75]})
    ]))
    .pipe(webpp())
    .pipe(dest('app/img/webp/'))
}

// SVG-sprite
function svgSprite() {
    return src([
        'app/SVG-for-sprite/*.svg' // SVG файлы для спрайта
    ]) 
    .pipe(svgmin({
        js2svg: {
            pretty: true
        }
    }))
    .pipe(svgsprite({
            mode: {
                symbol: {        
                    sprite: "../sprite.svg"  // Имя файла SVG-спрайта
                }
            }
        }
    ))
    .pipe(dest('app/img/'))
}

function cleandist() {
    return del('dist/**/*', {forse: true})
}

function buildcopy() {
    return src([
        'app/*.html',
        'app/css/**/*.css',
        'app/css/**/*.map',
        'app/js/**/*.js',
        'app/fonts/**/*',
    ], { base: 'app'})
    .pipe(dest('dist'));
}

function startwatch() {
    watch(['app/' + preprocessor + '/**/*'], mainstyles);
    watch(['app/js/main.js']).on('change', browserSync.reload);;
    watch(['app/pug/**/*.pug'], pug2html);
    // watch(['app/img/**/*'], images);
}


exports.browsersync = browsersync;
exports.mainscripts = mainscripts;
exports.scripts = scripts;
exports.mainstyles = mainstyles;
exports.styles = styles;
exports.pug2html = pug2html;
exports.images = images;
exports.webp = webp;
exports.svgSprite = svgSprite;


exports.build = series(cleandist, pug2html, scripts, styles, mainstyles, images, buildcopy, mainscripts);
exports.default = parallel(scripts, mainstyles, styles, pug2html, browsersync, startwatch);