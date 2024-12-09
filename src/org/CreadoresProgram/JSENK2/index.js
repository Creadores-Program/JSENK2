(function(){
  console.info("§eEnable JSENK API 2...");
  script.registerScript({
      name: "JSENK",
      version: "2.0.2",
      description: "Run Node.JS in nukkit!",
      website: "https://github.com/Creadores-Program/JSENK2/",
      author: "Creadores Program"
  });
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
    let codecom = "";
    try{
      codecom = Babel.transform(code,{presets:['es2015']}).code;
    }catch(err){
      codecom = code;
    }
    return codecom;
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
  let pluginsJSENK2 = [];
  for each(let plJSE in java.util.Objects.requireNonNull(PluginsPathDir.listFiles())){
    if(plJSE.isDirectory() || !plJSE.getName().endsWith(".tgz")) continue;
    let DirPL = readTgz(plJSE);
    let packManiPL = JSON.parse(new java.lang.String(DirPL["package/package.json"]));
    if(pluginsJSENK2.indexOf(packManiPL.name) != -1){
      console.error("§cPlugin "+packManiPL.name+" Duplicate, remove one");
      continue;
    }
    pluginsJSENK2[pluginsJSENK2.length] = packManiPL.name;
    console.info("§eLoading Plugin "+ packManiPL.name+"...");
    for each(let filePLT in Object.keys(DirPL)){
      if(filePLT.endsWith(".js")){
        execJsModern(new java.lang.String(DirPL[filePLT]), "pluginsJSENK2/"+packManiPL.name+filePLT.replace("package", ""));
        continue;
      }
      if(filePLT.endsWith(".json")){
        execJsModern("module.exports = "+ new java.lang.String(DirPL[filePLT]) + ";", "pluginsJSENK2/"+packManiPL.name+filePLT.replace("package", ""));
        continue;
      }
      execJsModern("module.exports = `"+new java.lang.String(DirPL[filePLT]).replaceAll("`", "\\`")+"`;", "pluginsJSENK2/"+filePLT.replace("package", packManiPL.name));
    }
  }
  console.info("§eLoading Scripts...");
  for each(let script2s in java.util.Objects.requireNonNull(FilePathDir.listFiles())){
    if((script2s.isDirectory() || !script2s.getName().endsWith(".tgz")) || script2s.getAbsolutePath().startsWith(PluginsPathDir.getAbsolutePath())) continue;
    let DirScript = readTgz(script2s);
    let packManiSc = JSON.parse(new java.lang.String(DirScript["package/package.json"]));
    if(script.getScriptByName(packManiSc.name) != null){
      console.error("§cScript "+packManiSc.name+" Duplicate, remove one");
      continue;
    }
    console.info("§eLoading "+packManiSc.name+"...");
    if(packManiSc.dependencies != null){
      for each(let depend in Object.keys(packManiSc.dependencies)){
        if(depend.startsWith("pluginNukkit/")){
          if(manager.getPlugin(depend.replace("pluginNukkit/", "")) == null){
            console.error("Plugin "+depend.replace("pluginNukkit/", "")+" Not found!");
            continue;
          }
          contexto2eng.require.register(depend, function(module){
            module.exports = manager.getPlugin(depend.replace("pluginNukkit/", ""));
          });
        }
        if(depend.startsWith("java/url/")){
          contexto2eng.require.register(depend, function(module){
            module.exports = new NnClassLoader({ urls: [depend.replace("java/url/", "")] });
          });
        }
        if(depend.startsWith("java/maven/")){
          let subDep = depend.replace("java/maven/", "");
          let repo = [];
          if(subDep.indexOf("/mavenRe/") > -1){
            repo[0] = subDep.split("/mavenRe/")[0];
            subDep = subDep.split("/mavenRe/")[1];
          }
          contexto2eng.require.register(depend, function(module){
            module.exports = new NnClassLoader({ maven: [subDep+":"+packManiSc.dependencies[depend]], mavenRe: repo });
          });
        }
        if(depend.startsWith("scriptJSENK/")){
          if(script.getScriptByName(depend.replace("scriptJSENK/", "")) == null){
            console.warning("Script "+depend.replace("scriptJSENK/", "")+" Not found or not Load!");
            continue;
          }
        }
        if(depend.startsWith("pluginsJSENK2/")){
          if(pluginsJSENK2.indexOf(depend.replace("pluginsJSENK2/", "")) == -1){
            console.error("Plugin JSENK2 "+depend.replace("pluginsJSENK2/", "")+" Not found!");
            continue;
          }
        }
      }
    }
    for each(let fileScr in Object.keys(DirScript)){
      if(fileScr.endsWith(".js")){
        execJsModern(new java.lang.String(DirScript[fileScr]), fileScr.replace("package", packManiSc.name));
        continue;
      }
      if(fileScr.endsWith(".json")){
        execJsModern("module.exports = "+ new java.lang.String(DirScript[fileScr]) +";", fileScr.replace("package", packManiSc.name));
        continue;
      }
      execJsModern("module.exports = `"+new java.lang.String(DirScript[fileScr]).replaceAll("`", "\\`")+"`;", fileScr.replace("package", packManiSc.name));
    }
    script.registerScript({
      name: packManiSc.name,
      version: packManiSc.version,
      description: packManiSc.description,
      website: packManiSc.homepage,
      author: packManiSc.author
    });
    let mainSc = contexto2eng.require(packManiSc.name+"/"+packManiSc.main);
    if(mainSc.onEnable != null){
      script.addEventListener("Enable", mainSc.onEnable);
    }
    if(mainSc.onLoad != null){
      script.addEventListener("Load", mainSc.onLoad);
    }
    if(mainSc.onDisable != null){
      script.addEventListener("Disable", mainSc.onDisable);
    }
  }
})();
