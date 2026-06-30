const sampleNews = [
    { id: 1, title: "Messi lidera al Inter Miami a la victoria en épica final", description: "Lionel Messi marcó el gol de la victoria en los últimos minutos del partido.", category: "Fútbol", sport: "futbol", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9e55?w=600&h=400&fit=crop", time: "hace 2 horas", likes: 1250, content: "En una noche histórica en el Inter Miami, Lionel Messi demostró por qué es considerado el mejor jugador del mundo." },
    { id: 2, title: "Giannis Antetokounmpo rompe récord de anotación en playoffs", description: "El 'Freak Griego' anotó 52 puntos en una impresionante actuación.", category: "Baloncesto", sport: "baloncesto", image: "https://images.unsplash.com/photo-1546519638-68711109ff46?w=600&h=400&fit=crop", time: "hace 3 horas", likes: 980, content: "Giannis Antetokounmpo se adueño de la cancha esta noche." },
    { id: 3, title: "Iga Świątek avanza a la final de Wimbledon con emocionante victoria", description: "La tenista polaca venció a su rival en tres sets.", category: "Tenis", sport: "tenis", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop", time: "hace 4 horas", likes: 750, content: "Con una mezcla de potencia y precisión, Iga Świątek se llevó la victoria." },
    { id: 4, title: "Manchester City hace historia ganando su 5ª Champions consecutiva", description: "El equipo inglés conquistó su quinta Liga de Campeones.", category: "Fútbol", sport: "futbol", image: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600&h=400&fit=crop", time: "hace 5 horas", likes: 2100, content: "La dinastía del Manchester City continúa." },
    { id: 5, title: "Los Lakers reclutan a superestrellas para la temporada 2024", description: "Los Lakers ficharon a tres jugadores All-Star.", category: "Baloncesto", sport: "baloncesto", image: "https://images.unsplash.com/photo-1504611828145-2c752e8a3d08?w=600&h=400&fit=crop", time: "hace 6 horas", likes: 1650, content: "En una medida de máximo nivel, los Lakers prepararon sorpresas." },
    { id: 6, title: "Djokovic anuncia su participación en el US Open 2024", description: "El tenista serbio confirmó que competirá en el US Open.", category: "Tenis", sport: "tenis", image: "https://images.unsplash.com/photo-1554074239-ce0aa0ad0b13?w=600&h=400&fit=crop", time: "hace 7 horas", likes: 890, content: "Novak Djokovic dejó zanjados los rumores." },
    { id: 7, title: "Los Yankees se preparan para los playoffs con racha ganadora", description: "El equipo de Nueva York acumula 10 victorias consecutivas.", category: "Béisbol", sport: "beisbol", image: "https://images.unsplash.com/photo-1540747913199-22f4ee2549a3?w=600&h=400&fit=crop", time: "hace 1 hora", likes: 620, content: "Los Yankees están en su mejor momento de la temporada." },
    { id: 8, title: "Las Vegas Golden Knights ganan la Stanley Cup", description: "En su primer año en la Liga, el equipo de Vegas conquistó el trofeo.", category: "Hockey", sport: "hockey", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=400&fit=crop", time: "hace 2 horas", likes: 1120, content: "En una historia digna de cine, las Vegas Golden Knights ganaron." }
];

const liveScoresData = [
    { teams: "Barcelona vs Real Madrid", score: "2 - 1", time: "45+2'" },
    { teams: "Celtics vs Heat", score: "98 - 87", time: "Final Q2" },
    { teams: "Federer vs Nadal", score: "6-4, 3-5", time: "Set 2" },
];

const trendingTopics = [
    { topic: "#MundialQatar2024", count: "125K" },
    { topic: "#NFLPlayoffs", count: "98K" },
    { topic: "#TennisOpen", count: "87K" },
    { topic: "#BasquetLiga", count: "65K" },
];

let currentSlide = 0;
let allNews = [...sampleNews];
let filteredNews = [...sampleNews];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    initializeCarousel();
    displayNews(filteredNews);
    displayLiveScores();
    displayTrendingTopics();
    displayTopStories();
    setupEventListeners();
});

function initializeCarousel() {
    const track = document.getElementById('carouselTrack');
    track.innerHTML = sampleNews.slice(0, 5).map((news, index) => `
        <div class="carousel-slide" data-index="${index}">
            <img src="${news.image}" alt="${news.title}">
            <div class="carousel-slide-content">
                <h3>${news.title}</h3>
                <p>${news.description}</p>
            </div>
        </div>
    `).join('');
    
    document.getElementById('prevBtn').addEventListener('click', prevSlide);
    document.getElementById('nextBtn').addEventListener('click', nextSlide);
    setInterval(nextSlide, 8000);
}

function prevSlide() {
    const slides = document.querySelectorAll('.carousel-slide').length;
    currentSlide = (currentSlide - 1 + slides) % slides;
    updateCarousel();
}

function nextSlide() {
    const slides = document.querySelectorAll('.carousel-slide').length;
    currentSlide = (currentSlide + 1) % slides;
    updateCarousel();
}

function updateCarousel() {
    const track = document.getElementById('carouselTrack');
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function setupEventListeners() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.sport;
            filterNews();
        });
    });
    document.getElementById('searchBtn').addEventListener('click', searchNews);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchNews();
    });
}

function filterNews() {
    if (currentFilter === 'all') {
        filteredNews = [...allNews];
    } else {
        filteredNews = allNews.filter(news => news.sport === currentFilter);
    }
    displayNews(filteredNews);
}

function searchNews() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredNews = allNews.filter(news => 
        news.title.toLowerCase().includes(searchTerm) || 
        news.description.toLowerCase().includes(searchTerm)
    );
    displayNews(filteredNews);
}

function displayNews(newsArray) {
    const newsGrid = document.getElementById('newsGrid');
    if (newsArray.length === 0) {
        newsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">No se encontraron noticias</p>';
        return;
    }
    newsGrid.innerHTML = newsArray.map(news => `
        <div class="news-card" onclick="openModal(${news.id})">
            <img src="${news.image}" alt="${news.title}">
            <div class="news-card-content">
                <span class="news-category">${news.category}</span>
                <h3>${news.title}</h3>
                <p>${news.description}</p>
                <div class="news-footer">
                    <span class="news-time">${news.time}</span>
                    <div class="news-likes">
                        <i class="fas fa-heart"></i>
                        <span>${news.likes}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function displayLiveScores() {
    const scoresContainer = document.getElementById('liveScores');
    scoresContainer.innerHTML = liveScoresData.map(score => `
        <div class="score-item">
            <div class="score-teams">${score.teams}</div>
            <div class="score-value">${score.score}</div>
            <div class="score-time">${score.time}</div>
        </div>
    `).join('');
}

function displayTrendingTopics() {
    const trendingContainer = document.getElementById('trendingTopics');
    trendingContainer.innerHTML = trendingTopics.map(trend => `
        <div class="trending-item">
            <strong>${trend.topic}</strong>
            <span>${trend.count} menciones</span>
        </div>
    `).join('');
}

function displayTopStories() {
    const topStoriesContainer = document.getElementById('topStories');
    const topStories = [...allNews].sort((a, b) => b.likes - a.likes).slice(0, 3);
    topStoriesContainer.innerHTML = topStories.map((story, index) => `
        <div class="top-story-item" onclick="openModal(${story.id})">
            <div class="top-story-rank">#${index + 1}</div>
            <div class="top-story-content">
                <h4>${story.title}</h4>
                <span>${story.likes} likes</span>
            </div>
        </div>
    `).join('');
}

function openModal(newsId) {
    const news = allNews.find(n => n.id === newsId);
    if (!news) return;
    const modal = document.getElementById('newsModal');
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <img src="${news.image}" style="width: 100%; border-radius: 10px; margin-bottom: 20px; height: auto;">
        <span class="news-category">${news.category}</span>
        <h2 style="color: #1a1a1a; margin: 15px 0;">${news.title}</h2>
        <p style="color: #666; font-size: 0.9rem; margin-bottom: 15px;">${news.time}</p>
        <p style="color: #333; line-height: 1.8; font-size: 1.05rem;">${news.content}</p>
        <div style="display: flex; gap: 20px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <button style="padding: 10px 20px; background: #FF0000; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600;" onclick="likeArticle()">
                <i class="fas fa-heart"></i> Me gusta (${news.likes})
            </button>
            <button style="padding: 10px 20px; background: #00D4FF; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600;" onclick="shareArticle('${news.title}')">
                <i class="fas fa-share"></i> Compartir
            </button>
        </div>
    `;
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('newsModal').style.display = 'none';
}

document.querySelector('.close').addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    const modal = document.getElementById('newsModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

function likeArticle() {
    alert('¡Te encantó esta noticia!');
}

function shareArticle(title) {
    const shareText = `Mira esta noticia en SportsPro: ${title}`;
    if (navigator.share) {
        navigator.share({ title: 'SportsPro', text: shareText });
    } else {
        alert(`Compartir: ${shareText}`);
    }
}

console.log('SportsPro cargado correctamente ✓');