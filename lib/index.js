'use strict';

const ops = require('./ops.js');

module.exports = (params) =>{
  if(!params){
    return ops;
  }
  
  if(typeof params.inDir !== 'undefined' || typeof params.outDir !== 'undefined'){ 
    return {
      copy: (inPath, outPath)=>{
        return ops.copy(params.inDir+'/'+inPath, params.outDir+"/"+outPath)
      },
      copyDir:(inPath, outPath)=>{
        return ops.copyDir(params.inDir+'/'+inPath, params.outDir+"/"+outPath)
      }
    };
  }
  else if(typeof params.inDir !== 'undefined' || typeof params.outDir == 'undefined'){ 
    return {copy: (inPath, outPath)=>{
      return ops.copy(params.inDir+'/'+inPath, outPath)
    }};
  }
  else if(typeof params.inDir == 'undefined' || typeof params.outDir !== 'undefined'){  
    return {copy: (inPath, outPath)=>{
      return ops.copy(inPath, params.outDir+"/"+outPath)
    }};
  }
  else{
    return params;
  }
}
