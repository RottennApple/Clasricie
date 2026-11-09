// Variável de controle para tocar a música apenas no primeiro clique de cada ciclo
let musicaJaTocou = false;
// Variável de controle para o Cooldown do botão
let emCooldown = false;

// --- SVG DO SINO ---
const bellSVG = `
<svg viewBox="0 0 24 24">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
</svg>
`;

// --- GERADOR ALEATÓRIO DE SINOS (Fora da área do título) ---
function gerarSinos() {
    const container = document.getElementById("bellContainer");
    container.innerHTML = ""; // Limpa os sinos anteriores

    // Sorteia quantidade entre 1 e 3 sinos
    const quantidade = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < quantidade; i++) {
        const bell = document.createElement("div");
        bell.className = "bell animate__animated animate__bounceIn";
        bell.innerHTML = bellSVG;

        // Posição segura: Metade inferior da tela (50% a 85% de altura)
        const top = Math.floor(Math.random() * 35) + 50; 
        const left = Math.floor(Math.random() * 70) + 15; 

        bell.style.top = `${top}%`;
        bell.style.left = `${left}%`;
        bell.style.animationDelay = `${i * 0.3}s`;

        // Evento de clique no sino
        bell.onclick = function () {
            ativarCena(this);
        };

        container.appendChild(bell);
    }
}

// --- REVELAÇÃO DA CENA ---
function ativarCena(sinoClicado) {
    // Toca a música apenas na primeira vez que um sino for clicado
    if (!musicaJaTocou) {
        const audio = document.getElementById("minhaMusica");
        if (audio) {
            audio.currentTime = 0; // Garante que comece do início
            audio.play().catch(error => {
                console.log("Aguardando arquivo de áudio no src do HTML.");
            });
        }
        musicaJaTocou = true;
    }

    // Adiciona animação de balanço no sino selecionado
    sinoClicado.classList.add("animate__animated", "animate__tada");

    // Atualiza o texto da interface
    document.getElementById("texto").innerText = "Frase impactante(ou quase)...";

    // Dispara a animação das cortinas
    setTimeout(() => {
        document.body.classList.add("open");
        document.getElementById("texto").innerText = "Eu juro que tentei! :c";
    }, 400);
}

// --- REINICIAR CENA (COM PARADA DE SOM E COOLDOWN DE 3s) ---
function reiniciarCena() {
    // Se já estiver em cooldown, ignora múltiplos cliques
    if (emCooldown) return;

    const btn = document.querySelector(".interface button");
    const audio = document.getElementById("minhaMusica");

    // 1. Interrompe a música imediatamente e reseta
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
    musicaJaTocou = false; // Permite tocar novamente ao clicar em um novo sino

    // 2. Fecha a cortina
    document.body.classList.remove("open");
    document.getElementById("texto").innerText = "Preparando tudo de novo...";

    // 3. Ativa o Cooldown de 3 segundos no botão
    emCooldown = true;
    if (btn) {
        btn.disabled = true;
        btn.style.opacity = "0.6";
        btn.style.cursor = "not-allowed";
    }

    let tempoRestante = 3;
    btn.innerText = `Aguarde (${tempoRestante}s)...`;

    const intervalo = setInterval(() => {
        tempoRestante--;
        if (tempoRestante > 0) {
            btn.innerText = `Aguarde (${tempoRestante}s)...`;
        } else {
            clearInterval(intervalo);
            emCooldown = false;
            if (btn) {
                btn.disabled = false;
                btn.style.opacity = "1";
                btn.style.cursor = "pointer";
                btn.innerText = "Começar do zero?";
            }
            document.getElementById("texto").innerText = "Toque em um dos sinos para abrir as cortinas...";
        }
    }, 1000);

    // 4. Gera novos sinos na tela
    gerarSinos();
}

// Inicializa os sinos ao carregar a página
document.addEventListener("DOMContentLoaded", gerarSinos);