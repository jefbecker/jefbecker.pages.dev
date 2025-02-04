// Headless - How to Change Your Neocities Thumbnail from ARandomSite: https://arandomsite.neocities.org/writing/#custom-neocities-thumbnail //

// const urlParams = new URLSearchParams(window.location.search); if (navigator.userAgent.includes('Screenjesus')) { window.location.replace("/thumbnail/"); } //

// Hitcount_br - Native Neocities Hit-Counter & Last Updated From Dann: https://dannarchy.com/tut/tut_002 //

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var site_data = JSON.parse(this.responseText);
        var num_arr = site_data.info.views.toString().split("");
        var num_str = "";
        for (i = 0; i < num_arr.length; i++) {
            num_str += num_arr[i];
            if ((num_arr.length - 1 - i) % 3 == 0 && (num_arr.length - 1 - i) != 0) { num_str += "."; }
            var date_str = site_data.info.last_updated;
            var date_obj = new Date(site_data.info.last_updated);
            document.getElementById("lastupdate_br").innerHTML = (date_obj.getMonth() + 1) + "-" + date_obj.getDate() + "-" + date_obj.getFullYear();
        }
        document.getElementById("hitcount_br").innerHTML = num_str;
    }
};

xhttp.open("GET", "https://weirdscifi.ratiosemper.com/neocities.php?sitename=jefbecker", true);
xhttp.send();

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var site_data = JSON.parse(this.responseText);
        var date_obj = new Date(site_data.info.last_updated);
        var days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
        var months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        document.getElementById("lastupdate_br").innerHTML = days[date_obj.getDay()] + ", " + date_obj.getDate() + " de " + months[date_obj.getMonth()] + " de " + date_obj.getFullYear();

    }
};
xhttp.open("GET", "https://weirdscifi.ratiosemper.com/neocities.php?sitename=jefbecker", true);
xhttp.send();

// Lastplayed - Last played song in last.fm by biancarosa: https://github.com/biancarosa/lastfm-last-played //

// let user = "jefbecker", url = "https://lastfm-last-played.biancarosa.com.br/" + user + "/latest-song", song = document.querySelector("#lfmSong"), lastplayed = document.querySelector("#lfmTime"); fetch(url).then(function (e) { return e.json() }).then(function (e) { song.innerHTML = e.track.name + " - " + e.track.artist["#text"], lastplayedunix = parseInt(e.track.date.uts), lastplayed.innerHTML = timeSince(lastplayedunix) }); var timeSince = function (e) { "object" != typeof e && (e = new Date(e)); var t, o = Math.floor(new Date().getTime() / 1e3 - e), r = Math.floor(o / 31536e3); return r >= 1 ? t = "year" : (r = Math.floor(o / 2592e3)) >= 1 ? t = "month" : (r = Math.floor(o / 86400)) >= 1 ? t = "day" : (r = Math.floor(o / 3600)) >= 1 ? t = "hour" : (r = Math.floor(o / 60)) >= 1 ? t = "minute" : (r = o, t = "second"), (r > 1 || 0 === r) && (t += "s"), r + " " + t + " ago" }; //

// Since //

document.getElementById("date").innerHTML = "<strong>jefbecker.com | 2021 - 2025</strong>";

// Status - Latest status from status.cafe https://status.cafe //

fetch("https://status.cafe/users/jefbecker/status.json").then(t => t.json()).then(t => { if (!t.content.length) { document.getElementById("statusCafe-status").innerHTML = "No status yet."; return } document.getElementById("statusCafe-emoji").innerHTML = t.face, document.getElementById("statusCafe-time").innerHTML = t.timeAgo, document.getElementById("statusCafe-status").innerHTML = t.content });

// Displaying scrobbles and last played on your site https://support.last.fm/t/last-fm-wordpress-plugin-displaying-scrobbles-and-last-played-on-your-site/57425/6 //

class LastFmRecentTracks {

    constructor(apiKey, user, limit, showNowPlaying, cacheTime, domId) {
        this.apiKey = apiKey;
        this.user = user;
        this.limit = limit;
        this.showNowPlaying = showNowPlaying;
        this.cacheTime = cacheTime;
        this.domContainer = document.getElementById(domId);
        if (!this.domContainer) {
            throw new Error("Invalid Last.fm DOM container ID: " + domId);
        }
    }

    run() {
        let cachedRecentTracks = null;
        try {
            cachedRecentTracks = this.loadRecentTracksFromCache();
        } catch (err) { }

        if (cachedRecentTracks) {
            try {
                this.render(cachedRecentTracks);
            } catch (err) {
                this.renderError(err);
            }
        } else {
            this.loadRecentTracks();
        }
    }

    loadRecentTracks() {
        fetch(this.buildUrl())
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(data => {
                this.updateCache(data);
                this.render(data);
            })
            .catch(err => this.renderError(err));
    }

    buildUrl() {
        return `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&api_key=${this.apiKey}&user=${encodeURIComponent(this.user)}&limit=${this.limit}&format=json`;
    }

    loadRecentTracksFromCache() {
        if (this.cacheTime > 0) {
            const cachedRecentTracksString = window.localStorage.getItem(this.cacheKey());
            if (cachedRecentTracksString) {
                const cachedRecentTracks = JSON.parse(cachedRecentTracksString);
                if (cachedRecentTracks.user === this.user
                    && (this.nowTimestamp() - cachedRecentTracks.timestamp) <= this.cacheTime) {
                    return cachedRecentTracks.data;
                }
            }
        }
        return null;
    }

    updateCache(data) {
        if (this.cacheTime > 0) {
            const cacheItem = JSON.stringify({ timestamp: this.nowTimestamp(), user: this.user, data });
            window.localStorage.setItem(this.cacheKey(), cacheItem);
        }
    }

    render(data) {
        if (!data.recenttracks) {
            throw new Error("Invalid response");
        }
        const rawTracks = data.recenttracks.track;
        const hasNowPlaying = rawTracks[0]['@attr']?.nowplaying;
        const tracks = !this.showNowPlaying && hasNowPlaying ? rawTracks.slice(1) : rawTracks.slice(0, this.limit);
        this.domContainer.innerHTML = tracks.map(track => this.template(track)).join('');
    }

    template(track) {
        let image = track.image.find(img => img.size === "large");
        if (!image || !image['#text']) {
            image = "https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png";
        } else {
            image = image['#text'];
        }

        const date = track['@attr']?.nowplaying ? "Ouvindo agora" : track.date['#text'];

        return this.html`
            <div style="display:flex;margin-bottom:1em">
                <div style="flex:0 0 80px;margin-right:1em;">
                    <img aria-hidden="true" style="border-radius: 0.25em;" alt="Capa do álbum" width="80" height="80" src="${image}">
                </div>
                <div>
                    <a target="_blank" href="${track.url}">${track.name}</a><br>
                    <small>${track.artist['#text']}</small><br>
                    <small>${date}</small>
                </div>
            </div>`;
    }

    renderError(err) {
        console.error(err);
        this.domContainer.innerHTML = `<div>Erro ao carregar as músicas recentes</div>`;
    }

    html(literals, ...subs) {
        return literals.raw.reduce((acc, literal, i) => {
            let sub = subs[i - 1];
            if (Array.isArray(sub)) {
                sub = sub.join('');
            }
            sub = this.escapeHtml(sub);
            return acc + sub + literal;
        });
    }

    escapeHtml(unsafe) {
        return unsafe.replace(/[&<>"'`]/g, match => {
            switch (match) {
                case '&':
                    return "&amp;";
                case '<':
                    return "&lt;";
                case '>':
                    return "&gt;";
                case '"':
                    return "&quot;";
                case '\'':
                    return "&#039;";
                case '`':
                    return "&#96;";
            }
        });
    }

    nowTimestamp() {
        return Math.floor(Date.now() / 1000);
    }

    cacheKey() {
        return "lastfm_recent_tracks_cache";
    }
}

const lastfm = new LastFmRecentTracks("e5f8963ad95927c73f68492c0050f7a8", "jefbecker", 1, true, 0, "lastfm_br");
lastfm.run();