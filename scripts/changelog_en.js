async function loadCommits(user, repo, containerId, limit = 10) {
    try {
        const url = `https://api.github.com/repos/${user}/${repo}/commits`;

        const response = await fetch(url);
        const data = await response.json();

        const ul = document.getElementById(containerId);

        ul.innerHTML = data.slice(0, limit).map(commit => {
            const message = commit.commit.message.split("\n")[0] || "No title";
            const link = commit.html_url;

            const dateRaw = commit.commit.author.date;
            const d = new Date(dateRaw);

            const day = String(d.getDate()).padStart(2, '0');

            let month = d.toLocaleString('en-US', {
                month: 'short',
                timeZone: 'America/Sao_Paulo'
            }).toLowerCase().replace('.', '');

            const year = d.toLocaleString('en-US', {
                year: 'numeric',
                timeZone: 'America/Sao_Paulo'
            });

            const time = d.toLocaleTimeString('en-US', {
                timeZone: 'America/Sao_Paulo',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            const date = `${day} ${month} ${year}, ${time}`;

            return `
                <li>
                    <a href="${link}" target="_blank">
                        ${message}
                    </a><br>
                    <small>${date}</small>
                </li>
            `;
        }).join("");

    } catch (error) {
        console.error(error);
        document.getElementById(containerId).innerHTML =
            "<li>Error loading commits</li>";
    }
}

// USO
loadCommits("jefbecker", "jefbecker.com", "github-changelog");