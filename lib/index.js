'use strict';

const ops = require('./ops.js');

module.exports = (params) =>{

  let {copy, copyDir, compile, copyDirLinux} = ops;
  if(params && params.linux == true){
     copyDir = copyDirLinux;
  }
  
  if(!params){
    return {
      copy,
      copyDir,
      compile
    };
  }

  if(typeof params.inDir !== 'undefined' || typeof params.outDir !== 'undefined'){ 
    return {
      copy: (inPath, outPath)=>{
        if(typeof outPath !== 'undefined'){
          return copy(params.inDir+'/'+inPath, params.outDir+"/"+outPath)
        }
        return copy(params.inDir+'/'+inPath, params.outDir+"/"+inPath)
      },
      copyDir:(inPath, outPath)=>{
        if(typeof outPath !== 'undefined'){
          return copyDir(params.inDir+'/'+inPath, params.outDir+"/"+outPath) 
        }
        return copyDir(params.inDir+'/'+inPath, params.outDir+"/"+inPath)
      },
      compile:(inPath, context, outPath)=>{
        if(typeof outPath !== 'undefined'){
          return compile(params.inDir+'/'+inPath, context, params.outDir+"/"+outPath)
        }
        return compile(params.inDir+'/'+inPath, context, params.outDir+"/"+inPath)
      },
    };
  }
  else if(typeof params.inDir !== 'undefined' || typeof params.outDir == 'undefined'){ 
    return {
      copy: (inPath, outPath)=>{
        return copy(params.inDir+'/'+inPath, outPath)
      },
      copyDir:(inPath, outPath)=>{
        return copyDir(params.inDir+'/'+inPath, outPath)
      },
      compile:(inPath, context, outPath)=>{
        return compile(params.inDir+'/'+inPath, context, outPath)
      },
    };
  }
  else if(typeof params.inDir == 'undefined' || typeof params.outDir !== 'undefined'){   
    return {
      copy: (inPath, outPath)=>{
        if(typeof outPath !== 'undefined'){
          return copy(inPath, params.outDir+"/"+outPath)
        }
        return copy(inPath, params.outDir+"/"+inPath)
      },
      copyDir:(inPath, outPath)=>{
        if(typeof outPath !== 'undefined'){
          return copyDir(inPath, params.outDir+"/"+outPath)
        }
        return copyDir(inPath, params.outDir+"/"+inPath)
      },
      compile:(inPath, context, outPath)=>{
        if(typeof outPath !== 'undefined'){
          return compile(inPath, context, params.outDir+"/"+outPath)
        }
        return compile(inPath, context, params.outDir+"/"+inPath)
      },
    };
  }
  else{
    return {
      copy,
      copyDir,
      compile
    };
  }
}
