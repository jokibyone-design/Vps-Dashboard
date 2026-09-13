// Game Data
const games = [
    {
        id: 1,
        title: 'Cyber Runner',
        genre: 'Action',
        emoji: '🎮',
        rating: 4.8,
        status: 'Available',
        description: 'High-speed action game with futuristic graphics. Navigate through dangerous cyber worlds and defeat enemies.'
    },
    {
        id: 2,
        title: 'Puzzle Master',
        genre: 'Puzzle',
        emoji: '🧩',
        rating: 4.6,
        status: 'Available',
        description: 'Challenge your mind with hundreds of brain-teasing puzzles. Solve them step by step and unlock achievements.'
    },
    {
        id: 3,
        title: 'Galaxy Quest',
        genre: 'Adventure',
        emoji: '🚀',
        rating: 4.7,
        status: 'Available',
        description: 'Explore the vast galaxy and discover alien planets. Complete missions and uncover the mysteries of space.'
    },
    {
        id: 4,
        title: 'Knight Legend',
        genre: 'RPG',
        emoji: '⚔️',
        rating: 4.9,
        status: 'Available',
        description: 'Epic RPG adventure with dragons, quests, and magic. Become the legendary knight and save the kingdom.'
    },
    {
        id: 5,
        title: 'Racing Thunder',
        genre: 'Racing',
        emoji: '🏎️',
        rating: 4.5,
        status: 'Available',
        description: 'Fast-paced racing game with stunning tracks. Compete against AI and players worldwide.'
    },
    {
        id: 6,
        title: 'Survival Island',
        genre: 'Survival',
        emoji: '🏝️',
        rating: 4.4,
        status: 'Available',
        description: 'Stranded on a mysterious island. Gather resources, build shelter, and survive the challenges of nature.'
    },
    {
        id: 7,
        title: 'Space Invaders',
        genre: 'Shooter',
        emoji: '👾',
        rating: 4.7,
        status: 'Available',
        description: 'Classic arcade shooter with modern graphics. Defend Earth from alien invasion with powerful weapons.'
    },
    {
        id: 8,
        title: 'Football Pro',
        genre: 'Sports',
        emoji: '⚽',
        rating: 4.6,
        status: 'Available',
        description: 'Realistic football simulation. Build your team, play matches, and win the championship.'
    }
];

// DOM Elements
const gamesGrid = document.getElementById('gamesGrid');
const searchInput = document.getElementById('searchInput');
const gameModal = document.getElementById('gameModal');
const closeBtn = document.querySelector('.close');
const playBtn = document.getElementById('playBtn');
const gameCountEl = document.getElementById('gameCount');
const playedCountEl = document.getElementById('playedCount');
const hoursCountEl = document.getElementById('hoursCount');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadGames(games);
    updateStats();
    setupEventListeners();
});

// Load and render games
function loadGames(gamesToDisplay) {
    gamesGrid.innerHTML = '';
    
    if (gamesToDisplay.length === 0) {
        gamesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px;">No games found</p>';
        return;
    }

    gamesToDisplay.forEach(game => {
        const gameCard = createGameCard(game);
        gamesGrid.appendChild(gameCard);
    });
}

// Create game card element
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    
    const stars = '★'.repeat(Math.floor(game.rating)) + (game.rating % 1 !== 0 ? '½' : '');
    
    card.innerHTML = `
        <div class="game-thumbnail">${game.emoji}</div>
        <div class="game-info">
            <div class="game-title">${game.title}</div>
            <div class="game-meta">${game.genre}</div>
            <div class="game-rating">${stars} ${game.rating}</div>
            <div class="game-status">${game.status}</div>
        </div>
    `;
    
    card.addEventListener('click', () => openModal(game));
    return card;
}

// Open game details modal
function openModal(game) {
    document.getElementById('modalTitle').textContent = game.title;
    document.getElementById('modalDescription').textContent = game.description;
    document.getElementById('modalGenre').textContent = game.genre;
    document.getElementById('modalStatus').textContent = game.status;
    document.getElementById('modalRating').textContent = `${game.rating}/5.0`;
    
    gameModal.style.display = 'block';
    gameModal.dataset.gameId = game.id;
    gameModal.dataset.gameTitle = game.title;
    
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    gameModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Play game
function playGame() {
    const gameTitle = gameModal.dataset.gameTitle;
    const gameId = gameModal.dataset.gameId;
    
    alert(`🎮 Launching: ${gameTitle}\n\nGame started successfully!`);
    
    // Track played stats
    trackGamePlay(gameId, gameTitle);
    
    closeModal();
}

// Track game play statistics
function trackGamePlay(gameId, gameTitle) {
    let stats = JSON.parse(localStorage.getItem('gameStats')) || {
        totalGames: games.length,
        gamesPlayed: 0,
        hoursPlayed: 0,
        playHistory: []
    };
    
    const existingGame = stats.playHistory.find(g => g.id === gameId);
    if (existingGame) {
        existingGame.plays++;
    } else {
        stats.playHistory.push({
            id: gameId,
            title: gameTitle,
            plays: 1,
            lastPlayed: new Date().toLocaleString()
        });
        stats.gamesPlayed++;
    }
    
    // Add random hours (0.5 to 3 hours per play)
    stats.hoursPlayed += Math.floor(Math.random() * 3) + 0.5;
    
    localStorage.setItem('gameStats', JSON.stringify(stats));
    updateStats();
}

// Update dashboard statistics
function updateStats() {
    const stats = JSON.parse(localStorage.getItem('gameStats')) || {
        totalGames: games.length,
        gamesPlayed: 0,
        hoursPlayed: 0
    };
    
    gameCountEl.textContent = stats.totalGames;
    playedCountEl.textContent = stats.gamesPlayed;
    hoursCountEl.textContent = Math.floor(stats.hoursPlayed);
}

// Search functionality
function handleSearch(query) {
    const lowerQuery = query.toLowerCase();
    const filteredGames = games.filter(game => 
        game.title.toLowerCase().includes(lowerQuery) ||
        game.genre.toLowerCase().includes(lowerQuery)
    );
    loadGames(filteredGames);
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', (e) => {
        handleSearch(e.target.value);
    });
    
    // Modal controls
    closeBtn.addEventListener('click', closeModal);
    playBtn.addEventListener('click', playGame);
    
    // Close modal when clicking outside
    gameModal.addEventListener('click', (e) => {
        if (e.target === gameModal) {
            closeModal();
        }
    });
    
    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && gameModal.style.display === 'block') {
            closeModal();
        }
    });
}

// Reset stats (optional function)
function resetStats() {
    if (confirm('Are you sure you want to reset all statistics?')) {
        localStorage.removeItem('gameStats');
        updateStats();
        alert('Statistics have been reset!');
    }
}

// Export stats (optional function)
function exportStats() {
    const stats = JSON.parse(localStorage.getItem('gameStats')) || {};
    const dataStr = JSON.stringify(stats, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'game-stats.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}
