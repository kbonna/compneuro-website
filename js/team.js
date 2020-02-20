// Site data
const collaborators = [
    {
        name: 'drcmr',
        fullName: 'Danish Research Centre for Magnetic Resonance',
        university: 'Copenhagen University',
        project: 'Value-based decision making',
        people: 'Ollie Hulme, David Meder, Kristofer Madsen',
        lonLat: [12.466071, 55.649656]
    },
    {
        name: 'upenn',
        fullName: 'Complex Systems Lab',
        university: 'University of Pennsylvania',
        project: 'Reorganization of brain networks',
        people: 'Danielle Bassett, Xiaosong He',
        lonLat: [-75.193224, 39.952243]
    },
    {
        name: 'stanford',
        fullName: 'The Poldrack Lab',
        university: 'Stanford University',
        project: ' Reproducible neuroimaging',
        people:
            'Russell Poldrack, Oscar Esteban, Chris Markiewicz, William Thompson',
        lonLat: [-122.169767, 37.427547]
    },
    {
        name: 'maxplanck',
        fullName: 'Lise Meitner Group for Environmental Neuroscience',
        university: 'Max Planck Institute for Human Development',
        project: 'Reorganization of brain network',
        people: 'Simone Kühn',
        lonLat: [13.303811, 52.46873]
    }
];

// Grab DOM elements
const pupupContainer = document.getElementById('popup');
const popupContent = document.getElementById('popup__content');
const popupClose = document.getElementById('popup__close');
const mapElement = document.getElementById('map');

// Icon style
const markerStyle = new ol.style.Style({
    image: new ol.style.Icon({
        src: 'img/pin.svg',
        anchor: [0.5, 1],
        scale: 0.1
    })
});

function greyscale(context) {
    var canvas = context.canvas;
    var width = canvas.width;
    var height = canvas.height;
    var imageData = context.getImageData(0, 0, width, height);
    var data = imageData.data;
    for (i = 0; i < data.length; i += 4) {
        var r = data[i];
        var g = data[i + 1];
        var b = data[i + 2];
        // CIE luminance for the RGB
        var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        // Show white color instead of black color while loading new tiles:
        if (v === 0.0) v = 255.0;
        data[i + 0] = v; // Red
        data[i + 1] = v; // Green
        data[i + 2] = v; // Blue
        data[i + 3] = 255; // Alpha
    }
    context.putImageData(imageData, 0, 0);
}

function init() {
    /*******
     * Map *
     *******/
    const mapLayer = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    // Overlay anchoring the popup to the map.
    const overlay = new ol.Overlay({
        element: pupupContainer,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });

    function closeOverlay() {
        overlay.setPosition(undefined);
        popupClose.blur();
        return false;
    }

    const map = new ol.Map({
        view: new ol.View({
            center: ol.proj.transform([-30, 40], 'EPSG:4326', 'EPSG:3857'),
            zoom: 2.25,
            maxZoom: 6
        }),
        layers: [mapLayer],
        overlays: [overlay],
        target: 'map'
    });

    /***********
     * Markers *
     ***********/
    const points = [];

    collaborators.forEach(c => {
        points.push(
            new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat(c.lonLat)),
                name: c.name
            })
        );
    });

    points.forEach(p => {
        p.setStyle(markerStyle);
    });

    const layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: points
        })
    });
    map.addLayer(layer);

    /**********
     * Popups *
     **********/
    map.on('pointermove', function(event) {
        if (map.hasFeatureAtPixel(event.pixel) === true) {
            mapElement.style.cursor = 'pointer';
        } else {
            mapElement.style.cursor = 'default';
        }
    });

    map.on('singleclick', function(event) {
        if (map.hasFeatureAtPixel(event.pixel) === true) {
            const feature = map.getFeaturesAtPixel(event.pixel)[0];
            const coordinate = feature.values_.geometry.flatCoordinates;
            const collaborator = collaborators.filter(
                c => c.name === feature.values_.name
            )[0];

            // Inject collaborator information
            popupContent.innerHTML = `<h2 class="popup__title">${collaborator.fullName}</h2>
                 <h3 class="popup__subtitle">${collaborator.university}</h3>
                 <span class="popup__line"><span>Collaborators</span>: ${collaborator.people}</span>
                 <span class="popup__line"><span>Project</span>: ${collaborator.project}</span>`;
            mapElement.style.cursor = 'default';
            overlay.setPosition(coordinate);
        } else {
            closeOverlay();
        }
    });

    // Closing popup
    popupClose.onclick = closeOverlay;

    // Convert all layer pixels to gray
    mapLayer.on('postrender', function(event) {
        greyscale(event.context);
    });

    // Remove attribution logo & link
    const attribution = document.querySelector('.ol-attribution');
    attribution.style.display = 'none';
}

window.onload = init;
