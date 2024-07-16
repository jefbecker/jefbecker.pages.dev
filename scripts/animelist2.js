// Function to load XML file and generate tables
async function loadXMLAndGenerateTables() {
    try {
        const response = await fetch('animelist_1719059919.xml'); // Replace with the path to your XML file
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

        // Extract anime information
        const animeList = xmlDoc.getElementsByTagName("anime");
        const animeTable = document.getElementById("animeTable");

        // Create and append anime table headers
        const animeHeaders = ["Title", "Type", "Episodes", "Status", "Score", "Finish Date"];
        const animeHeaderRow = document.createElement("tr");
        animeHeaders.forEach(header => {
            const th = document.createElement("th");
            th.textContent = header;
            th.setAttribute('data-sort-type', 'text'); // Add sorting type attribute
            th.addEventListener('click', () => sortTable(animeTable, header.toLowerCase())); // Add click event listener
            animeHeaderRow.appendChild(th);
            if (header.toLowerCase() === 'finish date') {
                th.setAttribute('data-sort-direction', 'desc'); // Default sort direction for Finish Date column
            } else {
                th.setAttribute('data-sort-direction', 'none'); // Initial sort direction for other columns
            }
        });
        animeTable.appendChild(animeHeaderRow);

        // Create and append anime table data rows
        Array.from(animeList).forEach(anime => {
            const animeDataRow = document.createElement("tr");
            const animeFields = ["series_title", "series_type", "series_episodes", "my_status", "my_score", "my_finish_date"];
            animeFields.forEach(field => {
                const td = document.createElement("td");
                td.textContent = anime.getElementsByTagName(field)[0].textContent;
                animeDataRow.appendChild(td);
            });
            animeTable.appendChild(animeDataRow);
        });
    } catch (error) {
        console.error("Error loading XML file:", error);
    }
}

// Sort table function
function sortTable(table, sortBy) {
    const index = Array.from(table.rows[0].cells).findIndex(cell => cell.textContent.toLowerCase() === sortBy);
    const sortType = table.rows[0].cells[index].getAttribute('data-sort-type');
    let sortDirection = table.rows[0].cells[index].getAttribute('data-sort-direction');

    const rows = Array.from(table.rows).slice(1); // Exclude header row
    rows.sort((a, b) => {
        const aValue = a.cells[index].textContent.trim();
        const bValue = b.cells[index].textContent.trim();
        if (sortType === 'text') {
            return aValue.localeCompare(bValue);
        } else if (sortType === 'numeric') {
            return Number(aValue) - Number(bValue);
        }
    });

    // Reverse the rows for descending order
    if (sortDirection === 'desc') {
        rows.reverse();
        sortDirection = 'asc'; // Update direction to ascending after reversing
    } else {
        sortDirection = 'desc';
    }

    // Re-append sorted rows to the table
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    rows.forEach(row => table.appendChild(row));

    // Update sort direction attribute
    table.rows[0].cells[index].setAttribute('data-sort-direction', sortDirection);
}

// Load XML and generate tables on page load
window.onload = loadXMLAndGenerateTables;
// Simulate click on the "Finish Date" header after the tables are generated
window.onload = function () {
    loadXMLAndGenerateTables(); // Load XML and generate tables
    setTimeout(function () {
        const finishDateHeader = document.querySelector('#animeTable th[data-sort-direction="desc"]');
        finishDateHeader.click(); // Simulate click on the "Finish Date" header
    }, 500); // Delay to ensure tables are fully loaded before simulating click
};