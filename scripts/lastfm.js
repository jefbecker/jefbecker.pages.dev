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
        } catch (err) {}

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
            const cacheItem = JSON.stringify({timestamp: this.nowTimestamp(), user: this.user, data});
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
        let image = track.image.find(img => img.size === "medium");
        if (!image || !image['#text']) {
            image = "https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png";
        } else {
            image = image['#text'];
        }

        const date = track['@attr']?.nowplaying ? "Now playing" : track.date['#text'];

        return this.html`
            <div style="display:flex;margin-bottom:1em">
                <div style="flex:0 0 64px;margin-right:1em;">
                    <img aria-hidden="true" alt="Album cover" src="${image}">
                </div>
                <div>
                    <strong><a target="_blank" href="${track.url}">${track.name}</a></strong><br>
                    ${track.artist['#text']}<br>
                    <small>${date}</small>
                </div>
            </div>`;
    }

    renderError(err) {
        console.error(err);
        this.domContainer.innerHTML = `<div>Error loading recent tracks from Last.fm</div>`;
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
USERNAME", 1, true, 0, "lastfm_en");
lastfm.run();