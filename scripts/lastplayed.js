let user = "jefbecker";
let url = `https://lastfm-last-played.biancarosa.com.br/${user}/latest-song`;
let songElement = document.querySelector("#lfmSong");
let lastPlayedElement = document.querySelector("#lfmTime");
let albumArtElement = document.querySelector("#lfmAlbumArt"); // Add an <img> element in your HTML with this ID

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    // Extract relevant data
    const trackName = data.track.name;
    const artistName = data.track.artist["#text"];
    const lastPlayedUnix = parseInt(data.track.date.uts, 10);

    // Debug: Log the entire response
    console.log("API Response:", data);

    // Extract album art
    const albumArt = data.track.image.find((img) => img.size === "extralarge");

    // Update the DOM
    songElement.innerHTML = `${trackName} - ${artistName}`;
    lastPlayedElement.innerHTML = timeSince(lastPlayedUnix);

    // Set album art
    if (albumArt && albumArt["#text"]) {
      const albumArtUrl = albumArt["#text"];
      console.log("Album art URL:", albumArtUrl); // Log the album art URL for debugging
      albumArtElement.src = albumArtUrl;
      albumArtElement.alt = `Album art for ${trackName} by ${artistName}`;
    } else {
      console.error("No album art found for this song.");
      albumArtElement.src = ""; // Clear the image if no album art is found
      albumArtElement.alt = "No album art available.";
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    songElement.innerHTML = "Unable to fetch song data.";
    lastPlayedElement.innerHTML = "";
    albumArtElement.src = ""; // Clear the album art on error
    albumArtElement.alt = "No album art available.";
  });

// Function to calculate time since a given UNIX timestamp
var timeSince = function (timestamp) {
  if (typeof timestamp !== "object") {
    timestamp = new Date(timestamp * 1000); // Convert from seconds to milliseconds
  }
  if (isNaN(timestamp.getTime())) return "Invalid time";

  let seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);
  let unit = "year";

  if (interval < 1) {
    interval = Math.floor(seconds / 2592000);
    unit = "month";
  }
  if (interval < 1) {
    interval = Math.floor(seconds / 86400);
    unit = "day";
  }
  if (interval < 1) {
    interval = Math.floor(seconds / 3600);
    unit = "hour";
  }
  if (interval < 1) {
    interval = Math.floor(seconds / 60);
    unit = "minute";
  }
  if (interval < 1) {
    interval = seconds;
    unit = "second";
  }

  if (interval !== 1) {
    unit += "s";
  }

  return `${interval} ${unit} ago`;
};




// let user = 'jefbecker';
// let url = 'https://lastfm-last-played.biancarosa.com.br/' + user + '/latest-song';
// let song = document.querySelector('#song');
// fetch(url)
//    .then(function (response) {
//        return response.json()
//    }).then(function (json) {
//        song.innerHTML = json['track']['name'] + ' - ' + json['track']['artist']['#text'];
//    });