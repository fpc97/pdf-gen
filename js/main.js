// Inicializacion
window.addEventListener("DOMContentLoaded", init);

function init() {
    document.getElementById("generar").addEventListener("click", generacion);
    console.log("asd");
}

// Validacion de input
function validacionRequerido(cont, funct, msg, ...campos) {
    // Resetea valores
    while (cont.firstChild) {
        cont.removeChild(cont.firstChild);
    }
    cont.classList.remove("mensaje-error");
    campos.map(x => x.classList.remove("activarequired"));

    // Si todo cumple devuelve true
    if (campos.every(x => funct(x))) return true;

    // Revisa cuales campos son invalidos
    campos.forEach(x => {
        if (!funct(x)) {
            x.classList.add("activarequired");
            let p = document.createElement('p');
            p.innerHTML = `<b>${x.placeholder.split("*")[0]}</b> ${msg}`;
            console.log(x.placeholder);
            cont.appendChild(p);
        }
    });
    cont.classList.add("mensaje-error");

    return false;
}

// Generacion de documento
function generacion() {
    const forma = document.getElementById("fp");
    const autorNombre = forma[id="us-nombre"];
    const autorApellido = forma[id="us-apellido"];
    const postTitulo = forma[id="post-titulo"];
    const postContenido = forma[id="post-contenido"];

    let valido = validacionRequerido(
        document.getElementById("mensaje-error"),
        function(x) {return x.value},
        "es obligatorio",
        postTitulo, postContenido);
}