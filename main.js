if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
    // var latitude = position.coords.latitude;
    // var longitude = position.coords.longitude;

    // Cercle de test
    // var circle = L.circle([latitude, longitude], {
    //     color: '#f00',
    //     fillColor: '#f0a',
    //     fillOpacity: 0.2,
    //     radius: 800
    // }).addTo(map);

    // Polygône de test
    // var polygon = L.polygon([
    //     [latitude, longitude],
    //     [latitude-0.01, longitude-0.02],
    //     [latitude+0.01, longitude-0.01]
    // ]).addTo(map);

    // Popups on click
    // circle.bindPopup("Cercle de test");
    // polygon.bindPopup("Polygône de test");
    
    // Reglage du zoom (à faire avant la création de la carte)
    map.setZoom(13);
    });
    
    // Création de la carte (on utilise ici openstreetmap.org et mapbox.com - il faut se créer une clé ici inscrite dans "access_token=" pour pouvoir les utiliser)
    var map = L.map('mapid')
    let mapBoxToken = 'pk.eyJ1IjoiYWxleGlzYWxsYXJ0IiwiYSI6ImNqeHJncjYyZzA4OTEzZG41emg5eTVpcHYifQ.1ZxcAkJAXgt-2k1mWmRxug';
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token='+mapBoxToken, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
    }).addTo(map);
    
    // Localisation
    map.locate({setView: true});
    function onLocationFound(e) {
        L.marker(e.latlng).addTo(map)
        .bindPopup("You have been located here").openPopup();
    }
    map.on('locationfound', onLocationFound);
    var popup = L.popup();

}
else {
    alert("Geolocation API not supported");
}

function onValidate() {
    let address = document.getElementById('addressInput').value;
    let desc = document.getElementById('descInput').value;
    let manualLat = parseFloat(document.getElementById('latInput').value);
    let manualLng = parseFloat(document.getElementById('lngInput').value);
    // Priorité si l'utilisateur entre latitude/longitude manuellement
    // On vérifie tout de même si les coordonnées sont utilisables
    if (!isNaN(manualLat) && !isNaN(manualLng)){
        // On crée un objet de type {lat/lng} pour pouvoir le placer sur la carte avec un marker
        let x={lat:manualLat,lng:manualLng}
        L.marker(x).addTo(map)
        .bindPopup(desc).openPopup();
        // On recentre la carte sur le nouveau point créé
        map.panTo(new L.LatLng(x.lat, x.lng));
    }
    else {
        // Récupérer un objet via jQuery : cet objet contient de nombreuses propriétés récupérées sur l'adresse, dont la latitude & longitude pour localiser un marker sur la carte
        $.get(location.protocol + '//nominatim.openstreetmap.org/search?format=json&q='+address, function(data){
            // Placer latitude et longitude dans un objet de type {lat,lng} pour pouvoir créer un marker (seulement si l'addresse est localisée)
            if (data[0]) {
                let x={lat:(data[0].lat),lng:(data[0].lon)};
                L.marker(x).addTo(map)
                .bindPopup(desc).openPopup();
                map.panTo(new L.LatLng(x.lat, x.lng));
            }
            else {
                // message d'erreur si l'adresse n'est pas trouvée ou mal entrée
                alert('Address not found !\n\nCheck address input again or use manual latitude/longitude entry.\n(Clicking on the map shows current latitude/longitude coordinates.)\n');
            }
        });
    }
}



// Latitude/Longitude on click
function onMapClick(e) {
    popup.setLatLng(e.latlng)
        .setContent(e.latlng.toString().slice(6))
        .openOn(map);
}
map.on('click', onMapClick);