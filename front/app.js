// ========================================
// APLICACIÓN 100% JAVASCRIPT - SIN PHP
// ========================================

// Estado global de la aplicación
let peliculas = [];
let series = [];
let isLoading = false;

// Elementos del DOM
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const moviesCount = document.getElementById('moviesCount');
const seriesCount = document.getElementById('seriesCount');
const peliculasGrid = document.getElementById('peliculas-grid');
const seriesGrid = document.getElementById('series-grid');
const emptyMovies = document.getElementById('empty-movies');
const emptySeries = document.getElementById('empty-series');

// Placeholders SVG
const MOVIE_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='165'%3E%3Crect fill='%23333' width='120' height='165'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23666' font-size='40'%3E🎬%3C/text%3E%3C/svg%3E";
const SERIES_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='165'%3E%3Crect fill='%23333' width='120' height='165'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23666' font-size='40'%3E📺%3C/text%3E%3C/svg%3E";

// ========================================
// FUNCIONES DE UI
// ========================================

function showLoading(message = 'Cargando contenido...') {
    if (document.getElementById('loadingIndicator')) return;

    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loadingIndicator';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 30px;
        border-radius: 15px;
        z-index: 9999;
        text-align: center;
        min-width: 300px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    `;
    loadingDiv.innerHTML = `
        <div class="spinner-border text-primary mb-3" role="status"></div>
        <div id="loadingMessage">${message}</div>
        <div id="loadingProgress" style="margin-top: 10px; font-size: 0.9em; color: #aaa;"></div>
    `;
    document.body.appendChild(loadingDiv);
}

function updateLoadingProgress(message) {
    const progressDiv = document.getElementById('loadingProgress');
    if (progressDiv) {
        progressDiv.textContent = message;
    }
}

function hideLoading() {
    const loadingDiv = document.getElementById('loadingIndicator');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function showError(message) {
    hideLoading();
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
        max-width: 500px;
    `;
    alertDiv.innerHTML = `
        <strong>❌ Error:</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
}

// ========================================
// RENDERIZADO DE CONTENIDO
// ========================================

function renderMovies() {
    peliculasGrid.innerHTML = '';
    
    if (peliculas.length === 0) {
        emptyMovies.style.display = 'block';
        return;
    }

    emptyMovies.style.display = 'none';
    
    peliculas.forEach(movie => {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
            <div class="card bg-dark text-white h-100 border-secondary">
                <img src="${movie.image || MOVIE_PLACEHOLDER}" 
                     class="card-img-top" 
                     alt="${movie.title}"
                     loading="lazy"
                     onerror="this.src='${MOVIE_PLACEHOLDER}'">
                <div class="card-body p-2">
                    <a href="${movie.url}" 
                       target="_blank" 
                       class="btn btn-sm btn-outline-primary w-100 text-start text-truncate"
                       title="${movie.title}">
                        ${movie.title}
                    </a>
                </div>
            </div>
        `;
        peliculasGrid.appendChild(col);
    });

    moviesCount.textContent = peliculas.length;
}

function renderSeries() {
    seriesGrid.innerHTML = '';
    
    if (series.length === 0) {
        emptySeries.style.display = 'block';
        return;
    }

    emptySeries.style.display = 'none';
    
    series.forEach(serie => {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
            <div class="card bg-dark text-white h-100 border-secondary">
                <img src="${serie.image || SERIES_PLACEHOLDER}" 
                     class="card-img-top" 
                     alt="${serie.title}"
                     loading="lazy"
                     onerror="this.src='${SERIES_PLACEHOLDER}'">
                <div class="card-body p-2">
                    <a href="${serie.url}" 
                       target="_blank" 
                       class="btn btn-sm btn-outline-primary w-100 text-start text-truncate"
                       title="${serie.title}">
                        ${serie.title}
                    </a>
                </div>
            </div>
        `;
        seriesGrid.appendChild(col);
    });

    seriesCount.textContent = series.length;
}

// ========================================
// BÚSQUEDA LOCAL
// ========================================

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const activeTab = document.querySelector('.tab-pane.active');
    
    if (!activeTab) return;

    const cards = activeTab.querySelectorAll('.col');
    let visibleCount = 0;

    cards.forEach(card => {
        const title = card.querySelector('.btn').textContent.toLowerCase();
        if (!searchTerm || title.includes(searchTerm)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Actualizar contador del tab activo
    const badge = document.querySelector('.nav-link.active .badge');
    if (badge) {
        const originalCount = activeTab.id === 'peliculas-section' ? peliculas.length : series.length;
        badge.textContent = searchTerm ? visibleCount : originalCount;
    }
}

// ========================================
// CARGA DE DATOS (100% Cliente)
// ========================================

async function reloadData() {
    if (isLoading) return;

    isLoading = true;
    showLoading('Cargando contenido...');

    try {
        const result = await window.DonTorrentScraper.scrapeAllContent();

        if (!result.success) {
            throw new Error(result.error || 'Error al cargar contenido');
        }

        peliculas = result.movies || [];
        series = result.series || [];

        renderMovies();
        renderSeries();
        hideLoading();

    } catch (error) {
        console.error('❌ Error:', error.message);
        showError(error.message || 'Error al cargar contenido');
    } finally {
        isLoading = false;
    }
}

// ✨ FUNCIÓN DE BÚSQUEDA EN DONTORRENT
// ========================================

function searchInDonTorrent() {
    const query = searchInput.value.trim();
    if (!query) {
        alert('Escribe algo en el buscador primero');
        return;
    }
    
    // Obtener la URL de DonTorrent del storage local
    const donTorrentUrl = localStorage.getItem('donTorrentUrl') || 'https://dontorrent.prof';
    
    // Crear formulario temporal para hacer POST
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `${donTorrentUrl}/buscar`;
    form.target = '_blank';
    
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'valor';
    input.value = query;
    
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Configurar búsqueda
    searchInput.addEventListener('input', function() {
        performSearch();
        
        if (this.value.length > 0) {
            searchClear.classList.remove('d-none');
        } else {
            searchClear.classList.add('d-none');
        }
    });

    // Botón limpiar búsqueda
    searchClear.addEventListener('click', function() {
        searchInput.value = '';
        searchClear.classList.add('d-none');
        performSearch();
    });

    // Atajos de teclado
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        if (e.key === 'Escape' && searchInput.value) {
            searchInput.value = '';
            searchClear.classList.add('d-none');
            performSearch();
        }
        // Enter para buscar en DonTorrent
        if (e.key === 'Enter' && searchInput.value && document.activeElement === searchInput) {
            searchInDonTorrent();
        }
    });

    // Actualizar búsqueda al cambiar de tab
    document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
        tab.addEventListener('shown.bs.tab', performSearch);
    });
    
    // ✨ CARGAR AUTOMÁTICAMENTE AL INICIO
    reloadData();
});
