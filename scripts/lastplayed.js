let user="jefbecker",url="https://lastfm-last-played.biancarosa.com.br/"+user+"/latest-song",song=document.querySelector("#lfmSong"),lastplayed=document.querySelector("#lfmTime");fetch(url).then(function(e){return e.json()}).then(function(e){song.innerHTML=e.track.name+" - "+e.track.artist["#text"],lastplayedunix=parseInt(e.track.date.uts),lastplayed.innerHTML=timeSince(lastplayedunix)});var timeSince=function(e){"object"!=typeof e&&(e=new Date(e));var t,o=Math.floor(new Date().getTime()/1e3-e),r=Math.floor(o/31536e3);return r>=1?t="year":(r=Math.floor(o/2592e3))>=1?t="month":(r=Math.floor(o/86400))>=1?t="day":(r=Math.floor(o/3600))>=1?t="hour":(r=Math.floor(o/60))>=1?t="minute":(r=o,t="second"),(r>1||0===r)&&(t+="s"),r+" "+t+" ago"};

// let user = 'jefbecker';
// let url = 'https://lastfm-last-played.biancarosa.com.br/' + user + '/latest-song';
// let song = document.querySelector('#song');
// fetch(url)
//    .then(function (response) {
//        return response.json()
//    }).then(function (json) {
//        song.innerHTML = json['track']['name'] + ' - ' + json['track']['artist']['#text'];
//    });