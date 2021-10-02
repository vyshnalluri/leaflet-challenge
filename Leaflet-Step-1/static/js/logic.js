// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function size(mag) {
  return mag * 40000;
}

function chooseColors(mag) {
  var color = "";
  if (mag <= 1) {
    return color = "#ACEDAF";
  }
  else if (mag <= 2) {
    return color = "#65D169";
  }
  else if (mag <= 3) {
    return color = "#47C34B";
  }
  else if (mag <= 4) {
    return color = "#23BC28";
  }
  else if (mag <= 5) {
    return color = "#106813";
  }
  else if (mag > 5) {
    return color = "#083D0A";
  }
  else {
    return color = "#083D0A";
  }
}

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquake) {
  // Define a function that we want to run once for each feature in the features array.
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "<hr> <p> Earthquake Magnitude: " + feature.properties.mag + "</p>")
  }
// Create a GeoJSON layer that contains the features array on the earthquakeData object.
  var earthquakes = L.geoJSON(earthquake, {
    onEachFeature: onEachFeature,

    pointToLayer: function (feature, coordinates) {
      var geoMarkers = {
        radius: size(feature.properties.mag),
        fillColor: chooseColors(feature.properties.mag),
        fillOpacity: 0.50,
        stroke: true,
        weight: 1
      }
      return L.circle(coordinates, geoMarkers);
    }
  })

  createMap(earthquakes);
}

function createMap(earthquakes) {
// Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

// Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map
  var myMap = L.map("map", {
    center: [
      20, -0
    ],
    zoom: 3,
    layers: [street, earthquakes]
  });

   // Create a layer control.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({ 
    position: 'bottomright' 
  });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div','info legend'),
        mag = [0, 1, 2, 3, 4, 5];
        
    div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

    for (var i = 0; i < mag.length; i++) {
      div.innerHTML +=
        '<i style="background:'+chooseColors(mag[i] + 1)+'"></i> '+
        mag[i]+(mag[i + 1]?'&ndash;'+mag[i + 1]+'<br>':'+');
    }

    return div;
  };

  legend.addTo(myMap);
}