function enable(){
    console.info("Hola Mundo On");
}
function disable(){
    console.info("Adios Mundo");
}
function load(){
    console.info("Cargando Mundo!");
}
module.exports = {
    onEnable: enable,
    onDisable: disable,
    onLoad: load
};