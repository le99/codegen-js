'use strict';

const Handlebars = require("handlebars");
const fsPromises = require("fs").promises;
const path = require('path');

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const ncp = require('ncp').ncp;


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

  let fileMode;
  return createFolderIfNotExists(outputDir)
  .then(()=>{
    return fsPromises.stat(templatePath); 
  })
  .then((stat)=>{
    fileMode = stat.mode;
  })
  .then(()=>{
    return fsPromises.readFile(templatePath, 'utf8');
  })
  .then((template)=>{
    let res = Handlebars.compile(template)(context);
    return fsPromises.writeFile(outputPath, res, {mode:fileMode}); 
  });
}

module.exports.copy = function(inputPath, outputPath){
  let outputDir = path.parse(outputPath).dir;

  return createFolderIfNotExists(outputDir)
  .then(()=>{
    return fsPromises.copyFile(inputPath, outputPath);
  });
}

module.exports.copyDir = function(inputPath, outputPath){
  let outputDir = path.parse(outputPath).dir; 
  return createFolderIfNotExists(outputDir)
  .then(()=>{
    return new Promise((resolve, reject)=>{
      ncp(inputPath, outputPath, function (err) {
       if (err) {
         return reject(err);
       }
       resolve();
      });     
    });
  })
}

// Warning possibly Linux specific
// But very fast
module.exports.copyDirLinux = function(inputPath, outputPath){
  return exec(`mkdir -p ${outputPath}; cp -ap ${inputPath}/. ${outputPath}`)
  .catch((e)=>{
    throw e;
  });
}

module.exports.Handlebars = Handlebars;