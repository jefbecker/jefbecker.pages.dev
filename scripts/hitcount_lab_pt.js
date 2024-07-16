// Script - Native Neocities Hit-Counter & Last Updated From Dann: https://dannarchy.com/tut/tut_002 //

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