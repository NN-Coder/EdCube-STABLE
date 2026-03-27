// Lucide icons
lucide.createIcons();

// Open in About:Blank
function openBlank() {
    const win = window.open();
    if (!win) {
        alert("Please allow popups to use this feature.");
        return;
    }
    const url = window.location.href;
    const iframe = win.document.createElement('iframe');
    
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.position = "fixed";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.src = url;
    
    win.document.body.style.margin = "0";
    win.document.body.appendChild(iframe);
}

// Dynamic game loading (game.html?id=game-id)
async function loadGameData() {
    const displayTitle = document.getElementById('displayTitle');
    const gameFrame = document.getElementById('gameFrame');
    
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('id');

    if (!gameId) {
        displayTitle.innerText = "No Game Selected";
        return;
    }

    try {
        const response = await fetch('games.json');
        const allGames = await response.json();

        const gameData = allGames.find(g => g.id === gameId);

        if (gameData) {
            document.title = `${gameData.title} | EdCube`;
            displayTitle.innerText = gameData.title;
            
            gameFrame.src = `../game_sources/${gameData.id}/index.html`;
            
            renderRecommendations(allGames, gameId);
        } else {
            displayTitle.innerText = "Game Not Found";
            document.title = "404 | EdCube";
        }

    } catch (error) {
        console.error("EdCube Engine Error:", error);
        displayTitle.innerText = "Error Loading Library";
    }
}

/**
 * Dynamic recommended games
 * @param {Array} allGames - full list of games from JSON
 * @param {string} currentId - id of current game
 */
function renderRecommendations(allGames, currentId) {
    const recGrid = document.getElementById('recommendedGrid');
    
    const filtered = allGames
        .filter(g => g.id !== currentId)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    recGrid.innerHTML = filtered.map(game => `
        <a href="game.html?id=${game.id}" class="game-card">
            <div class="card-inner">
                <div class="card-thumb" style="background-image: url('../${game.image}');"></div>
                <div class="card-overlay">
                    <span class="card-title">${game.title}</span>
                </div>
            </div>
        </a>
    `).join('');
}

// Fullscreen
const gameFrame = document.getElementById('gameFrame');
const fullscreenBtn = document.getElementById('fullscreenBtn');

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        gameFrame.requestFullscreen().catch(err => {
            console.error(`Fullscreen Error: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
}

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f') toggleFullscreen();
});

// Share
const shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Share cancelled");
            }
        } else {
            const tempInput = document.createElement('input');
            document.body.appendChild(tempInput);
            tempInput.value = window.location.href;
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            alert("Link copied to clipboard!");
        }
    });
}

window.addEventListener('DOMContentLoaded', loadGameData);