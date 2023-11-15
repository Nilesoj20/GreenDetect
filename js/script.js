let map;
let markers = [];

function initMap() {
    // Crear un mapa centrado en Perú
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -12.047499611303065, lng: -77.0941650867695 },
        zoom: 14,
    });

    // Agregar marcadores para las ubicaciones de las tiendas
    const locations = [
        { lat: -12.047499611303065, lng: -77.0941650867695 },
        { lat: -12.037678421592808, lng: -77.05742955290202 },
        { lat: -12.036251381244528, lng: -77.04918980698784 },
        { lat: -12.07469487614022, lng: -77.05339551063153 },
        { lat: -12.047667491801233, lng: -77.12763905502096 },
    ];

    // Calcular el centro del grupo de ubicaciones
    const bounds = new google.maps.LatLngBounds();
    locations.forEach((location) => {
        bounds.extend(location);
        new google.maps.Marker({
            position: location,
            map,
        });
    });

    // Ajustar el zoom y centrar el mapa en el grupo de ubicaciones
    map.fitBounds(bounds);
}

function searchNearestStore() {
    // Limpiar marcadores anteriores
    clearMarkers();

    // Obtener el distrito ingresado por el usuario
    const district = document.getElementById("district").value;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: district }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            const location = results[0].geometry.location;
            getDirections(location);
        } else {
            console.error("No se pudo encontrar la ubicación del distrito.");
        }
    });

    // Realizar una búsqueda de lugares cercanos al distrito
    const request = {
        location: { lat: -12.047499611303065, lng: -77.0941650867695 },
        radius: 5000, // Radio de búsqueda en metros
        keyword: "tienda peruana",
        name: district,
    };

    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Mostrar los resultados en el mapa y obtener la ruta al local más cercano
            showResultsOnMap(results);
            getDirections(results[0].geometry.location);
        }
    });
}

function showResultsOnMap(results) {
    const bounds = new google.maps.LatLngBounds();

    results.forEach((place) => {
        const marker = new google.maps.Marker({
            position: place.geometry.location,
            map,
        });

        markers.push(marker);
        bounds.extend(place.geometry.location);
    });

    // Ajustar el zoom y centrar el mapa en los resultados
    map.fitBounds(bounds);
}

function getDirections(origin) {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
        map,
    });

    const request = {
        origin,
        destination: findNearestLocation(origin),
        travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
        }
    });
}

function findNearestLocation(origin) {
    let nearestLocation = null;
    let nearestDistance = Infinity;

    locations.forEach((location) => {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
            origin,
            location
        );
    
        if (distance < nearestDistance) {
            nearestLocation = location;
            nearestDistance = distance;
        }
    });

    return nearestLocation;
}

function clearMarkers() {
    markers.forEach((marker) => {
        marker.setMap(null);
    });

    markers = [];
}

window.addEventListener('load', () => {
    initMap();
});