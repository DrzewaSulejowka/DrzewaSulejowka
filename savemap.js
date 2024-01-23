let mapElement = document.querySelector("#mapContent div");

$('#saveMap').on('click',async function() {
  map.removeControl(zoomControl);
  map.removeControl(layerControl);
    html2canvas(mapElement, {
      useCORS: true,
      width: mapElement.offsetWidth ,
      height: mapElement.offsetHeight
  }).then(function(canvas) {
        var imgData = canvas.toDataURL('image/png');

        var downloadLink = document.createElement('a');
        downloadLink.href = imgData;
        downloadLink.download = 'mapa.png';
        document.body.appendChild(downloadLink);

        downloadLink.click();

        document.body.removeChild(downloadLink);
    });
      zoomControl = L.control.zoom({position:'topleft'}).addTo(map);
      layerControl = L.control.layers(bLayers, oLays).addTo(map);
});
