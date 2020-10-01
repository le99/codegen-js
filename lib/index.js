'use strict';

const {copy, copyDir, compile, copyDirLinux} = require('./ops.js');

module.exports = (ops) =>{
  
  let inDir = '';
  let outDir = '';
  let linux = false;

  if(typeof ops !== 'undefined'){
    if(typeof ops.inDir !== 'undefined' && typeof ops.inDir !== 'string'){
      throw new Error('inDir must be a string');
    }
    else{
      inDir = formatDirPath(ops.inDir);
    }

    if(typeof ops.outDir !== 'undefined' && typeof ops.outDir !== 'string'){
      throw new Error('outDir must be a string');
    }
    else{
      outDir = formatDirPath(ops.outDir);
    }
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
      if(typeof inPath !== 'string'){
        throw new Error('inPath must be a string')
      }
      if(typeof outPath !== 'undefined' && typeof outPath !== 'string'){
        throw new Error('outPath must be a string')
      }

      if(typeof outPath !== 'undefined'){
        return copy(inDir+inPath, outDir+outPath)
      }
      return copy(inDir+inPath, outDir+inPath)
    },
    copyDir:(inPath, outPath)=>{
      if(typeof inPath !== 'string'){
        throw new Error('inPath must be a string')
      }
      if(typeof outPath !== 'undefined' && typeof outPath !== 'string'){
        throw new Error('outPath must be a string')
      }

      if(typeof outPath !== 'undefined'){
        return copyDirFunc(inDir+inPath, outDir+outPath) 
      }
      return copyDirFunc(inDir+inPath, outDir+inPath)
    },
    compile:(inPath, context, outPath)=>{
      if(typeof inPath !== 'string'){
        throw new Error('inPath must be a string')
      }
      if(typeof outPath !== 'undefined' && typeof outPath !== 'string'){
        throw new Error('outPath must be a string')
      }

      if(typeof outPath !== 'undefined'){
        return compile(inDir+inPath, context, outDir+outPath)
      }
      return compile(inDir+inPath, context, outDir+inPath)
    },
  };
  
}

function formatDirPath(path){
  if(typeof path == 'undefined'){
    return '';
  }
  else if(path.trim() !== '' && !path.endsWith('/')){
    return path.trim() + '/';
  }
  else{
    return path.trim();
  }
}