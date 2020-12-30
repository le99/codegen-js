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

//Change directories
cg.cd('./inDir', './outDir');
// Copy ./inDir/testDir/f1.txt to ./outDir/d2/f2.txt
copyPromise = cg.copy('./testDir/f1.txt', './d2/f2.txt');

//Path to handlebars template: ./inDir/testDir/template.txt
compilePromise = cg.compile('./testDir/template.txt', {name: 'jhon'}, './testDir/res.txt');

//Can omit the outputPath, will write to ./outDir/testDir/template.txt
compilePromise = cg.compile('./testDir/template.txt', {name: 'jhon'});

```


## Customize Handlebars
```js
const cg = require('codegen-js')

cgConstructor.Handlebars.registerHelper('loud', function (aString) {
  return aString.toUpperCase()
})
// https://handlebarsjs.com/guide/expressions.html#helpers
```

## Faster copyDir with linux

```js 
const cg = require('codegen-js')({linux: true});
```
