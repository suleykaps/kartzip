
var map;
let markers = [];
// Initialize and add the map
function initMap() {
  // The location of Uluru

  // The map, centered at Uluru
  const uluru = { "lat": 39.925533,
  "lng": 32.866287 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: uluru,
  });

  // The marker, positioned at Uluru
  map.addListener("dragend", async () => {
    markers.map((marker)=>{
      marker.setMap(null)
    })
    const centerPos = {
      lat: map.center.lat(),
      lng: map.center.lng()
    }
      const vehicles = await getVEhicles(centerPos);
      vehicles.map((data)=>{
        const vehiclePos = {
          lat: data.lat,
          lng: data.lng
        }
        addMarker(vehiclePos, data.type)
      })
  });

}

function addMarker(location, type) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  var icon = "/img/" + type + ".svg";

  const marker = new google.maps.Marker({
    position: location,
    icon: icon,
    map: map,
  });

  markers.push(marker);
}

const getVEhicles =  async (pos) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var graphql = JSON.stringify({
    query: "query ($lat: Float!, $lng: Float!) {\n  vehicles (lat: $lat, lng: $lng) {\n    id\n    type\n    attributes\n    lat\n    lng\n    provider {\n      name\n    }\n  }\n}",
    /* variables: {
      "lat": 39.925533,
      "lng": 32.866287
    } */
    variables : pos
  })

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: graphql,
    redirect: 'follow'
  };
  var vehicles = []
  await fetch("https://flow-api.fluctuo.com/v1?access_token=M1SsmfIeAzDCqq6lrUkfbOH8hggXITAy", requestOptions)
    .then(response => {
      return response.json();
    }).then(function (data) {
      vehicles = typeof(data.data.vehicles) !== "undefined" ? data.data.vehicles : []
    })
    .catch(error => console.log('error', error));

    return vehicles;
}



window.initMap = initMap;