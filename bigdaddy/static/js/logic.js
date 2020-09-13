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

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}


var geojson;

function thousandsSeparators(num)
  {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }

console.log("Thousands test",thousandsSeparators(857392847));
console.log(thousandsSeparators(10000.23));
console.log(thousandsSeparators(100000));

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  })
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
  //console.log("number with comma",(feature.properties.positive).toLocaleString('en') )
  console.log("feature2", feature.properties.name)
  console.log("feature3", thousandsSeparators(637738822))
  //var numb = thousandsSeparators(feature.properties.positive)
  //console.log("numb", numb)
  //var layer1 = `<h3>State: ${numb} </h3>`
  //console.log("layer1", layer1)
  //inserting layer1 does not work.  Insersting numb does not work.  Bizarre.
  layer.bindPopup("<h3>State: " + feature.properties.name +
    "</h3><h4>Total Tests: " + feature.properties.totalTestResults +
    "</h4><h4>Total Positive: " + feature.properties.positive+
    "</h4><h4>Hospitalized Currently: " + feature.properties.hospitalizedCurrently+
    "</h4><h4>Total deaths: " + feature.properties.deaths+
    "</h4>");

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

colorsList = ['#800026', '#BD0026', '#E31A1C', '#FC4E2A', '#FD8D3C', '#FED976','#FFEDA0' ]
colorValues = [1000, 500, 200, 100, 50, 20, 10]

function getColor(d) {
  return d > colorValues[0] ? colorsList[0] :
    d > colorValues[1] ? colorsList[1] :
      d > colorValues[2] ? colorsList[2] :
        d > colorValues[3] ? colorsList[3] :
          d > colorValues[4] ? colorsList[4] :
            d > colorValues[5] ? colorsList[5] :
              d > colorValues[6] ? colorsList[6] :
                colorsList[7];
}

geojson = L.geoJson(statesData, {
  style: style,
  onEachFeature: onEachFeature,
  //onEachFeatured: onEachFeatured
}).addTo(map);
//console.log("covidData...........", covidData)

function style(feature) {
  return {
    fillColor: getColor(feature.properties.positive),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}
console.log("geojson", geojson)

}).catch(console.log.bind(console));


var legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
  var div = L.DomUtil.create("div", "info legend");

  //    var colors = earthquakes.options.colors;
  var labels = [];

  // Add min & max
  var legendInfo = "<h1>Magnitude</h1>";

  div.innerHTML = legendInfo;
 
  labels.push("<li>well hi there</li>")

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};
legend.addTo(map)
