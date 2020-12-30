const assert = require('chai').assert;

const cgConstructor = require('../')
const fs = require("fs").promises;

cgConstructor.Handlebars.registerHelper('loud', function (aString) {
  return aString.toUpperCase()
});

let cg;
let cgConfLinux;

beforeEach(async ()=>{
  cg = cgConstructor();
  cgConfLinux = cgConstructor({linux:true});
  await fs.mkdir('./testDir', {recursive: true});
  await fs.writeFile('./testDir/f1.txt', 'hi');
});

afterEach(async ()=>{
  await fs.rmdir('./testDir', {recursive: true});
  await fs.rmdir('./outDir', {recursive: true});
});

describe("bad initialization", ()=>{
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


describe("copy cd", ()=>{
  it('no cd', async() => {
    let c = cgConstructor();
    await cg.copy('./testDir/f1.txt', './outDir/f1.txt');
    let f = await fs.stat('./outDir/f1.txt');
    assert.isTrue(f.isFile(), true);
  });

  it('cd with no inDir', async() => {
    let c = cgConstructor();
    cg.cd(undefined, './outDir');
    await cg.copy('./testDir/f1.txt', './f1.txt');
    let f = await fs.stat('./outDir/f1.txt');
    assert.isTrue(f.isFile(), true);
  });
  
  it('cd with no outDir', async() => {
    let c = cgConstructor();
    cg.cd('./testDir');
    await cg.copy('./f1.txt', './outDir/f1.txt');
    let f = await fs.stat('./outDir/f1.txt');
    assert.isTrue(f.isFile(), true);
  });

  it('cd bad inDir', async() => {
    let c = cgConstructor();
    try {
      cg.cd(null, './test');
    }
    catch(e){
      assert.equal(e.message, 'inDir must be a string');
    }
  });

  it('cd bad outDir', async() => {
    let c = cgConstructor();
    try {
      cg.cd('./test', null);
    }
    catch(e){
      assert.equal(e.message, 'outDir must be a string');
    }
  });

  it("same folder", async ()=>{
    cg.cd('./testDir', './outDir');
    await cg.copy('./f1.txt', './f1.txt');
    let f = await fs.stat('./outDir/f1.txt');
    assert.isTrue(f.isFile(), true);
  })
  
  it("sub folder", async ()=>{
    cg.cd('./testDir', './outDir');
    await cg.copy('./f1.txt', './sub/f2.txt');
    let f = await fs.stat('./outDir/sub/f2.txt'); 
    assert.isTrue(f.isFile(), true);
  })


  it("same folder no outPath", async ()=>{
    cg.cd('./testDir', './outDir');
    await cg.copy('./f1.txt');
    let f = await fs.stat('./outDir/f1.txt');
    assert.isTrue(f.isFile(), true);
  })
  
});


describe("copyDir cd", ()=>{
  it("same folder", async ()=>{

    await fs.mkdir('./testDir/dir1');
    await fs.writeFile('./testDir/dir1/t1.txt', 'hello');
    cg.cd('./testDir', './outDir');
    await cg.copyDir('./dir1', './dir2');
    let f = await fs.stat('./outDir/dir2/t1.txt');
    assert.isTrue(f.isFile(), true);
  });
  
  it("same folder no outPath", async()=>{

    await fs.mkdir('./testDir/dir1')
    await fs.writeFile('./testDir/dir1/t1.txt', 'hello');
    cg.cd('./testDir', './outDir');
    await cg.copyDir('./dir1');
    let f = await fs.stat('./outDir/dir1/t1.txt');
    assert.isTrue(f.isFile(), true);
  })
  
});

describe("compile cd", ()=>{
  it("same folder", async ()=>{

    await fs.writeFile('./testDir/template.txt', '{{name}}');
    cg.cd('./testDir', './outDir');
    await cg.compile('./template.txt', {name: 'jhon'}, './testDir/res.txt' );
    let f = await fs.readFile('./outDir/testDir/res.txt');
    assert.isTrue(f == 'jhon');
  });
  
  it("same folder no outPath", async ()=>{

    await fs.mkdir('./testDir/subDir');
    await fs.writeFile('./testDir/subDir/template.txt', '{{name}}');
    cg.cd('./testDir', './outDir');
    await cg.compile('./subDir/template.txt', {name: 'jhon'} );
    let f = await fs.readFile('./outDir/subDir/template.txt');
    assert.isTrue(f == 'jhon');
  });
});


describe("copyDir linux", ()=>{
  it("same folder", async()=>{

    await fs.mkdir('./testDir/dir1');
    await fs.writeFile('./testDir/dir1/t1.txt', 'hello');
    cgConfLinux.cd('./testDir', './outDir');
    await cgConfLinux.copyDir('./dir1', './dir2');
    let f = await fs.stat('./outDir/dir2/t1.txt');
    assert.isTrue(f.isFile(), true);
  });
  
  it("same folder no outPath", async() => {

    await fs.mkdir('./testDir/dir1');
    await fs.writeFile('./testDir/dir1/t1.txt', 'hello');
    cgConfLinux.cd('./testDir', './outDir');
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