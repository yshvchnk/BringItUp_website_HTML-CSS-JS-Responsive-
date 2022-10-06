"use strict";

const gulp = require("gulp");
const webpack = require("webpack-stream");
const browsersync = require("browser-sync");
const htmlmin = require("gulp-htmlmin");
const rename = require("gulp-rename");
const postcss = require("gulp-postcss");
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("autoprefixer");
const imgmin = require("gulp-imagemin");

const dist = "./dist/";

gulp.task("copy-html", () => {
    return gulp.src("./src/*.html")
                .pipe(htmlmin({ collapseWhitespace: true }))
                .pipe(gulp.dest(dist))
                .pipe(browsersync.stream());
});

gulp.task("build-css", () => {
  return gulp.src("./src/assets/css/style.css")
              .pipe(rename({suffix: '.min', prefix: ''}))
              .pipe(postcss([autoprefixer()]))
              .pipe(cleanCSS({compatibility: 'ie8'}))
              .pipe(gulp.dest('dist/assets/css'))
              .pipe(browsersync.stream());
});

gulp.task("build-js", () => {
    return gulp.src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'development',
                    output: {
                        filename: 'script.js'
                    },
                    watch: false,
                    devtool: "source-map",
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist))
                .on("end", browsersync.reload);
});

gulp.task("copy-assets", () => {
    gulp.src("./src/assets/font/*.*")
      .pipe(gulp.dest(dist + "/assets/font"));
    gulp.src("./src/assets/*.php")
      .pipe(gulp.dest(dist + "/assets"));
    gulp.src("./src/assets/*.json")
      .pipe(gulp.dest(dist + "/assets"));
    gulp.src("./src/assets/icons/**/*.*")
      .pipe(imgmin())
      .pipe(gulp.dest(dist + "/assets/icons"));
    return gulp.src("./src/assets/img/**/*.*")
              .pipe(imgmin())
              .pipe(gulp.dest(dist + "/assets/img"))
              .on("end", browsersync.reload);
});

gulp.task("watch", () => {
    browsersync.init({
        server: {
            baseDir: "./dist/",
            serveStaticOptions: {
                extensions: ["html"]
            }
        },
		port: 4000,
		notify: true
    });
    
    gulp.watch("./src/*.html", gulp.parallel("copy-html"));
    gulp.watch("./src/assets/**/*.*", gulp.parallel("copy-assets"));
    gulp.watch("./src/js/**/*.js", gulp.parallel("build-js"));
    gulp.watch("./src/css/*.css", gulp.parallel("build-css"));
});

gulp.task("build", gulp.parallel("copy-html", "copy-assets", "build-js", "build-css"));

gulp.task("build-prod-js", () => {
    return gulp.src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'production',
                    output: {
                        filename: 'script.js'
                    },
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist));
});

gulp.task("default", gulp.parallel("watch", "build"));