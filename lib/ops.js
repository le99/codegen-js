'use strict';

const Handlebars = require("handlebars");
const fsPromises = require("fs").promises;
const path = require('path');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

// const OUTPUT_DIR = 'build';

// function getOutputPath(inpath, outPath){
//   if(typeof outPath === 'undefined'){
//     let d = path.parse(inpath).dir.split(path.sep);
//     d = d.slice(2);
//     d.unshift(OUTPUT_DIR);
//     d.unshift('.');
//     d.push(path.parse(inpath).base);
//     if(inpath.slice(-1) === '/'){
//       return path.join(...d) + '/';
//     }
//     return path.join(...d);
//   }
//   else {
//     let d = path.parse(outPath).dir.split(path.sep);
//     d.unshift(OUTPUT_DIR);
//     d.unshift('.');
//     d.push(path.parse(outPath).base);
//     if(inpath.slice(-1) === '/'){
//       return path.join(...d) + '/';
//     }
//     return path.join(...d);
//   }
// }

function createFolderIfNotExists(path){
  return fsPromises.stat(path)
  .catch((e)=>{
    if(e.code === 'ENOENT'){
      return fsPromises.mkdir(path, {recursive: true});
    }
    else{
      throw e;
    }
  });
}

/**
  If no outputPath is given ./build/ + templatePath is used
*/
module.exports.compile = function (templatePath, context, outputPath){
  let outputDir = path.parse(outputPath).dir;

  return createFolderIfNotExists(outputDir)
  .then(()=>{
    return fsPromises
      .readFile(templatePath, "utf8")
      .then((template) => {
        let res = Handlebars.compile(template)(context);
        return fsPromises.writeFile(outputPath, res);
      });
  })
  .catch((e)=>{
    console.log("ERROR: " + templatePath);
    throw e;
  });

}

module.exports.copy = function(inputPath, outputPath){
  let outputDir = path.parse(outputPath).dir;

  return createFolderIfNotExists(outputDir)
  .then(()=>{
    return fsPromises.copyFile(inputPath, outputPath);
  })
  .catch((e)=>{
    console.log("ERROR: " + inputPath);
    throw e;
  });
}

//Warning possibly Linux specific
module.exports.copyDir = function(inputPath, outputPath){
  return exec(`mkdir -p ${outputPath}; cp -ap ${inputPath}/. ${outputPath}`)
  .catch((e)=>{
    console.log("ERROR: " + inputPath);
    throw e;
  });
}


