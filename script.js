 // Espera a que se cargue completamente el DOM antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function() {
                
    // Selecciona todos los elementos 'a' dentro de las listas dentro del elemento 'nav'
    var links = document.querySelectorAll('nav ul li a');

    // Itera sobre cada uno de los enlaces encontrados
    links.forEach(function(link) {

        // Agrega un evento de clic a cada enlace del menú
        link.addEventListener('click', function(event) {

            // Evita el comportamiento predeterminado del enlace (navegación a otra página)
            event.preventDefault();

            // Obtiene el ID de la sección a la que debe desplazarse el enlace, eliminando el '#'
            var targetId = this.getAttribute('href').substring(1);

            // Encuentra el elemento en el DOM con el ID correspondiente al enlace
            var targetElement = document.getElementById(targetId);

            // Verifica si se encontró el elemento objetivo
            if (targetElement) {

                // Usa la función 'scrollIntoView' para desplazar suavemente el documento 
                // hasta que el elemento objetivo esté visible en la ventana del navegador
                targetElement.scrollIntoView({
                    behavior: 'smooth', // Aplica un desplazamiento suave
                    block: 'center' // Centra verticalmente el elemento en la ventana
                });
            }
        });
    });

    var scrollToTopButton = document.getElementById('btnScrollToTop');

    // Muestra u oculta el botón dependiendo del desplazamiento vertical de la página
    window.addEventListener('scroll', function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollToTopButton.style.display = 'block';
        } else {
            scrollToTopButton.style.display = 'none';
        }
    });

    // Desplaza la página al principio cuando se hace clic en el botón
    scrollToTopButton.addEventListener('click', function() {
        document.body.scrollTop = 0; // Para navegadores Safari
        document.documentElement.scrollTop = 0; // Para otros navegadores
    });
});