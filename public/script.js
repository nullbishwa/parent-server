const socket = io();
let map, marker;

function initMap(lat = 20.5937, lng = 78.9629) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat, lng },
    zoom: 5,
  });

  marker = new google.maps.Marker({
    position: { lat, lng },
    map,
    title: "Child's Location",
  });
}

window.onload = () => initMap();

socket.on("locationUpdate", (data) => {
  const { latitude, longitude } = data;
  console.log("📍 New location:", latitude, longitude);

  const newPos = { lat: latitude, lng: longitude };
  marker.setPosition(newPos);
  map.setCenter(newPos);
  map.setZoom(15);
});

socket.on("audioUpdate", (data) => {
  console.log("🎧 New audio file:", data.url);
  const player = document.getElementById("audioPlayer");
  player.src = data.url;
  player.play();
});
