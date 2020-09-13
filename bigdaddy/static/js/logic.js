// Store our API endpoint inside queryUrl

var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' +
  API_KEY, {
  id: 'mapbox/light-v9',
  attribution: "mapbox",
  tileSize: 512,
  zoomOffset: -1
}).addTo(map);

console.log("statesData.features", statesData.features)




var geojson;



function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  })
    // .bindpopup("<h3>Plate Name:" +
    //   "</h3>");

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
}

// function zoomToFeature(e) {
//   map.fitBounds(e.target.getBounds());
// }

var oneDataset = [];

// 
console.log("states data++++++++++++++++", statesData)
// })

function onEachFeature(feature, layer) {
  console.log("feature", feature.properties)
  console.log("layer", layer)
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    //click: zoomToFeature
  })
  console.log("feature2", feature.properties.name)
  layer.bindPopup("<h3>State: " + feature.properties.name +
    "</h3>");

}

d3.csv("./static/data/AugustSeptembercovid.csv").then(function (data) {
  latestDate = data[0].date
  console.log("latest date", latestDate)
  return (data.filter(function (d) {
    return (d.date == latestDate);
  }));
}).then(function (oneDataset) {
  console.log("oneDataset...........", oneDataset)
  statesData.features.forEach(function (stateData) {
    oneDataset.forEach(function (oneData) {
      console.log("ddddd", stateData)
      console.log("oneDataset", oneData)
      console.log("properaties name", stateData.properties.name)
      console.log("oneDataset statename", oneData.statename)
      if (stateData.properties.name == oneData.statename) {
        console.log("stateData.properties", stateData.properties)
        console.log("oneData", oneData)
        //stateData.properties.density = 67898
        stateData.properties.hospitalizedCurrently = +oneData.hospitalizedCurrently;
        stateData.properties.positive = +oneData.positive;
        stateData.properties.totalTestResults = +oneData.totalTestResults;
        stateData.properties.deaths = +oneData.deaths;
        console.log("stateData.properties------------------", stateData.properties)
      }
      console.log("stateData.properties88888888888888888", stateData.properties)
    })
  })
console.log("staes data final", statesData)

L.geoJson(statesData).addTo(map);
console.log("statesData", statesData)
function getColor(d) {
  return d > 1000 ? '#800026' :
    d > 500 ? '#BD0026' :
      d > 200 ? '#E31A1C' :
        d > 100 ? '#FC4E2A' :
          d > 50 ? '#FD8D3C' :
            d > 20 ? '#FEB24C' :
              d > 10 ? '#FED976' :
                '#FFEDA0';
}

geojson = L.geoJson(statesData, {
  style: style,
  onEachFeature: onEachFeature,
  //onEachFeatured: onEachFeatured
}).addTo(map);
//console.log("covidData...........", covidData)





function style(feature) {
  return {
    fillColor: getColor(feature.properties.density),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}
console.log("geojson", geojson)








}).catch(console.log.bind(console));

//console.log("stateData.properties", stateData.properties)

