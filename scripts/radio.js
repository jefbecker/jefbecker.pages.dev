const player = document.getElementById("player");
const radios = document.querySelectorAll(".radio");
const radioAtual = document.getElementById("radioAtual");

let radioAtiva = null;

const cacheStreams = {};

async function extrairStream(m3u) {

    const resposta = await fetch(m3u);
    const texto = await resposta.text();

    const linhas = texto.split("\n");

    for (let linha of linhas) {

        linha = linha.trim();

        if (linha && !linha.startsWith("#")) {
            return linha;
        }

    }

    return null;
}

radios.forEach(botao => {

    botao.addEventListener("click", async function () {

        const nome = this.dataset.nome;
        const arquivo = this.dataset.m3u;

        if (radioAtiva === this) {

            if (player.paused) {
                player.play();
                this.innerText = "⏸";
            } else {
                player.pause();
                this.innerText = "▶";
            }

            return;
        }

        if (radioAtiva) {
            radioAtiva.innerText = "▶";
        }

        let stream;

        if (cacheStreams[arquivo]) {
            stream = cacheStreams[arquivo];
        } else {
            stream = await extrairStream(arquivo);
            cacheStreams[arquivo] = stream;
        }

        if (!stream) {
            this.innerText = "Error";
            return;
        }

        player.src = stream;
        player.play();

        this.innerText = "⏸";
        radioAtual.innerText = "Now Playing: " + nome;

        radioAtiva = this;

    });

});