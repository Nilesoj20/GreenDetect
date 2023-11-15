let mapa;
let bounds;
let infoWindow;
let marcadores = [];

function inicializarMapa() {
    if (typeof google === 'undefined') {
        // Si google no está definido, espera un momento y vuelve a intentarlo
        setTimeout(inicializarMapa, 100);
        return;
    }

    mapa = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -12.0464, lng: -77.0428 },
        zoom: 14
    });

    bounds = mapa.getBounds();

    mapa.addListener('bounds_changed', function () {
        bounds = mapa.getBounds();
        buscarCentrosReciclajeEnLimites();
    });

    infoWindow = new google.maps.InfoWindow();

    mostrarCentrosReciclajeLima();
}

function mostrarCentrosReciclajeLima() {
    const servicioPlaces = new google.maps.places.PlacesService(mapa);

    const request = {
        location: { lat: -12.0464, lng: -77.0428 },
        radius: 5000,
        keyword: 'reciclaje'
    };

    servicioPlaces.nearbySearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
        mostrarResultados(results);
        } else {
        console.error('Error al buscar centros de reciclaje en Lima:', status);
        }
    });
}

function buscarCentrosReciclajeEnLimites() {
    if (!bounds) {
        return;
    }

    const servicioPlaces = new google.maps.places.PlacesService(mapa);

    const request = {
        bounds: bounds,
        keyword: 'reciclaje'
    };

    servicioPlaces.nearbySearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
        mostrarResultados(results);
        } else {
        console.error('Error al buscar centros de reciclaje en los nuevos límites:', status);
        }
    });
}

function mostrarResultados(results) {
    limpiarMarcadores();
    for (let i = 0; i < results.length; i++) {
        crearMarcador(results[i]);
    }
}

function crearMarcador(lugar) {
    const marcador = new google.maps.Marker({
        map: mapa,
        position: lugar.geometry.location,
        title: lugar.name
    });

    marcadores.push(marcador);

    marcador.addListener('mouseover', function () {
        mostrarInfoWindow(lugar, marcador);
    });

    marcador.addListener('mouseout', function () {
        infoWindow.close();
    });
}

function limpiarMarcadores() {
    for (let i = 0; i < marcadores.length; i++) {
        marcadores[i].setMap(null);
    }
    marcadores = [];
}

function mostrarInfoWindow(lugar, marcador) {
    const contenido =
        '<div class="info-window">' +
        '<h2>' + lugar.name + '</h2>' +
        '<p>' + (lugar.vicinity || lugar.formatted_address || 'Dirección no disponible') + '</p>' +
        '</div>';

    infoWindow.setContent(contenido);
    infoWindow.open(mapa, marcador);
}

function obtenerUbicacionActual() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
        function (position) {
            const ubicacion = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
            };

            if (mapa) {
            mapa.setCenter(ubicacion);
            mapa.setZoom(14);
            buscarCentrosReciclajeEnLimites();
            } else {
            console.error('Error: El mapa no está inicializado.');
            }
        },
        function (error) {
            console.error('Error al obtener la ubicación:', error);
        }
        );
    } else {
        alert('Tu navegador no soporta la geolocalización.');
    }
}

// Llamar a la función de inicialización al cargar el script
inicializarMapa();