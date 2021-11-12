var EarthQuakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
console.log(EarthQuakes)

var Boundaries = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
console.log(Boundaries)



function marker_size(magnitude) {
    return magnitude * 5; 
};

var quake_spot = new L.LayerGroup();

d3.json(EarthQuakes, function(geoJSON){
    L.geoJSON(geoJSON.features, {
        pointToLayer: function(geoPoint, coordinates) {
            return L.circleMarker(coordinates, {radius: marker_size(geoPoint.properties.mag)
            });
        },

        style: function(feature) {
            return {
                fillColor: Color(feature.properties.mag),
                fillOpacity: .5,
                weight: .1,
                color: 'orange'
            }
        },
        on_feature: function(fture, layer){
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(fture.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + fture.properties.title + "</h5>");
        }
    })
    .addTo(quake_spot);
    createImageBitmap(quake_spot);
})

var boundary
    = new L.LayerGroup();

    d3.json(Boundaries, function(geoJSON){
        L.geoJSON(geoJSON.features, {
            style: function(geoFeature){
                return {
                    weight: 2, 
                    color: 'blue'
                }
            },
        }).addTo(boundary);
    })

    function Color(magnitude) {
        if (magnitude > 5) {
            return 'red'
        } else if (magnitude > 4) {
            return 'green'
        } else if (magnitude > 3) {
            return 'black'
        } else if (magnitude > 2) {
            return 'purple'
        } else if (magnitude > 1) { 
            return 'yellow'
        }
    };

    function Mapcreate() {

        var streepMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1Ijoib2xhd3JlbmNlNzk5IiwiYSI6ImNqZXZvcTBmdDBuY3oycXFqZThzbjc5djYifQ.-ChNrBxEIvInNJWiHX5pXg'
        });
    
        var lightMap = L.titleLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.light',
            accessToken: 'pk.eyJ1Ijoib2xhd3JlbmNlNzk5IiwiYSI6ImNqZXZvcTBmdDBuY3oycXFqZThzbjc5djYifQ.-ChNrBxEIvInNJWiHX5pXg'
        });

        var satellite = L.titleLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18, 
            id: 'mapbox.satellite',
            accessToken: 'pk.eyJ1Ijoib2xhd3JlbmNlNzk5IiwiYSI6ImNqZXZvcTBmdDBuY3oycXFqZThzbjc5djYifQ.-ChNrBxEIvInNJWiHX5pXg'
        });

        var baseLayers = {
            'street': streepMap,
            'light': lightMap,
            'satellite': satellite
        };

        var overlays = {
            'Earth_Quakes': quake_spot,
            'Boundaries': Boundaries
        };

        var mymap = L.map('mymap', {
            center: [40, -110],
            zoom: 5,
            layers: [streepMap, quake_spot, boundary]
        });
        L.control.layer(baseLayers, overlays).addTo(mymap);

        var legend = L.control({position: 'bottomright'});
        legend.onAdd = function(map) {
            var div = L.DomUtil.create('div', 'info legend'), 
                magnitude = [0, 1, 2, 3, 4, 5],
                labels = [];
            
            div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

            for (var i = 0; i < magnitude.length; i++) {
                div.innerHTML +=
                '<i style="background:' + Color(magnitude[i] + 1) + '"></i> ' + magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
            }
            return div;
        };
        legend.addTo(mymap);
    }
