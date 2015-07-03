#!/usr/bin/env node

/**
 * Module dependencies.
 */

import program from 'commander';
import clc from 'cli-color';

function error(...args) {
  console.error(clc.red.bold(args));
}
function warn(...args) {
  console.warn(clc.yellow(args));
}
function notice(...args) {
  console.log(clc.blue(args));
}

program
  .version('0.0.1')
  .description('Takes an image as input and applies optimizations, outputting the results to \'./output/\'')
  .usage('[options] <imagefile ...>')
  .parse(process.argv);

if (program.args.length !== 1) {
  error('A single filename must be given!');
  program.help();
}
let fileName =  program.args[0];

notice('Processing file:', fileName);

import gm from 'gm';
import fs from 'fs';

let outputDir = './output/';
fs.exists(outputDir, (exists) => {
  if (exists) {
    fs.exists(outputDir+'/*', (exists) => {
      error('Please clear \'./output\' dir');
      process.exit(0);
    });
  } else {
    fs.mkdirSync(outputDir);
  }
});

let optimizedOut = outputDir + 'bgImage.jpg';
let largeOut = outputDir + 'bgImage-1920x1080.jpg';
let mediumOut = outputDir + 'bgImage-1366x768.jpg';
let smallOut = outputDir + 'bgImage-360x640.jpg';


new Promise((resolve, reject) => {
  /*
   * Optimize original image
   */
  gm(fileName)
    // remove EXIF profile data
    .noProfile()
    // Optimize with quality setting of 85 (out of 100)
    .quality(85)
    // Slight blur for size purposes (`gaussian(radius [,sigma])`)
    // Ignoring this for now. Reduces size quite a bit but makes detailed images too blurry
    //.gaussian(0.05)
    // Sharpen it (`unsharp(radius [, sigma, amount, threshold])`)
    .unsharp(1, 0.5, 0.7, 0)
    // Interlace image (make it progressive) using "Plane" scheme
    .interlace('Plane')
    .write(optimizedOut, function (err) {
      if(err) {
        reject(err);
      }
      if (!err) {
        notice('done optimizing');
        resolve(optimizedOut);
      }
    });
}).then(file => {
  // Resize large image
  gm(file)
    .resize(null, 1080)
    .crop(1920, 1080, 0, 0)
    .write(largeOut, function (err) {
      if (err) error(err);
      if (!err) notice('large done');
    });

  // Resize medium image
  gm(file)
    .resize(null, 768)
    .crop(1366, 768, 0, 0)
    .write(mediumOut, function (err) {
      if (err) error(err);
      if (!err) notice('medium done');
    });

  // Resize small image
  gm(file)
    .resize(null, 640)
    .crop(360, 640, 503, 0) //503 X offset should make sure we crop out middle of image
    .write(smallOut, function (err) {
      if (err) error(err);
      if (!err) notice('small done');
    });

}).catch(err => {
  error(err);
});
