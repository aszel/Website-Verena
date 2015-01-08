

/*
    Datencontainer der Sehenswürdigkeiten
        Name/Titel
        Latitdue
        Longitude
        z-index auf der Karte
        Beschreibung
*/
var sites = [
    ['Slawenburg Raddusch', '51.804833', '14.0304', 2, 'Die Lausitz verdankt ihren Namen dem Volk des slawischen Stammes der Lusizi, die sich in diesem Gebiet ansiedelten (9./10.Jh.n.Chr.). Sie lebten in Burgwällen, die ihnen gleichzeitig als Wehranlage dienten. Die Slawenburg Raddusch ist eine dieser Befestigungsanlagen und nach aufwändiger Rekonstruktion ist sie nun für Besucher geöffnet. Auch für Ihr leibliches Wohl ist gesorgt. Nach oder vor Ihrem Rundgang genießen Sie am besten einen Snack im Gasthof-Slawenburg-Raddusch. Probieren Sie doch mal den Slawenburger!','slawenburg.jpg', 'http://www.slawenburg-raddusch.de'],
    ['Forscherkahn Nautilus', '51.86545', '13.97455', 3, 'Auf der NAUTILUST stehen 8 Forscherplätze bereit. Diese bieten kleinen und großen Forschern Einblicke in das Leben am und im Wasser! MikroskopeViele Experimente sind möglich. Wer einen außergewöhnlichen Ausflug plant oder die individuelle und einzigartige Spreewaldkahnfahrt mit fachlicher Betreuung sucht, ist hier genau richtig.','forscherkahn.jpg', 'http://www.nautilust.net'],
    ['Spreewaldmuseum Lübbenau', '51.869283', '13.965567', 1, 'Das Spreewaldmuseum ist ein Museum in der am Spreewald gelegenen Stadt Lübbenau/Spreewald. Das Museum befindet sich im sogenannten Torhaus oder Torbogenhaus am Topfmarkt 12 und widmet sich in Ausstellungen der Geschichte der Spreewaldregion.','spreewaldmuseum.jpg', 'http://www.museum.kreis-osl.de/museum'],
    ['Adler und Jagdfalkenhof zur Calauer Schweiz', '51.7266', '13.958167', 1, 'Falken, Adler und Eulen in freier Natur zu beobachten, ist nichts Ungewöhnliches. Ein besonderes Ereignis ist es, diese imposanten Vögel in einem Abstand von nur wenigen Metern in Aktion zu sehen. Nehmen Sie an einen unserer Flugvorführungen teil und besichtigen Sie die Greifvögel aus nächster Nähe. In 90 Minuten erleben Sie viel Unterhaltsames und Wissenswertes über unsere kühnen Jäger der Lüfte.','adler.jpg', 'http://www.adlerundjagdfalkenhof.de'],
    ['Schlossinsel Lübben', '51.9391', '13.896683', 1, 'Inmitten der Stadt verbindet die Schlossinsel in Lübben auf schöne ungewöhnlich Weise Spreewälder Natur und Kultur. Hier laden fantasievoll angelegte Wanderwege und Erlebnisbereiche wie Labyrinth, Klanggarten oder Wasserspielplatz zum Spazieren und Verweilen ein.','schlossinsel.jpg', 'http://www.schloss-luebbenau.de']
];

/* Karten-Objekt */
var map;

/* Array welches die Marker auf der Karte enthält */
var markers = [];

/* InfoWindow-Objekt */
var infowindow = new google.maps.InfoWindow();

/*
    bounds-Rechteck, welches sich aus den Koordinaten der noch folgenden Marker
    berechnet um die Karte ideal anzuzeigen, d.h. alle Marker sollen
    angezeigt werden, die Karte jedoch so detailiert wie möglich sein
*/
var bounds = new google.maps.LatLngBounds();




/*
    Initialisierung der Karte
    Wird ganz zum Anfang aufgerufen sobald der HTML-body geladen wird
    Kreiert die Karte, lässt die Marker darauf setzen
    und gibt diesen jeweils einen Listener damit man sie
    anklicken kann
    Zuletzt wird die Karte ausgerichtet
*/
function initialize() {

    // eine Position setzen
    var myLatlng = new google.maps.LatLng(52.0,14.0);

    // Optionen für die Karte setzen
    var mapOptions = {
        zoom: 4,
        center: myLatlng
    }

    // Karte im div-Container "map_container" zeichnen lassen und die Optionen übergeben
    map = new google.maps.Map(document.getElementById('map_container'), mapOptions);

    // Marker setzen
    setMarkers(map, sites);

    // die Karte entsprechend den Markern ausrichten und zoomen
    map.fitBounds(bounds);

}




/*
    Funktion die durch die Links im Panel aufgerufen wird.
    Sie nimmt den Namen der Sehenswürdigkeit
    entgegen, lässt das Infofenster aufpoppen
    und zentriert die Karte auf dem gewünschten
    Marker
*/
function showSite(nameOfSite) {
    var marker = getMarkerByTitle(nameOfSite);
    openInfoWindow(nameOfSite, marker);
    // Karte am Marker zentrieren
    map.panTo(marker.getPosition());
}




/*
    Setzt für jede Sehenswürdigkeit einen
    Marker auf der Karte
*/
function setMarkers(map, locations) {

    /*
        loop über alle Locations
        für jede Location wird ein Marker gesetzt
    */
    for (var i = 0; i < locations.length; i++) {
        var site = locations[i];
        var currentLatLng = new google.maps.LatLng(site[1], site[2]);

        // aktuelle Position dem bounds-Rechteck hinzufügen
        bounds.extend(currentLatLng);

        // einen Marker erzeugen
        var marker = new google.maps.Marker({
            position: currentLatLng,
            map: map,
            title: site[0],
            zIndex: site[3]
        });

        //console.log('cur marker: ' + marker.getTitle());

        // Inhalt des Infofensters am aktuellen Marker setzen
        var infowindowcontent = getDescriptionOfSiteByName(marker.getTitle());

        // dem Marker einen Listener hinzufügen um das gerade erzeugte Infofenster öffnen zu können
        addListenerToMarker(map, marker, infowindowcontent);

        // den gerade erzeugten Marker dem Markers-Array anfügen
        markers.push(marker);
    }
}




function addListenerToMarker(map, marker, infowindowcontent) {
    google.maps.event.addListener(marker, 'click', function() {

        var nameOfSite = marker.getTitle();
        openInfoWindow(nameOfSite, marker);

        // Karte am Marker zentrieren
        map.panTo(marker.getPosition());
    });
}




/*
    Gibt den Marker zurück welcher als title
    den übergebenen Namen enthält
*/
function getMarkerByTitle(nameOfSite) {
    for (var i = 0; i < markers.length; i++) {
        currentMarker = markers[i];

        if (nameOfSite == currentMarker.getTitle()) {
            return currentMarker;
        };
    }
}




function getSiteByName(nameOfSite) {
    for (var i = 0; i < sites.length; i++) {
        currentSite = sites[i];

        if (nameOfSite == currentSite[0]) {
            return currentSite;
        };
    }
}



/*
    Liest die Beschreibung zu einer Sehenswürdigkeit
    aus und gibt sie zurück.
*/
function getDescriptionOfSiteByName(nameOfSite) {
    var currentSite = getSiteByName(nameOfSite);
    return currentSite[4];
}



/*
    Funktion gibt den Dateinamen des Bildes passend
    zur Sehenswürdigkeit zurück.
*/
function getImageOfSiteByName(nameOfSite) {
    var currentSite = getSiteByName(nameOfSite);
    return currentSite[5];
}




/*
    Funktion gibt den Link zur Website
    der Sehenswürdigkeit zurück.
*/
function getLinkToSite(nameOfSite) {
    var currentSite = getSiteByName(nameOfSite);
    return currentSite[6];   
}




/*
    Öffnet das Infofenster über dem jeweils
    übergebenen Marker. Setzt vorher den HTML-Content für den
    Marker zusammen
*/
function openInfoWindow(nameOfSite, marker) {
    var divStartContent = "<div class='marker_content'>";
    var headline = "<p class='marker_header'>" + nameOfSite + "</p>";
    var divStartImg = "<div class='marker_img'><a target='_blank' href='" + getLinkToSite(nameOfSite) + "'><img src='assets/img/karte/" + getImageOfSiteByName(nameOfSite) + "' alt=''></a>";
    var divStartDesc = "<div class='marker_desc'>" + getDescriptionOfSiteByName(nameOfSite);
    
    var divEnd = "</div>";
    
    // Zusammensetzen des HTML-Contents für Marker
    var content = divStartContent + headline + divStartImg + divEnd + divStartDesc + divEnd + divEnd;
    infowindow.setContent(content);

    infowindow.open(map, marker);
}