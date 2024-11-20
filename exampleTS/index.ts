function enable(): void {
    console.info("Hola Mundo On");
}

function disable(): void {
    console.info("Adios Mundo");
}

function load(): void {
    console.info("Cargando Mundo!");
}
export const onEnable = enable;
export const onLoad = load;
export const onDisable = disable;
