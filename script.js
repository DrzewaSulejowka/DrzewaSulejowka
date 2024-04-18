let map;
let zoomControl;
let layerControl;
let bLayers;
let oLays;
let exportedValue;

function reverse2DArray(array)
{
  let newArray = [];
  array.forEach(column=> {
    newArray.push([column[1], column[0]]);
  })
  return newArray;
}

//Helpers
async function collectPinData(fileName)
{
  let data = await fetch(fileName);
  data = await data.text();
  data = JSON.parse(data);
  let output = [];
  data.features.forEach(element => {
    output.push(element);
  });
  return output;
}

async function collectAreaData(fileName)
{
  let data = await fetch(fileName);
  data = await data.text();
  data = JSON.parse(data);
  let output = [];
  output[0] = [];
  data.features.forEach(element => {
    element.geometry.coordinates[0].forEach(coord=>{
      output[0].push(coord.reverse());
    })
  })
  return output;
}

async function collectAreaDataBorder(fileName)
{
  let data = await fetch(fileName);
  data = await data.text();
  data = JSON.parse(data);
  let output = [];
  output[0] = [];
  data.features.forEach(element => {
    element.geometry.coordinates[0][0].forEach(coord=>{
      output[0].push(coord.reverse());
    })
  })
  return output;
}

function goBack() 
{
  map.flyTo([52.245, 21.285], 13);
}

async function main()
{

//customowa pinezka
var treeIcon = L.icon({
    iconUrl: 'images/drzewko.png',
    iconSize:[40, 40]
});

var treeOtherIcon = L.icon({
  iconUrl: 'images/iglak.png',
  iconSize:[40, 40]
});

var museumIcon = L.icon({
  iconUrl: 'images/muzeum.png',
  iconSize:[40, 40]
});

const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 21,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

const immovable_monuments = L.tileLayer.wms('https://usluga.zabytek.gov.pl/INSPIRE_IMD/service.svc/get', {
  layers: 'Immovable Monuments'
})
  
 map = L.map('map', {
	center: [52.245, 21.285],
	zoom: 13,
	layers: [osm, immovable_monuments],
  zoomControl: false,
  layerControls: false,
  minZoom: 9,
});


L.Control.geocoder().addTo(map);

zoomControl = L.control.zoom({
  position:'topleft'
}).addTo(map);

const baseLayers = {
	'OpenStreetMap': osm
};
bLayers = baseLayers;
	
const overlays = {
	'Zabytki': immovable_monuments
};

oLays = overlays;

let monuments = [];

let data = await collectPinData('geojson/zabytki_2.geojson');
data.forEach(element=>{
  let dat = new L.polygon(reverse2DArray(element.geometry.coordinates[0][0]), {color: 'blue'});
  monuments.push(dat);
});

layerControl = L.control.layers(baseLayers).addTo(map);
layerControl.addOverlay(L.layerGroup(monuments), "Zabytki")

data = await collectAreaDataBorder('geojson/granice_miasta.geojson');
data.forEach(element=>{
var sulejowekBorders = L.polygon(element, {color: 'green', fill: false}).addTo(map);
});

var markers = new L.MarkerClusterGroup({});
let iterator = 1;
data = await collectPinData('geojson/Drzewa.geojson');
data.forEach(element=>{
  let dat = L.marker([element.geometry.coordinates[1], element.geometry.coordinates[0]], {icon: element.properties.klasa_drzewa === "iglaste" ? treeOtherIcon : treeIcon});
  dat.value = element.properties.bonitacja;
  dat.coordinatesx = element.geometry.coordinates[1];
  dat.coordinatesy = element.geometry.coordinates[0];
  dat.on('click', (e) => {
    document.getElementById("locationSpan").innerHTML = `(lokalizacja: [${e.target.coordinatesx} , ${e.target.coordinatesy}])`;
    document.getElementById("treeCalculatorLocation").value = e.target.value;
  });
  let props = element.properties;
  props.koordynaty = `${element.geometry.coordinates[1].toFixed(2)}, ${element.geometry.coordinates[0].toFixed(2)}`;
  let resultStr = "";
  let key;
  for (key in props) {
    resultStr += `<span style="font-size: medium"><b style="font-weight: 900;">${key}</b>: ${props[key]}</span><br />`;
  }
  dat.bindTooltip(resultStr);
  iterator++;
  markers.addLayer(dat);
});

map.addLayer(markers);
}

main();

