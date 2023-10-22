# GreenDetect
## Clasificación de imágenes (Reciclaje/Orgánico)
![DETECTOR DE IMAGENES](https://i.imgur.com/zJKiZld.png)

Este código representa el sitio web, una vez que se crea y entrena el modelo de inteligencia artificial con Python y Tensorflow, el cual es exportado a los archivos "json" y "bin". Puede utilizarse en el celular, solo apunta la cámara algunos objetos que quieres clasificar (puede ser una imagen de la computadora, una foto, o uno de verdad), y obtendras el resultado. Todo lo hace en el explorador utilizando Tensorflow.js.

## Cómo utilizarlo

### Descarga el Repositorio
Descargalo en tu computadora (donde tu quieras) ya que vas a utilizarlo localmente, no te preocupes la verdad por el peso del detector. Todo el entrenamiento fue hecho en google colab y ya hemos hecho ese trabajo para ti, aqui vas a encontrar nuestra web con la cual vas a poder utilizarlo.

### Inicia un servidor en la carpeta (lo ideal)
Este proyecto utiliza un modelo de Tensorflow.js, el cual para cargarse requiere que el acceso sea por medio de http/https. Para eso puedes usar cualquier servidor, pero aquí hay una forma de hacerlo:
* Descarga Python en tu computadora
* Abre una línea de comandos o terminal
* Navega hasta la carpeta donde descargaste el repositorio
* Ejecuta el comando python -m http.server 8000
* Abre un explorador y ve a http://localhost:8000
  
![DETECTOR DE IMAGENES WEB](https://i.imgur.com/sKb2gqk.png)
### Utilizarlo en el celular
Si quieres abrirlo en tu celular, no se puede solo poner la IP local de tu computadora y el puerto, ya que para usar la cámara se requiere HTTPS. Puedes hacer un túnel de HTTPS siguiendo los siguientes pasos
* Descarga ngrok en tu computadora, y descomprímelo
* Abre una línea de comandos o terminal
* Navega hasta la carpeta donde descargaste ngrok
* Ejecuta el comando ngrok http 8000
* Es importante tener ambos activos: El servidor de python, y el túnel de ngrok
* En la línea de comandos aparecerá un enlace HTTPS. Puedes entrar ahí con tu celular, no importa si no estás en la red local.
* El túnel expira después de 2 horas creo, en dado caso solo reinicias ngrok
* Abre un explorador en tu celular y ve al enlace HTTPS indicado
### Uso del detector con celular
Puedes dar clic en el botón de "Cambiar camara" para utilizar la cámara delantera o trasera del celular. Solo apunta la cámara a un objeto por ejemplo una botella PET, y abajo te aparecerá la predicción. Tampoco es el clasificador del futuro entonces si no clasifica perfecto, entiendan de que hemos trabajado con un rango del 70 a 85% de acierto. (Con solo 5 epocas)

![DETECTOR DE IMAGENES WEB](https://i.imgur.com/5A6Zc0S.png)
## Integrantes
* Stefano Madueño <stefanoml128@gmail.com> 🚀
* Joselin Rivas <joselinrivas@gmail.com> 🚀
* Johana Herrera <johanarosicelaherreraperez@gmail.com> 🚀
