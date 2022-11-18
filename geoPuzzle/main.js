let notificationPermission = false;
var previousMarker = null;
let PolandCenter = {
  lat: 51.9189046,
  lng: 19.1343786,
};

function askNotificationPermission() {
  if (!("Notification" in window)) {
    alert("Notifications not supported.");
  }
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      notificationPermission = true;
    }
  });
}

function init() {
  askNotificationPermission();
  document.getElementById("lat").value = PolandCenter.lat;
  document.getElementById("lng").value = PolandCenter.lng;

  // initialize the map on the center of Poland
  const map = L.map("map").setView([PolandCenter.lat, PolandCenter.lng], 6);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(map);

  // add marker and change latlang input values on location change
  map.on("locationfound", (e) => {
    if (previousMarker) {
      map.removeLayer(previousMarker);
    }
    previousMarker = L.marker(e.latlng).addTo(map);
    document.getElementById("lat").value = e.latlng.lat;
    document.getElementById("lng").value = e.latlng.lng;
  });

  // myLocation listener - get current location
  document.getElementById("getMyLocation").addEventListener("click", () => {
    map.locate({ setView: true });
  });

  // fixed location listener - get location from input
  document.getElementById("submit").addEventListener("click", () => {
    let lat = document.getElementById("lat").value;
    let lng = document.getElementById("lng").value;
    map.setView([lat, lng], map.getZoom());
    //deleting old marker
    if (previousMarker) {
      map.removeLayer(previousMarker);
    }

    // save new marker
    previousMarker = L.marker([lat, lng]).addTo(map);
  });

  // puzzle click listener - rasterize the map generate puzzle
  document.getElementById("play").addEventListener("click", () => {
    let ImageDataTiles = [];
    html2canvas(document.getElementById("map"), {
      allowTaint: true,
      height: 600,
      width: 600,
      useCORS: true,
    }).then(function (canvas) {

      // clear previous puzzle
      cleanup();

      // generate puzzle board
      generate_puzzle_board();

      // get image data from canvas
      canvas.classList.add("map");
      canvas.setAttribute("id", "rasterMap");
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          let imgData = canvas
            .getContext("2d")
            .getImageData(i * 150, j * 150, 150, 150);
          ImageDataTiles.push(imgData);
        }
      }

      let tempImages = [];

      // generate img elements from image data
      ImageDataTiles.forEach((imgData) => {
        let img = imagedata_to_image(imgData);
        img.setAttribute("draggable", true);
        img.setAttribute("id", "img" + ImageDataTiles.indexOf(imgData));
        img.setAttribute("ondragstart", "drag(event)");
        tempImages.push(img);
      });
      // shuffle images
      tempImages = shuffle(tempImages);

      // add puzzles to the board
      tempImages.forEach((img) => {
        document.getElementById("shuffled-puzzle").appendChild(img);
      });
    });
  });
}

function generate_puzzle_board() {
  document.getElementById("puzzle");
  for (let i = 0; i < 16; i++) {
    let tile = document.createElement("div");
    tile.classList.add("tile");
    tile.setAttribute("id", "tile" + i);
    tile.setAttribute("ondrop", "drop(event)");
    tile.setAttribute("ondragover", "allowDrop(event)");
    document.getElementById("puzzle").appendChild(tile);
  }
}
function cleanup() {
  document.getElementById("puzzle").innerHTML = "";
  document.getElementById("shuffled-puzzle").innerHTML = "";
}
function imagedata_to_image(imagedata) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = imagedata.width;
  canvas.height = imagedata.height;
  ctx.putImageData(imagedata, 0, 0);

  var image = new Image();
  image.src = canvas.toDataURL();
  return image;
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  if (!ev.target.classList.contains("tile")) {
    ev.target.parentNode.appendChild(document.getElementById(data));
    document.getElementById("shuffled-puzzle").appendChild(ev.target);
  } else {
    ev.target.appendChild(document.getElementById(data));
  }
  checkIfSolved();
}

function checkIfSolved() {
  let tiles = document.getElementsByClassName("tile");
  let solved = true;
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].firstChild) {
      if (tiles[i].firstChild.id != "img" + i) {
        solved = false;
        break;
      }
    } else {
      solved = false;
      break;
    }
  }
  if (solved) {
    if (notificationPermission) {
      new Notification("Solved!");
    }
    alert("Solved!");
  }
}

init();
