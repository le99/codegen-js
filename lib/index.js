'use strict';

const {copy, copyDir, compile, copyDirLinux, Handlebars} = require('./ops.js');
const path = require('path');

module.exports = (ops) =>{
  
  let _inDir = '';
  let _outDir = '';

  let linux = false;
  if(ops && typeof ops.linux !== 'boolean'){
    throw new Error('linux must be a boolean');
  }
  if(ops && ops.linux === true){
    linux = true;
  }
  

  let copyDirFunc = copyDir; 
  if(linux === true){
     copyDirFunc = copyDirLinux;
  }

  return {
    cd: (inDir, outDir) => {

      if (typeof inDir !== 'undefined' && typeof inDir !== 'string'){
        throw new Error('inDir must be a string');
      }
      if (typeof outDir !== 'undefined' && typeof outDir !== 'string'){
        throw new Error('outDir must be a string');
      }

      if(typeof inDir === 'undefined'){
        _inDir = '';
      }
      else{
        _inDir = inDir;
      }

      if(typeof outDir === 'undefined'){
        _outDir = '';
      }
      else{
        _outDir = outDir;
      }
    },
    copy: (inPath, outPath)=>{
      checkInPath(inPath);
      checkOutPath(outPath);

      if(typeof outPath !== 'undefined'){
        return copy(path.join(_inDir, inPath), path.join(_outDir,outPath));
      }
      return copy(path.join(_inDir, inPath), path.join(_outDir, inPath));
    },
    copyDir:(inPath, outPath)=>{
      checkInPath(inPath);
      checkOutPath(outPath);

      if(typeof outPath !== 'undefined'){
        return copyDirFunc(path.join(_inDir, inPath), path.join(_outDir, outPath));
      }
      return copyDirFunc(path.join(_inDir, inPath), path.join(_outDir, inPath));
    },
    compile:(inPath, context, outPath)=>{
      checkInPath(inPath);
      checkOutPath(outPath);

      if(typeof outPath !== 'undefined'){
        return compile(path.join(_inDir, inPath), context, path.join(_outDir, outPath));
      }
      return compile(path.join(_inDir, inPath), context, path.join(_outDir, inPath));
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

module.exports.Handlebars = Handlebars;