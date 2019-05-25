// Inicializacion ------------------------------------------
'use strict';
window.addEventListener('DOMContentLoaded', init);

// Globales ------------------------------------------------
const DOCUMENTO_PRINCIPAL = {
    titulo: "",
    contenido: "",
    autorNombre: "",
    autorApellido: "",
    estilo: 1,
    nombreInterno: "",
    cambiarInfo: function(titulo, contenido, autorNombre, autorApellido, estilo) {
        this.titulo = titulo;
        this.contenido = contenido;
        this.autorNombre = autorNombre;
        this.autorApellido = autorApellido;
        this.estilo = estilo;
        this.nombreInterno = [...titulo].map(x => x === " " ? "-" : x).join("").toLowerCase();
        
        document.getElementById("desc-dct-descr").innerHTML = this.nombreInterno + '.pdf';
    }
};

// Funcionalidad -------------------------------------------
function desactivarDescargas() {
    let desc = Array.prototype.slice.call(document.getElementsByClassName('activable'));
    desc.map(x => {
        x.disabled = true;
        x.classList.remove('btn');
        x.classList.add('desactivado');
    });
}

function activarDescargas() {
    let desc = Array.prototype.slice.call(document.getElementsByClassName('activable'));
    desc.map(x => {
        x.disabled = false;
        x.classList.remove('desactivado');
        x.classList.add('btn');
    });
    document.getElementById('desc-dct-btn').addEventListener('click', descargaDirecta);
    document.getElementById('abrir-tab-btn').addEventListener('click', abrirDocTab);
}

function init() {
    document.getElementById('generar').addEventListener('click', generacionDoc);
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
    if (campos.every(x => funct(x))) return true;
    
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

function recortarFrase(input, largoMax) {
    // recortarFrase() corta el input en el ultimo espacio dentro 
    // del largo maximo con tal de no cortar una palabra por la mitad

    // Si el input esta por debajo del largo maximo lo devuelve como esta
    if (input.length <= largoMax) return input;

    let caracteres = [...input];
    let indice = 0;

    // Corta solo en los espacios
    for (let i = 0; i < largoMax + 1; i++) {
        if (caracteres[i] === ' ') indice = i;
    }

    // Si no hay espacios corta en el largo maximo
    if (indice === 0) {
        indice = largoMax + 1;
    }

    return input.slice(0, indice);
}

function borrarEspaciosRepetidos(s) {
    // Quita los espacios del principio y el final de s y pasa a array
    let sArr = [...s.trim()];

    let sNuevo = "";
    let enEspacio = false;

    // Solo toma el primer espacio de cualquier fila de espacios seguidos
    for (let i of sArr) {
        if (i == ' ' && !enEspacio) {
            sNuevo += i;
            enEspacio = true;
        }
        else if (i != ' ') {
            sNuevo += i;
            if (enEspacio) enEspacio = false;
        }
    }
    return sNuevo;
}

// GENERACION DE DOCUMENTO
function mesEsp(n){
    const meses = [
        'enero',
        'febrero',
        'marzo',
        'abril',
        'mayo',
        'junio',
        'julio',
        'agosto',
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre'
    ]
    return meses[n];
}

function generarMjeCreacion(arch) {
    let str = 'Este documento fue generado';

    // Autor
    let autorNombre = arch.autorNombre;
    let autorApellido = arch.autorApellido;
    if (autorNombre || autorApellido) {
        str += ' por';
        if (autorApellido) str += ` ${autorApellido}`;
        if (autorNombre) str += `, ${autorNombre}`;
    }

    // Fecha
    let fecha = new Date();
    let mes = mesEsp(fecha.getMonth());
    let dia = fecha.getDate();

    if (dia === 1) str += ' a 1 día';
    else str += ` a los ${dia} días`;

    str += ` del mes de ${mes} de ${fecha.getFullYear()}.`;

    return str;
}

function generarPdf(arch) {
    const estilos = [
        // ESTILO 1
        function(nuevo, doc) {
            nuevo.setFillColor(195, 192, 224);
            nuevo.rect(30, 30, 58, 245, "F");

            nuevo.setFillColor(98, 94, 170);
            nuevo.rect(30, 30, 6, 245, "F");
            nuevo.rect(31, 50, 530, 41, "F");
            nuevo.rect(109, 271, 383, 3, "F");
            nuevo.rect(109, 211, 383, 3, "F");

            nuevo.setTextColor(255, 255, 255);
            nuevo.setFontSize(24);
            nuevo.text(
                doc.titulo.toUpperCase(),
                542,
                79,
                {
                    align: 'right',
                    maxWidth: 500
                }
            );

            nuevo.setTextColor(57, 63, 75);
            nuevo.setFontSize(14);
            nuevo.text(
                doc.contenido,
                116,
                116,
                {
                    maxWidth: 376,
                    align: 'justify'
                }
            );

            let mjeCreacion = generarMjeCreacion(doc);
            nuevo.setFontSize(11);
            nuevo.setFontStyle('bolditalic');
            nuevo.text(
                mjeCreacion,
                116,
                230,
                {
                    maxWidth: 360,
                    align: 'justify'
                }
            );

            return nuevo;
        },

        // ESTILO 2
        function(nuevo, doc) {

            nuevo.setFillColor(168, 94, 95);    // Rojo fuerte
            nuevo.rect(95, 95, 468, 178, 'F');

            nuevo.setFillColor(219, 195, 195);  // Rojo suave
            nuevo.rect(35, 28, 60, 245, 'F');

            nuevo.setFillColor(255, 255, 255);  // Blanco
            nuevo.rect(104, 103, 461, 74, 'F');
            nuevo.circle(95, 88, 123, 'F');

            nuevo.setFillColor(168, 94, 95);    // Rojo fuerte
            nuevo.rect(31, 28, 14, 245, 'F');
            nuevo.rect(95, 85, 468, 6, 'F');
            nuevo.circle(95, 88, 15, 'F');

            nuevo.setTextColor(168, 94, 95);    // Rojo fuerte
            nuevo.setFontSize(24);

            let tituloY = 79;
            if (doc.titulo.length >= 25) tituloY = 50;

            nuevo.text(
                doc.titulo.toUpperCase(),
                542,
                tituloY,
                {
                    align: 'right',
                    maxWidth: 430
                }
            );

            nuevo.setTextColor(57, 63, 75);     // Negro
            nuevo.setFontSize(14);
            nuevo.text(
                doc.contenido,
                559,
                122,
                {
                    maxWidth: 376,
                    align: 'right'
                }
            );

            nuevo.setTextColor(255, 255, 255);  // Blanco
            let mjeCreacion = generarMjeCreacion(doc);
            nuevo.setFontSize(11);
            nuevo.setFontStyle('bolditalic');
            nuevo.text(
                mjeCreacion,
                542,
                214,
                {
                    maxWidth: 354,
                    align: 'right'
                }
            );

            return nuevo;
        },

        // ESTILO 3
        function(nuevo, doc) {
            nuevo.setFillColor(182, 214, 209);  // Verde suave
            nuevo.rect(31, 28, 78, 245, "F");
            nuevo.rect(100, 185, 431, 88, "F");

            nuevo.setFillColor(92, 168, 156);    // Verde fuerte
            nuevo.rect(41, 49, 523, 46, "F");
            nuevo.rect(41, 103, 58, 170, "F");
            nuevo.rect(109, 211, 454, 41, "F");
            nuevo.rect(109, 260, 454, 14, "F");

            // Texto
            nuevo.setTextColor(57, 63, 75);     // Negro
            nuevo.setFontSize(14);
            nuevo.text(
                doc.contenido,
                123,
                117,
                {
                    maxWidth: 376,
                }
            );

            nuevo.setTextColor(255, 255, 255);  // Blanco
            nuevo.setFontSize(24);
            nuevo.text(
                doc.titulo.toUpperCase(),
                70,
                83,
                {
                    maxWidth: 480
                }
            );

            let mjeCreacion = generarMjeCreacion(doc);
            nuevo.setFontSize(11);
            nuevo.setFontStyle('bolditalic');
            nuevo.text(
                mjeCreacion,
                120,
                225,
                {
                    maxWidth: 375,
                }
            );


            return nuevo;
        },

        // ESTILO 4
        function(nuevo, doc) {
            nuevo.setFillColor(247, 220, 196);  // Anaranjado suave
            nuevo.rect(31, 28, 65, 58, "F");
            nuevo.rect(31, 97, 65, 177, "F");
            nuevo.rect(102, 192, 420, 41, "F");
            nuevo.rect(102, 192, 379, 82, "F");
            nuevo.circle(481, 233, 41, 'F');

            nuevo.setFillColor(247, 142, 50);   // Anaranjado fuerte
            nuevo.rect(31, 83, 533, 8, "F");
            nuevo.rect(102, 97, 405, 117, "F");
            nuevo.rect(102, 97, 462, 60, "F");
            nuevo.circle(507, 157, 57, 'F');

            // Texto
            nuevo.setTextColor(247, 142, 50);   // Anaranjado fuerte
            nuevo.setFontSize(24);
            nuevo.text(
                doc.titulo.toUpperCase(),
                543,
                79,
                {
                    align: 'right',
                    maxWidth: 440
                }
            );

            nuevo.setTextColor(255, 255, 255);   // Blanco
            nuevo.setFontSize(14);
            nuevo.text(
                doc.contenido,
                109,
                125,
                {
                    maxWidth: 376,
                    align: 'justify'
                }
            );

            nuevo.setTextColor(57, 63, 75);   // Negro
            let mjeCreacion = generarMjeCreacion(doc);
            nuevo.setFontSize(11);
            nuevo.setFontStyle('bolditalic');
            nuevo.text(
                mjeCreacion,
                116,
                230,
                {
                    maxWidth: 360,
                    align: 'justify'
                }
            );

            return nuevo;
        }
    ];

    let doc = estilos[arch.estilo](new jsPDF('p', 'pt', 'a4'), arch);
    return doc;
}

function generarURI(doc) {
    // Pasa el documento a base64
    console.log(doc.output('datauristring'));
    return doc.output('datauristring');
}

function mostrarPreview(doc) {
    // Hace que el <iframe> visualize el codigo base64 generado
    document.getElementById('pdf-preview').setAttribute('src', doc);
}

function generacionDoc() {
    // Toma el input de la forma
    const forma = document.getElementById('fp');
    const autorNombre = forma['us-nombre'];
    const autorApellido = forma['us-apellido'];
    const postTitulo = forma['post-titulo'];
    const postContenido = forma['post-contenido'];

    // Valida el input - En caso de no ser valido genera mensajes de error
    let valido = validacionInput(
        document.getElementById('mensaje-error'),
        x => {
            return [...x.value].some(y => y != ' ');
        },
        'es obligatorio',
        postTitulo,
        postContenido);

    
    if (valido) {
        // Procesa el input
        let nuevoTitulo = recortarFrase(borrarEspaciosRepetidos(postTitulo.value), 35);
        let nuevoContenido = postContenido.value;
        let nuevoNombre = recortarFrase(borrarEspaciosRepetidos(autorNombre.value), 20);
        let nuevoApellido = recortarFrase(borrarEspaciosRepetidos(autorApellido.value), 20);
        let nuevoEstilo = parseInt(document.querySelector('input[name="diseno"]:checked').value);

        // Reescribe el documento con el input
        DOCUMENTO_PRINCIPAL.cambiarInfo(nuevoTitulo, nuevoContenido, nuevoNombre, nuevoApellido, nuevoEstilo);
        
        // Muestra el documento en el <iframe>
        mostrarPreview(generarURI(generarPdf(DOCUMENTO_PRINCIPAL)));

        activarDescargas();
    }
}

// DESCARGA DE DOCUMENTO
function descargaDirecta() {
    let doc = generarPdf(DOCUMENTO_PRINCIPAL);
    doc.save(`${DOCUMENTO_PRINCIPAL.nombreInterno}.pdf`);
}

function abrirDocTab() {
    let uri = generarURI(generarPdf(DOCUMENTO_PRINCIPAL));
    window.open(
        uri,
        '_blank'
    );
}
