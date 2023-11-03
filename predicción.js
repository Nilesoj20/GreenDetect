let modelo = null;
const tamaño = 500;
let currentStream = null;
let video = document.getElementById("video")
let facingMode = "user";
let canvas = document.getElementById("canvas");
let otrocanvas = document.getElementById("otrocanvas");
let ctx = canvas.getContext("2d");

(async() => {
    console.log("Cargando modelo...");
    modelo = await tf.loadLayersModel("ModeloEntrenado/model3.json");
    console.log("Modelo cargado");
})();

// Cuando la ventana y todos los recursos están cargados, llama a la función mostrarCamara()
window.onload = function() {
    mostrarCamara();
}

/**
 * Accede a la cámara del dispositivo, establece el video como fuente del stream de la cámara
 * y llama a las funciones procesarCamara() y predecir() para procesar y predecir imágenes continuamente y 
 * si se produce un error, se muestra una alerta.
 */
function mostrarCamara() {
    const opciones = {
        audio: false,
        video: {
            width: tamaño, height: tamaño
        }
    }

    //Comprueba si el navegador es compatible con la función getUserMedia
    if (navigator.mediaDevices.getUserMedia) {
        console.log("solicitar cámara");
        //Solicita acceso a la cámara con las opciones especificadas 
        navigator.mediaDevices.getUserMedia(opciones)
            // Se ejecuta si se obtiene acceso a la cámara correctamente
            .then(function(stream) {
                // Almacena el flujo de video en la variable currentStream
                currentStream = stream;
                // Establece el flujo de video como fuente del elemento de video en el HTML
                video.srcObject = currentStream;
                console.log("Mostrar cámara");
                procesarCamara();
                predecir();
            })
            // Se ejecuta si hay un error al acceder a la cámara
            .catch(function(err) {
                alert("No se pudo utilizar la camara");
                console.log("error de cámara");
            })
    } else {
    alert("No existe la funcion getUserMedia");
    }
}

function apagarCamara() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
    }
}

function cambiarCamara() {
    // Comprueba si ya hay un flujo de cámara actual
    if (currentStream) {
        // Si hay un flujo de cámara actual, itera sobre todas las pistas del flujo para detenerlas.
        currentStream.getTracks().forEach(track => {
            track.stop();
        });
    }

    // Alterna entre la cámara frontal ("user") y la cámara trasera ("environment")
    /** 
     * operador ternario
     * variable = condición ? valor_si_verdadero : valor_si_falso;
     */
    facingMode = facingMode == "user" ? "environment" : "user";

    // Define las opciones para la nueva solicitud de acceso a la cámara
    const opciones = {
        audio: false,
        video: {
            facingMode: facingMode, // Establece la dirección de la cámara
            width: tamaño,          // Especifica el ancho del video
            height: tamaño         // Especifica la altura del video
        }
    };

    // Solicita acceso a la cámara con las nuevas opciones
    navigator.mediaDevices.getUserMedia(opciones)
    .then(function(stream) {
        // Se ejecuta si se obtiene acceso a la cámara correctamente
        currentStream = stream; // Almacena el nuevo flujo de cámara en currentStream
        video.srcObject = currentStream; // Establece el nuevo flujo de cámara en el elemento de video HTML
    })
    .catch(function(err) {
        // Se ejecuta si hay un error al acceder a la cámara
        console.log("Oops, hubo un error", err);
    });
}

function procesarCamara() {
    // Para dibujar el contenido del elemento de video en el lienzo
    ctx.drawImage(video, 0, 0, tamaño, tamaño, 0, 0, tamaño, tamaño);
    // Se establece un temporizador para llamar a la función con un breve retraso de 20 milisegundos
    setTimeout(procesarCamara, 20);
}

function predecir() {
    if (modelo != null) {
        // Resample el contenido del canvas a otro canvas con tamaño 100x100
        resample_single(canvas, 100, 100, otrocanvas);

        // Obtén los datos de imagen del otro canvas
        let ctx2 = otrocanvas.getContext("2d");
        let imgData = ctx2.getImageData(0, 0, 100, 100);

        // Preprocesa los datos de la imagen
        let arr = [];
        let arr100 = [];

        for (let p = 0; p < imgData.data.length; p += 4) {
            let rojo = imgData.data[p] / 255;
            let verde = imgData.data[p + 1] / 255;
            let azul = imgData.data[p + 2] / 255;

            // Calcula la escala de gris promedio
            let gris = (rojo + verde + azul) / 3;

            arr100.push([gris]);
            if (arr100.length == 100) {
                arr.push(arr100);
                arr100 = [];
            }
        }

        // Estructura los datos en un tensor 4D
        arr = [arr];
        let tensor = tf.tensor4d(arr);

        // Realiza la predicción utilizando el modelo
        let resolucion = modelo.predict(tensor).dataSync();
        let resultado = document.getElementById("resultado")

        // Determina la clase de la predicción
        let respuesta;
        if (resolucion <= 0.5) {
            respuesta = "Orgánico";
            resultado.style.backgroundColor = "#CE430F";
            resultado.style.color = "white"
        } else {
            respuesta = "Reciclaje";
            resultado.style.backgroundColor = "#65D117";
            resultado.style.color = "white";
        }

        // Muestra el resultado en un elemento HTML con id "resultado"
        document.getElementById("resultado").innerHTML = respuesta;
    }

    // Establece un temporizador para llamar a la función predecir() nuevamente después de 150 milisegundos
    setTimeout(predecir, 150);
}

// Se utiliza para redimensionar el canvas en una nueva dimensión especificada
// La técnica utilizada para redimensionar el lienzo es el filtrado de interpolación de Hermite. 
function resample_single(canvas, width, height, resize_canvas) {
    // obtienen las dimensiones originales del lienzo que se desea redimensionar
    let width_source = canvas.width;
    let height_source = canvas.height;
    // Asegura que width y height sean números enteros redondeando cualquier valor decimal
    width = Math.round(width);
    height = Math.round(height);

    // Representan las proporciones de redimensionamiento en las dimensiones horizontal y vertical
    let ratio_w = width_source / width;
    let ratio_h = height_source / height;
    // Son valores intermedios que se utilizan en los cálculos posteriores
    let ratio_w_half = Math.ceil(ratio_w / 2);
    let ratio_h_half = Math.ceil(ratio_h / 2);

    // Se obtienen los contextos 2D de los lienzos (original y del redimensionado)
    let ctx = canvas.getContext("2d");
    let ctx2 = resize_canvas.getContext("2d");
    // Contienen los datos de píxeles del lienzo original y del redimensionado
    let img = ctx.getImageData(0, 0, width_source, height_source);
    let img2 = ctx2.createImageData(width, height);
    let data = img.data;
    let data2 = img2.data;

    // Inicia un bucle anidado para el remuestreo de la imagen
    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            let x2 = (i + j * width) * 4;
            let weight = 0;
            let weights = 0;
            let weights_alpha = 0;
            let gx_r = 0;
            let gx_g = 0;
            let gx_b = 0;
            let gx_a = 0;
            let center_y = (j + 0.5) * ratio_h;
            let yy_start = Math.floor(j * ratio_h);
            let yy_stop = Math.ceil((j + 1) * ratio_h);
            for (let yy = yy_start; yy < yy_stop; yy++) {
                let dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                let center_x = (i + 0.5) * ratio_w;
                let w0 = dy * dy; // Parte precalculada de 'w'
                let xx_start = Math.floor(i * ratio_w);
                let xx_stop = Math.ceil((i + 1) * ratio_w);
                for (let xx = xx_start; xx < xx_stop; xx++) {
                    let dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                    let w = Math.sqrt(w0 + dx * dx);
                    if (w >= 1) {
                        // Píxel demasiado lejos, no se considera
                        continue;
                    }
                    // Filtro hermite
                    weight = 2 * w * w * w - 3 * w * w + 1;
                    let pos_x = 4 * (xx + yy * width_source);
                    // Componente alfa (transparencia)
                    gx_a += weight * data[pos_x + 3];
                    weights_alpha += weight;
                    // Componentes de color (rojo, verde, azul)
                    if (data[pos_x + 3] < 255)
                        weight = weight * data[pos_x + 3] / 250;
                    gx_r += weight * data[pos_x];
                    gx_g += weight * data[pos_x + 1];
                    gx_b += weight * data[pos_x + 2];
                    weights += weight;
                }
            }

            // Calcula los valores de color y transparencia para el nuevo píxel
            data2[x2] = gx_r / weights;
            data2[x2 + 1] = gx_g / weights;
            data2[x2 + 2] = gx_b / weights;
            data2[x2 + 3] = gx_a / weights_alpha;
        }
    }

    // Coloca los datos de la imagen remuestreada en el nuevo canvas
    ctx2.putImageData(img2, 0, 0);
}