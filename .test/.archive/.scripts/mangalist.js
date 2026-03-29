// Function to parse XML and create tables
function parseXML(xml) {
    // Parse the XML
    var xmlDoc = new DOMParser().parseFromString(xml, 'text/xml');

    // Get the manga nodes
    var mangaNodes = xmlDoc.getElementsByTagName('manga');

    // Create objects to store manga data based on status
    var reading = [];
    var completed = [];
    var onHold = [];
    var dropped = [];
    var planToRead = [];

    // Iterate through manga nodes
    for (var i = 0; i < mangaNodes.length; i++) {
        var manga = mangaNodes[i];
        var title = manga.getElementsByTagName('manga_title')[0].textContent;
        var chapters = manga.getElementsByTagName('manga_chapters')[0].textContent;
        var score = manga.getElementsByTagName('my_score')[0].textContent;
        var status = manga.getElementsByTagName('my_status')[0].textContent;
        var finishDate = manga.getElementsByTagName('my_finish_date')[0].textContent;

        // Create object with manga data
        var mangaObj = {
            'Title': title,
            'Chapters': chapters,
            'Score': score,
            'Status': status,
            'Finish date': finishDate
        };

        // Add manga object to respective status array
        switch (status) {
            case 'Reading':
                reading.push(mangaObj);
                break;
            case 'Completed':
                completed.push(mangaObj);
                break;
            case 'On-Hold':
                onHold.push(mangaObj);
                break;
            case 'Dropped':
                dropped.push(mangaObj);
                break;
            case 'Plan to Read':
                planToRead.push(mangaObj);
                break;
            default:
                break;
        }
    }

    // Sort each table by Score in descending order
    reading.sort((a, b) => b.Score - a.Score);
    completed.sort((a, b) => b.Score - a.Score);
    onHold.sort((a, b) => b.Score - a.Score);
    dropped.sort((a, b) => b.Score - a.Score);
    planToRead.sort((a, b) => b.Score - a.Score);

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
    data.forEach(function (manga) {
        var tr = document.createElement('tr');
        Object.values(manga).forEach(function (value) {
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
createTable(reading, 'manga_reading', ['Title', 'Chapters', 'Score', 'Status', 'Finish Date']);
createTable(completed, 'manga_completed', ['Title', 'Chapters', 'Score', 'Status', 'Finish Date']);
createTable(onHold, 'manga_on_hold', ['Title', 'Chapters', 'Score', 'Status', 'Finish Date']);
createTable(dropped, 'manga_dropped', ['Title', 'Chapters', 'Score', 'Status', 'Finish Date']);
createTable(planToRead, 'manga_plan_to_read', ['Title', 'Chapters', 'Score', 'Status', 'Finish Date']);

}

// Read XML file
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        parseXML(this.responseText);
    }
};
xmlhttp.open('GET', 'mangalist.xml', true);
xmlhttp.send();
