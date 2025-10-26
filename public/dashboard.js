const socket = io();

// Update child list
socket.on("child-list", (children) => {
    const list = document.getElementById("child-list");
    list.innerHTML = "";
    children.forEach(c => {
        const li = document.createElement("li");
        li.textContent = c;
        list.appendChild(li);
    });
});

// SMS logs
socket.on("sms-log", (data) => {
    const div = document.getElementById("sms-log");
    div.innerHTML += `<p>${data.timestamp} | ${data.number} : ${data.message}</p>`;
});

// Call logs
socket.on("call-log", (data) => {
    const div = document.getElementById("call-log");
    div.innerHTML += `<p>${data.timestamp} | ${data.number} | ${data.event} | ${data.duration}s</p>`;
});

// Location updates
socket.on("location-update", (data) => {
    const div = document.getElementById("location-log");
    div.innerHTML += `<p>${data.timestamp} | Lat: ${data.latitude}, Lng: ${data.longitude}</p>`;
});
