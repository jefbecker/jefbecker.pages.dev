// Function to parse XML and create tables
function parseXML(xml) {
    // Parse the XML
    var xmlDoc = new DOMParser().parseFromString(xml, 'text/xml');

    // Get the anime nodes
    var animeNodes = xmlDoc.getElementsByTagName('anime');

    // Create objects to store anime data based on status
    var watching = [];
    var completed = [];
    var onHold = [];
    var dropped = [];
    var planToWatch = [];

    // Iterate through anime nodes
    for (var i = 0; i < animeNodes.length; i++) {
        var anime = animeNodes[i];
        var title = anime.getElementsByTagName('series_title')[0].textContent;
        var type = anime.getElementsByTagName('series_type')[0].textContent;
        var score = anime.getElementsByTagName('my_score')[0].textContent;
        var status = anime.getElementsByTagName('my_status')[0].textContent;
        var finishDate = anime.getElementsByTagName('my_finish_date')[0].textContent;

        // Create object with anime data
        var animeObj = {
            'Title': title,
            'Type': type,
            'Score': score,
            'Status': status,
            'Finish date': finishDate
        };

        // Add anime object to respective status array
        switch (status) {
            case 'Watching':
                watching.push(animeObj);
                break;
            case 'Completed':
                completed.push(animeObj);
                break;
            case 'On-Hold':
                onHold.push(animeObj);
                break;
            case 'Dropped':
                dropped.push(animeObj);
                break;
            case 'Plan to Watch':
                planToWatch.push(animeObj);
                break;
            default:
                break;
        }
    }

    // Sort each table by Score in descending order
    watching.sort((a, b) => b.Score - a.Score);
    completed.sort((a, b) => b.Score - a.Score);
    onHold.sort((a, b) => b.Score - a.Score);
    dropped.sort((a, b) => b.Score - a.Score);
    planToWatch.sort((a, b) => b.Score - a.Score);

    // Function to create table from array
function createTable(data, tableId, titles) {
    var table = document.getElementById(tableId);
    var tbody = document.createElement('tbody');

    // Create table titles row
    var titleRow = document.createElement('tr');
    titles.forEach(function (title) {
        var th = document.createElement('th');
        th.appendChild(document.createTextNode(title));
        titleRow.appendChild(th);
    });
    tbody.appendChild(titleRow);

    // Create table rows
    data.forEach(function (anime) {
        var tr = document.createElement('tr');
        Object.values(anime).forEach(function (value) {
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(value));
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    // Append tbody to table
    table.appendChild(tbody);
}

// Create tables with titles
createTable(watching, 'anime_watching', ['Title', 'Type', 'Score', 'Status', 'Finish Date']);
createTable(completed, 'anime_completed', ['Title', 'Type', 'Score', 'Status', 'Finish Date']);
createTable(onHold, 'anime_on_hold', ['Title', 'Type', 'Score', 'Status', 'Finish Date']);
createTable(dropped, 'anime_dropped', ['Title', 'Type', 'Score', 'Status', 'Finish Date']);
createTable(planToWatch, 'anime_plan_to_watch', ['Title', 'Type', 'Score', 'Status', 'Finish Date']);

}

// Read XML file
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        parseXML(this.responseText);
    }
};
xmlhttp.open('GET', 'animelist.xml', true);
xmlhttp.send();
