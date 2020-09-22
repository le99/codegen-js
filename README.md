# codegen-js
Utility lib to generate code from handlebars templates

https://handlebarsjs.com/guide/

## Install
```bash 
npm install codegen-js
```

## Use Basic

```js 
const cg = require('codegen-js')();
//Path to handlebars template, data, output path
compilePromise = cg.compile('./testDir/template.txt', {name: 'jhon'}, './testDir/res.txt');

//Path file, path to copy file
copyPromise = cg.copy('./testDir/f1.txt', './outDir/f2.txt');

//Path dir, path to copy dir
copyDirPromise = cg.copyDir('./testDir', './outDir');
```

## Append all paths with inDir and with outDir

```js 
const cg = require('codegen-js')({inDir:'./inDir', outDir:'./outDir'});

//Path to handlebars template: ./inDir/testDir/template.txt
compilePromise = cg.compile('./testDir/template.txt', {name: 'jhon'}, './testDir/res.txt');

//Can omit the outputPath, will write to ./outDir/testDir/template.txt
compilePromise = cg.compile('./testDir/template.txt', {name: 'jhon'});
```

## Faster copyDir with linux

```js 
const cg = require('codegen-js')({inDir:'./inDir', outDir:'./outDir', linux: true});

//Path to handlebars template: ./inDir/testDir/template.txt
compilePromise = cg.compile('./testDir/template.txt', {name: 'jhon'}, './testDir/res.txt');

//Can omit the outputPath, will write to ./outDir/testDir/template.txt
compilePromise = cg.compile('./testDir/template.txt', {name: 'jhon'});
```
