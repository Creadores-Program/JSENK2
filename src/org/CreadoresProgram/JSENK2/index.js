(function(){
  console.info("§eEnable JSENK API 2...");
  let subEng = Java.type("javax.script.ScriptEngineManager");
  let $$_subEngineBabelCom = new subEng().getEngineByMimeType("text/javascript");
  $$_subEngineBabelCom.eval("load('https://cdn.jsdelivr.net/npm/babel-standalone@6.26.0/babel.min.js')");
  let contexto2eng = {};
  $$_subEngineBabelCom.put("global", contexto2eng);
  $$_subEngineBabelCom.eval("load('https://cdn.jsdelivr.net/npm/simple-browser-require@1.0.0/require.min.js')");
  let Babel = $$_subEngineBabelCom.get("Babel");
  delete $$_subEngineBabelCom;
  delete subEng;
  function compile(code){
    return Babel.transform(code,{presets:['es2015']}).code;
  }
  function execJsModern(code, path){
    path = (path || "anonymous/"+Math.random());
    let subf = new Function("module", "exports", "require", compile(code));
    contexto2eng.require.register(path, subf);
    return path;
  }
  let CommonAp = new NnClassLoader({ maven: ['org.apache.commons:commons-compress:1.27.1'] });
  function readTgz(file){
    let source = java.nio.file.Files.newInputStream(file.toPath());
    let gzip = new java.util.zip.GZIPInputStream(source);
    let TarArchiveInputStream = CommonAp.type('org.apache.commons.compress.archivers.tar.TarArchiveInputStream');
    let tar = new TarArchiveInputStream(gzip);
    let dir = {};
    try{
      let entry;
      while((entry = tar.getNextTarEntry()) != null){
        if(entry.isDirectory()) continue;
        let buffer = Java.to(new Array(1024), "byte[]");
        let bytesRead;
        let byteArr = new java.io.ByteArrayOutputStream();
        while((bytesRead = tar.read(buffer)) != -1){
          byteArr.write(buffer, 0, bytesRead);
        }
        dir[entry.getName()] = byteArr.toByteArray();
      }
    }catch(error){
      console.error("Error in open file tgz" + error.toString());
    }finally{
      source.close();
      gzip.close();
      tar.close();
    }
    return dir;
  }
  let PathDir = server.getPluginPath() + "JSENK2/";
  let FilePathDir = new java.io.File(PathDir);
  FilePathDir.mkdir();
  let PluginsPathDir = new java.io.File(PathDir + "JSENK2plugins/");
  PluginsPathDir.mkdir();
  console.info("§eLoading Plugins JSENK2...");
  for each(let plJSE in java.util.Objects.requireNonNull(PluginsPathDir.listFiles())){
    if(plJSE.isDirectory() || !plJSE.getName().endsWith(".tgz")) continue;
    let DirPL = readTgz(plJSE);
    let packManiPL = JSON.parse(new java.lang.String(DirPL["package/package.json"]));
    execJsModern(new java.lang.String(DirPL["package/" + packManiPL.main]), packManiPL.name+"/"+packManiPL.main);
  }
  for each(let script2s in java.util.Objects.requireNonNull(FilePathDir.listFiles())){
    if((script2s.isDirectory() || !script2s.getName().endsWith(".tgz")) || script2s.getAbsolutePath().startsWith(PluginsPathDir.getAbsolutePath())) continue;
    let DirScript = readTgz(script2s);
  }
})();
