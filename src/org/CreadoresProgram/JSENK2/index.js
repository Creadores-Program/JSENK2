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
    let source = java.nio.file.Files.newInputStream(file);
    let gzip = new java.util.zip.GZIPInputStream(source);
    let TarArchiveInputStream = CommonAp.type('org.apache.commons.compress.archives.tar.TarArchiveInputStream');
    let tar = new TarArchiveInputStream(gzip);
    let dir = [];
    try{
      let entry;
      while((entry = tar.getNextTarEntry()) != null){
        let file = entry.getFile();
        if(file.isDirectory()) continue;
        dir[dir.length] = [file.getAbsolutePath(), file];
      }
    }catch(error){
    }finally{
      source.close();
      gzip.close();
      tar.close();
    }
  }
  let PathDir = server.getPluginPath() + "JSENK2/";
  let FilePathDir = new java.io.File(PathDir);
  FilePathDir.mkdir();
  let PluginsPathDir = new java.io.File(PathDir + "JSENK2plugins/");
  PluginsPathDir.mkdir();
  console.info("§eLoading Plugins JSENK2...");
  for each(let plJSE in java.utils.Objects.requireNonNull(PluginsPathDir.listFiles())){
    if(plJSE.isDirectory() || !plJSE.getName().endsWith(".tgz")) continue;
    let DirPL = readTgz(plJSE);
  }
  for each(let script2s in java.utils.Objects.requireNonNull(FilePathDir.listFiles())){
    if(script2s.isDirectory() || !script2s.getName().endsWith(".tgz")) continue;
    let DirScript = readTgz(script2s);
  }
})();
