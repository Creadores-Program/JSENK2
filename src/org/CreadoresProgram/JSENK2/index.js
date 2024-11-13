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
  let PathDir = server.getPluginPath() + "JSENK2/";
  let FilePathDir = new java.io.File(PathDir);
  FilePathDir.mkdir();
  let PluginsPathDir = new java.io.File(PathDir + "JSENK2plugins/");
  PluginsPathDir.mkdir();
  console.info("§eLoading Plugins JSENK2...");
  for each(let plJSE in java.utils.Objects.requireNonNull(PluginsPathDir.listFiles())){
    if(plJSE.isDirectory() || !plJSE.endsWith(".tgz")) continue;
  }
  for each(let script2s in java.utils.Objects.requireNonNull(FilePathDir.listFiles())){
    if(script2s.isDirectory() || !script2s.endsWith(".tgz")) continue;
  }
})();
