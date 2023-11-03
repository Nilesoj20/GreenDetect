//Textos de la pantalla principal
// Array de párrafos
var paragraphs = [
    "El reciclaje crea puestos de trabajo. La industria del reciclaje emplea a millones de personas en todo el mundo.",
    "El reciclaje se ha convertido en una práctica cada vez más común en todo el mundo. En la actualidad, más de 180 países tienen programas de reciclaje.",
    "El reciclaje puede ayudar a reducir la cantidad de residuos que terminan en los vertederos.",
    "Los vertederos son un importante contribuyente a la contaminación del aire y del agua.",
];

var typewriter = document.getElementById("typewriter");
var paragraphIndex = 0;
var currentIndex = 0;

function typeWriter() {
    if (currentIndex < paragraphs[paragraphIndex].length) {
        typewriter.textContent += paragraphs[paragraphIndex].charAt(currentIndex);
        currentIndex++;
        setTimeout(typeWriter, 30); // Velocidad de escritura (ajusta a tu preferencia)
    } else {
        setTimeout(function () {
            eraseText();
        }, 3000); // Tiempo antes de borrar el párrafo
    }
}

function eraseText() {
    if (currentIndex >= 0) {
        var text = paragraphs[paragraphIndex].substring(0, currentIndex);
        typewriter.textContent = text;
        currentIndex--;
        setTimeout(eraseText, 15); // Velocidad de borrado (ajusta a tu preferencia)
    } else {
        paragraphIndex = (paragraphIndex + 1) % paragraphs.length;
        setTimeout(typeWriter, 100); // Tiempo antes de escribir el siguiente párrafo
    }
}

// Iniciar el proceso de escritura
typeWriter()

function toggleParrafo1() {
    const parrafo1 = document.getElementById('mi-parrafo1');
    if (parrafo1.style.display === 'none') {
        parrafo1.style.display = 'block';
    } else {
        parrafo1.style.display = 'none';
    }
}

function toggleParrafo2() {
    const parrafo2 = document.getElementById('mi-parrafo2');
    if (parrafo2.style.display === 'none') {
        parrafo2.style.display = 'block';
    } else {
        parrafo2.style.display = 'none';
    }
}

function toggleParrafo3() {
    const parrafo3 = document.getElementById('mi-parrafo3');
    if (parrafo3.style.display === 'none') {
        parrafo3.style.display = 'block';
    } else {
        parrafo3.style.display = 'none';
    }
}