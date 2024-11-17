function enable(): void {
    console.info("Hola Mundo On");
}

function disable(): void {
    console.info("Adios Mundo");
}

function load(): void {
    console.info("Cargando Mundo!");
}

export const module = {
    onEnable: enable,
    onDisable: disable,
    onLoad: load
};
