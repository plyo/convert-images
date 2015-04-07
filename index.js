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
var fileName =  program.args[0];

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

// resize and remove EXIF profile data
gm(fileName)
.resize(240, 240)
.noProfile()
.write('./output/resize.png', function (err) {
  if(err) error(err);
  if (!err) notice('done');
});
