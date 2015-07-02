# qConcept image processor

This is a script based on [GraphicsMagick](http://www.graphicsmagick.org/) to optimize and resize images for use on the qConcept platform


### How to Install
[GraphicsMagick](http://www.graphicsmagick.org/README.html) is a prerequisite, so install it first.

Then:

```shell
$ npm install Qlimt/convert-images
```

### How to Use

Usage: `npm start -- [options] <imagefile ...>`  
Or if you bave `babel` globally installed: `babel-node index.js [options] <imagefile ...>`

Takes an image as input and applies optimizations, outputting the results to './output/'

Options:

  -h, --help     output usage information
  -V, --version  output the version number

**NOTE:** The `.output/` directory must be empty!
