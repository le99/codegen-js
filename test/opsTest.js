const assert = require('chai').assert;
const cgConstructor = require('../')
const cg = require('../')();
const cgConf = require('../')({inDir:'./testDir', outDir:'./outDir'});
const cgConfLinux = require('../')({inDir:'./testDir', outDir:'./outDir', linux:true});
const fs = require("fs").promises;

beforeEach(()=>{
  return fs.mkdir('./testDir', {recursive: true})
    .then(()=>{
      return fs.writeFile('./testDir/f1.txt', 'hi');
    });
});

afterEach(()=>{
  return fs.rmdir('./testDir', {recursive: true})
  .then(()=>{
    return fs.rmdir('./outDir', {recursive: true})
  });
});

describe("bad initialization", ()=>{
  it("bad inDir", ()=>{
    try{
      cgConstructor({inDir: {}});
      assert.fail();
    }
    catch(err){
      assert.equal(err.message, "inDir must be a string")
    }
  });
  
  it("bad outDir", ()=>{
    try{
      cgConstructor({outDir: {}});
      assert.fail();
    }
    catch(err){
      assert.equal(err.message, "outDir must be a string")
    }
  });
  
  it("bad linux", ()=>{
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
  it("same folder", ()=>{

    let f2 = './testDir/f2.txt';

    return cg.copy('./testDir/f1.txt', f2)
      .then(()=>{
        return fs.stat(f2);
      }).then(f =>{
        assert.isTrue(f.isFile(), true);
      });
  })
  
  it("sub folder", ()=>{

    let f2 = './testDir/sub/f2.txt';

    return cg.copy('./testDir/f1.txt', f2)
      .then(()=>{
        return fs.stat(f2);
      }).then(f =>{
        assert.isTrue(f.isFile(), true);
      });
  })
});


describe("copyDir", ()=>{
  it("same folder", ()=>{

    return fs.mkdir('./testDir/dir1')
      .then(()=>{
        return fs.writeFile('./testDir/dir1/t1.txt', 'hello');
      })
      .then(()=>{
        return cg.copyDir('./testDir/dir1', './testDir/dir2')
      })
      .then(()=>{
        return fs.stat('./testDir/dir2/t1.txt');
      }).then(f =>{
        assert.isTrue(f.isFile(), true);
      });
  })
  
});


describe("compile", ()=>{
  it("same folder", ()=>{

    return fs.writeFile('./testDir/template.txt', '{{name}}')
      .then(()=>{
        return cg.compile('./testDir/template.txt', {name: 'jhon'}, './testDir/res.txt' )
      })
      .then(()=>{
        return fs.readFile('./testDir/res.txt');
      }).then(f =>{
        assert.isTrue(f == 'jhon')
      });
  })

  it("preserves permissions", ()=>{
  
    return fs.writeFile('./testDir/script.sh', '#!/bin/bash\necho {{name}}')
      .then(()=>{
        return fs.chmod('./testDir/script.sh', "755")
      })
      .then(()=>{
        return cg.compile('./testDir/script.sh', {name: 'jhon'}, './testDir/script2.sh' )
      })
      .then(()=>{
        return fs.stat('./testDir/script2.sh');
      })
      .then((s)=>{
        assert.equal((s.mode & 0o7777).toString(8), "755");
      });
  
  });

  it("bad inPath", ()=>{
    return fs.writeFile('./testDir/template.txt', '{{name}}')
      .then(()=>{
        try{
          return cg.compile({}, {name: 'jhon'}, './testDir/res.txt' )
        }
        catch(err){
          assert.equal(err.message, "inPath must be a string")
        }
      });
  });

  it("bad outPath", ()=>{
    return fs.writeFile('./testDir/template.txt', '{{name}}')
      .then(()=>{
        try{
          return cg.compile('./testDir/template.txt', {name: 'jhon'}, {} )
        }
        catch(err){
          assert.equal(err.message, "outPath must be a string")
        }
      });
  });

});


describe("copy conf", ()=>{
  it("same folder", ()=>{

    return cgConf.copy('./f1.txt', './f1.txt')
      .then(()=>{
        return fs.stat('./outDir/f1.txt');
      }).then(f =>{
        assert.isTrue(f.isFile(), true);
      });
  })
  
  it("sub folder", ()=>{
    return cgConf.copy('./f1.txt', './sub/f2.txt')
      .then(()=>{
        return fs.stat('./outDir/sub/f2.txt');
      }).then(f =>{
        assert.isTrue(f.isFile(), true);
      });
  })


  it("same folder no outPath", ()=>{

    return cgConf.copy('./f1.txt')
      .then(()=>{
        return fs.stat('./outDir/f1.txt');
      }).then(f =>{
        assert.isTrue(f.isFile(), true);
      });
  })
  
});


describe("copyDir conf", ()=>{
  it("same folder", ()=>{

    return fs.mkdir('./testDir/dir1')
      .then(()=>{
        return fs.writeFile('./testDir/dir1/t1.txt', 'hello');
      })
      .then(()=>{
        return cgConf.copyDir('./dir1', './dir2')
      })
      .then(()=>{
        return fs.stat('./outDir/dir2/t1.txt');
      }).then(f =>{
        assert.isTrue(f.isFile(), true);
      });
  })
  
  it("same folder no outPath", ()=>{

    return fs.mkdir('./testDir/dir1')
      .then(()=>{
        return fs.writeFile('./testDir/dir1/t1.txt', 'hello');
      })
      .then(()=>{
        return cgConf.copyDir('./dir1')
      })
      .then(()=>{
        return fs.stat('./outDir/dir1/t1.txt');
      }).then(f =>{
        assert.isTrue(f.isFile(), true);
      });
  })
  
});

describe("compile conf", ()=>{
  it("same folder", ()=>{

    return fs.writeFile('./testDir/template.txt', '{{name}}')
      .then(()=>{
        return cgConf.compile('./template.txt', {name: 'jhon'}, './testDir/res.txt' )
      })
      .then(()=>{
        return fs.readFile('./outDir/testDir/res.txt');
      }).then(f =>{
        assert.isTrue(f == 'jhon')
      });
  });
  
  it("same folder no outPath", ()=>{

    return fs.mkdir('./testDir/subDir').
      then(()=>{
        return fs.writeFile('./testDir/subDir/template.txt', '{{name}}')
      })
      .then(()=>{
        return cgConf.compile('./subDir/template.txt', {name: 'jhon'} )
      })
      .then(()=>{
        return fs.readFile('./outDir/subDir/template.txt');
      }).then(f =>{
        assert.isTrue(f == 'jhon')
      });
  });
});


describe("copyDir linux", ()=>{
  it("same folder", ()=>{

    return fs.mkdir('./testDir/dir1')
      .then(()=>{
        return fs.writeFile('./testDir/dir1/t1.txt', 'hello');
      })
      .then(()=>{
        return cgConfLinux.copyDir('./dir1', './dir2')
      })
      .then(()=>{
        return fs.stat('./outDir/dir2/t1.txt');
      }).then(f =>{
        assert.isTrue(f.isFile(), true);
      });
  })
  
  it("same folder no outPath", ()=>{

    return fs.mkdir('./testDir/dir1')
      .then(()=>{
        return fs.writeFile('./testDir/dir1/t1.txt', 'hello');
      })
      .then(()=>{
        return cgConfLinux.copyDir('./dir1')
      })
      .then(()=>{
        return fs.stat('./outDir/dir1/t1.txt');
      }).then(f =>{
        assert.isTrue(f.isFile(), true);
      });
  })
  
});
