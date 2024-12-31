// Headless - How to Change Your Neocities Thumbnail from ARandomSite: https://arandomsite.neocities.org/writing/#custom-neocities-thumbnail //

const urlParams = new URLSearchParams(window.location.search); if (navigator.userAgent.includes('Screenjesus')) { window.location.replace("/thumbnail/"); }

// Hitcount_en - Native Neocities Hit-Counter & Last Updated From Dann: https://dannarchy.com/tut/tut_002 //

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var site_data = JSON.parse(this.responseText);
        var num_arr = site_data.info.views.toString().split("");
        var num_str = "";
        for (i = 0; i < num_arr.length; i++) {
            num_str += num_arr[i];
            if ((num_arr.length - 1 - i) % 3 == 0 && (num_arr.length - 1 - i) != 0) { num_str += ","; }
            var date_str = site_data.info.last_updated;
            var date_obj = new Date(site_data.info.last_updated);
            document.getElementById("lastupdate").innerHTML = (date_obj.getMonth() + 1) + "-" + date_obj.getDate() + "-" + date_obj.getFullYear();
        }
        document.getElementById("hitcount").innerHTML = num_str;
    }
};

xhttp.open("GET", "https://weirdscifi.ratiosemper.com/neocities.php?sitename=jefbecker", true);
xhttp.send();

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var site_data = JSON.parse(this.responseText);
        var date_obj = new Date(site_data.info.last_updated);
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        document.getElementById("lastupdate").innerHTML = days[date_obj.getDay()] + " " + months[date_obj.getMonth()] + " " + date_obj.getDate() + ", " + date_obj.getFullYear();

    }
};
xhttp.open("GET", "https://weirdscifi.ratiosemper.com/neocities.php?sitename=jefbecker", true);
xhttp.send();

// Lastplayed - Last played song in last.fm by biancarosa: https://github.com/biancarosa/lastfm-last-played //

let user = "jefbecker", url = "https://lastfm-last-played.biancarosa.com.br/" + user + "/latest-song", song = document.querySelector("#lfmSong"), lastplayed = document.querySelector("#lfmTime"); fetch(url).then(function (e) { return e.json() }).then(function (e) { song.innerHTML = e.track.name + " - " + e.track.artist["#text"], lastplayedunix = parseInt(e.track.date.uts), lastplayed.innerHTML = timeSince(lastplayedunix) }); var timeSince = function (e) { "object" != typeof e && (e = new Date(e)); var t, o = Math.floor(new Date().getTime() / 1e3 - e), r = Math.floor(o / 31536e3); return r >= 1 ? t = "year" : (r = Math.floor(o / 2592e3)) >= 1 ? t = "month" : (r = Math.floor(o / 86400)) >= 1 ? t = "day" : (r = Math.floor(o / 3600)) >= 1 ? t = "hour" : (r = Math.floor(o / 60)) >= 1 ? t = "minute" : (r = o, t = "second"), (r > 1 || 0 === r) && (t += "s"), r + " " + t + " ago" };

// Since //

document.getElementById("date").innerHTML = "<strong>2021 - 2025</strong>";

// Status - Latest status from status.cafe https://status.cafe //

fetch("https://status.cafe/users/jefbecker/status.json").then(t => t.json()).then(t => { if (!t.content.length) { document.getElementById("statusCafe-status").innerHTML = "No status yet."; return } document.getElementById("statusCafe-emoji").innerHTML = t.face, document.getElementById("statusCafe-time").innerHTML = t.timeAgo, document.getElementById("statusCafe-status").innerHTML = t.content });
