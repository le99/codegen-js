'use strict';

const {copy, copyDir, compile, copyDirLinux, Handlebars} = require('./ops.js');
const path = require('path');

module.exports = (ops) =>{
  
  let inDir = '';
  let outDir = '';
  let linux = false;

  if(typeof ops !== 'undefined'){
    checkInDir(ops.inDir);
    inDir = ops.inDir;

    checkOutDir(ops.outDir);
    outDir = ops.outDir;

    if(typeof ops.linux !== 'undefined' && typeof ops.linux !== 'boolean'){
      throw new Error('linux must be a boolean');
    }
    else{
      linux = ops.linux;
    }
  }
  

  
  let copyDirFunc = copyDir; 
  if(linux === true){
     copyDirFunc = copyDirLinux;
  }

  return {
    copy: (inPath, outPath)=>{
      checkInPath(inPath);
      checkOutPath(outPath);

      if(typeof outPath !== 'undefined'){
        return copy(path.join(inDir, inPath), path.join(outDir,outPath));
      }
      return copy(path.join(inDir, inPath), path.join(outDir, inPath));
    },
    copyDir:(inPath, outPath)=>{
      checkInPath(inPath);
      checkOutPath(outPath);

      if(typeof outPath !== 'undefined'){
        return copyDirFunc(path.join(inDir, inPath), path.join(outDir, outPath));
      }
      return copyDirFunc(path.join(inDir, inPath), path.join(outDir, inPath));
    },
    compile:(inPath, context, outPath)=>{
      checkInPath(inPath);
      checkOutPath(outPath);

      if(typeof outPath !== 'undefined'){
        return compile(path.join(inDir, inPath), context, path.join(outDir, outPath));
      }
      return compile(path.join(inDir, inPath), context, path.join(outDir, inPath));
    },
  };
  
}

function checkInPath(path){
  if(typeof path !== 'string'){
    throw new Error('inPath must be a string')
  }
}
function checkOutPath(path){
  if(typeof path !== 'undefined' && typeof path !== 'string'){
    throw new Error('outPath must be a string')
  }
}

function checkInDir(inDir){
  if(typeof inDir !== 'undefined' && typeof inDir !== 'string'){
    throw new Error('inDir must be a string');
  }
}

function checkOutDir(outDir){
  if(typeof outDir !== 'undefined' && typeof outDir !== 'string'){
    throw new Error('outDir must be a string');
  }
}

module.exports.Handlebars = Handlebars;