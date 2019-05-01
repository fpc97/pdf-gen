// Inicializacion
window.addEventListener('DOMContentLoaded', init);

function desactivarDescargas() {
    let desc = Array.prototype.slice.call(document.getElementsByClassName('activable'));
    desc.map(x => {
        console.log(x);
        x.disabled = true;
        x.classList.add('desactivado');
    });
}

function activarDescargas() {
    let desc = Array.prototype.slice.call(document.getElementsByClassName('activable'));
    desc.map(x => {
        x.disabled = false;
        x.classList.remove('desactivado');
    });
}

function init() {
    document.getElementById('generar').addEventListener('click', generacion);
    desactivarDescargas();
}

// Validacion de input
function validacionInput(cont, funct, msg, ...campos) {
    // Resetea valores
    while (cont.firstChild) {
        cont.removeChild(cont.firstChild);
    }
    cont.classList.remove('mensaje-error');
    campos.map(x => x.classList.remove('activarequired'));

    // Si todo cumple devuelve true
    if (campos.every(x => funct(x)))
        return true;
    
    // Revisa cuales campos son invalidos
    campos.forEach(x => {
        if (!funct(x)) {
            x.classList.add('activarequired');
            let p = document.createElement('p');
            p.innerHTML = `<b>${x.placeholder.split('*')[0]}</b> ${msg}`;
            cont.appendChild(p);
        }
    });
    cont.classList.add('mensaje-error');
    return false;
}

// Creacion de PDF
function procesarInput(input, largoMax) {
    let cosas = [...input];
    let indice = 0;
    for (let i = 0; i < largoMax + 1; i++) {
        if (cosas[i] === " ") {indice = i}
    }
    if (indice === 0) {
        indice = largoMax + 1;
    }
    return input.slice(0, largoMax - 1);
}

function generarPdf(nombre, apellido, titulo, contenido) {
    var doc = new jsPDF();
    doc.text(20, 20, procesarInput(nombre, 20));
    doc.text(20, 50, procesarInput(apellido, 20));
    doc.text(24, 70, titulo);
    doc.text(25, 100, contenido);
    var string = doc.output('datauristring');
    document.getElementById('pdf-preview').setAttribute('src', string + "#toolbar=0");
}

// Desbloquear descarga

// Generacion de documento
function generacion() {
    const forma = document.getElementById('fp');
    const autorNombre = forma[id='us-nombre'];
    const autorApellido = forma[id='us-apellido'];
    const postTitulo = forma[id='post-titulo'];
    const postContenido = forma[id='post-contenido'];

    let valido = validacionInput(
        document.getElementById('mensaje-error'),
        function(x) {return x.value},
        'es obligatorio',
        postTitulo, postContenido);

    if (valido) {
        generarPdf(autorNombre.value, autorApellido.value, postTitulo.value, postContenido.value);
        activarDescargas();
    }
}