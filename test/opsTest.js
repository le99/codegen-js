const assert = require('chai').assert;
const cgConstructor = require('../')
const cg = require('../')();
const cgConf = require('../')({inDir:'./testDir', outDir:'./outDir'});
const cgConfLinux = require('../')({inDir:'./testDir', outDir:'./outDir', linux:true});
const fs = require("fs").promises;

cgConstructor.Handlebars.registerHelper('loud', function (aString) {
  return aString.toUpperCase()
});

beforeEach(async ()=>{
  await fs.mkdir('./testDir', {recursive: true});
  await  fs.writeFile('./testDir/f1.txt', 'hi');
});

afterEach(async ()=>{
  await fs.rmdir('./testDir', {recursive: true});
  await fs.rmdir('./outDir', {recursive: true});
});

describe("bad initialization", ()=>{
  it("bad inDir", async ()=>{
    try{
      cgConstructor({inDir: {}});
      assert.fail();
    }
    catch(err){
      assert.equal(err.message, "inDir must be a string")
    }
  });
  
  it("bad outDir", async ()=>{
    try{
      cgConstructor({outDir: {}});
      assert.fail();
    }
    catch(err){
      assert.equal(err.message, "outDir must be a string")
    }
  });
  
  it("bad linux", async ()=>{
    try{
      cgConstructor({linux: "something"});
      assert.fail();
    }
    catch(err){
      assert.equal(err.message, "linux must be a boolean")
    }
  });
});


describe("copy", ()=>{
  it("same folder", async ()=>{

    let f2 = './testDir/f2.txt';

    await cg.copy('./testDir/f1.txt', f2)
    let f = await fs.stat(f2);
    assert.isTrue(f.isFile(), true);
  })
  
  it("sub folder", async ()=>{

    let f2 = './testDir/sub/f2.txt';

    await cg.copy('./testDir/f1.txt', f2)
    let f = await fs.stat(f2);
    assert.isTrue(f.isFile(), true);
  })
});


describe("copyDir", ()=>{
  it("same folder", async ()=>{

    await fs.mkdir('./testDir/dir1');
    await fs.writeFile('./testDir/dir1/t1.txt', 'hello');
    await cg.copyDir('./testDir/dir1', './testDir/dir2');
    let f = await fs.stat('./testDir/dir2/t1.txt');
    assert.isTrue(f.isFile(), true);
  })
});


describe("compile", ()=>{
  it("same folder", async ()=>{

    await fs.writeFile('./testDir/template.txt', '{{name}}');
    await cg.compile('./testDir/template.txt', {name: 'jhon'}, './testDir/res.txt');
    let f = await fs.readFile('./testDir/res.txt');
    assert.isTrue(f == 'jhon');
  })

  it("preserves permissions", async ()=>{
  
    await fs.writeFile('./testDir/script.sh', '#!/bin/bash\necho {{name}}');
    await fs.chmod('./testDir/script.sh', "755");
    await cg.compile('./testDir/script.sh', {name: 'jhon'}, './testDir/script2.sh');
    let f = await fs.stat('./testDir/script2.sh');
    assert.equal((f.mode & 0o7777).toString(8), "755");
  });

  it("bad inPath", async()=>{
    await fs.writeFile('./testDir/template.txt', '{{name}}');
    try{
      await cg.compile({}, {name: 'jhon'}, './testDir/res.txt');
      assert.fail()
    }
    catch(err){
      assert.equal(err.message, "inPath must be a string")
    }
  });

  it("bad outPath", async()=>{
    await fs.writeFile('./testDir/template.txt', '{{name}}');
    try{
      await cg.compile('./testDir/template.txt', {name: 'jhon'}, {} );
      assert.fail()
    }
    catch(err){
      assert.equal(err.message, "outPath must be a string")
    }
  });

});


describe("copy conf", ()=>{
  it("same folder", async ()=>{

    await cgConf.copy('./f1.txt', './f1.txt');
    let f = await fs.stat('./outDir/f1.txt');
    assert.isTrue(f.isFile(), true);
  })
  
  it("sub folder", async ()=>{
    await cgConf.copy('./f1.txt', './sub/f2.txt');
    let f = await fs.stat('./outDir/sub/f2.txt'); 
    assert.isTrue(f.isFile(), true);
  })


  it("same folder no outPath", async ()=>{

    await cgConf.copy('./f1.txt');
    let f = await fs.stat('./outDir/f1.txt');
    assert.isTrue(f.isFile(), true);
  })
  
});


describe("copyDir conf", ()=>{
  it("same folder", async ()=>{

    await fs.mkdir('./testDir/dir1');
    await fs.writeFile('./testDir/dir1/t1.txt', 'hello');
    await cgConf.copyDir('./dir1', './dir2');
    let f = await fs.stat('./outDir/dir2/t1.txt');
    assert.isTrue(f.isFile(), true);
  });
  
  it("same folder no outPath", async()=>{

    await fs.mkdir('./testDir/dir1')
    await fs.writeFile('./testDir/dir1/t1.txt', 'hello');
    await cgConf.copyDir('./dir1');
    let f = await fs.stat('./outDir/dir1/t1.txt');
    assert.isTrue(f.isFile(), true);
  })
  
});

describe("compile conf", ()=>{
  it("same folder", async ()=>{

    await fs.writeFile('./testDir/template.txt', '{{name}}');
    await cgConf.compile('./template.txt', {name: 'jhon'}, './testDir/res.txt' );
    let f = await fs.readFile('./outDir/testDir/res.txt');
    assert.isTrue(f == 'jhon');
  });
  
  it("same folder no outPath", async ()=>{

    await fs.mkdir('./testDir/subDir');
    await fs.writeFile('./testDir/subDir/template.txt', '{{name}}');
    await cgConf.compile('./subDir/template.txt', {name: 'jhon'} );
    let f = await fs.readFile('./outDir/subDir/template.txt');
    assert.isTrue(f == 'jhon');
  });
});


describe("copyDir linux", ()=>{
  it("same folder", async()=>{

    await fs.mkdir('./testDir/dir1');
    await fs.writeFile('./testDir/dir1/t1.txt', 'hello');
    await cgConfLinux.copyDir('./dir1', './dir2');
    let f = await fs.stat('./outDir/dir2/t1.txt');
    assert.isTrue(f.isFile(), true);
  });
  
  it("same folder no outPath", async() => {

    await fs.mkdir('./testDir/dir1');
    await fs.writeFile('./testDir/dir1/t1.txt', 'hello');
    await cgConfLinux.copyDir('./dir1');
    let f = await fs.stat('./outDir/dir1/t1.txt');
    assert.isTrue(f.isFile(), true);
  })
  
});

describe("compile with helper", ()=>{

  it("same folder", async ()=>{

    await fs.writeFile('./testDir/template.txt', '{{loud name}}');
    await cg.compile('./testDir/template.txt', {name: 'jhon'}, './testDir/res.txt' );
    let f = await fs.readFile('./testDir/res.txt');
    assert.isTrue(f == 'JHON');
  })

});