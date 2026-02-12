let peliculas = [], series = [], isLoading = false;

const $ = id => document.getElementById(id);
const [searchInput, searchClear, moviesCount, seriesCount, peliculasGrid, seriesGrid, emptyMovies, emptySeries] = 
    ['searchInput', 'searchClear', 'moviesCount', 'seriesCount', 'peliculas-grid', 'series-grid', 'empty-movies', 'empty-series'].map($);

const MOVIE_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='165'%3E%3Crect fill='%23333' width='120' height='165'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23666' font-size='40'%3E🎬%3C/text%3E%3C/svg%3E";
const SERIES_PLACEHOLDER = MOVIE_PLACEHOLDER.replace('🎬', '📺');

const templates = {
    card: $('card-template'),
    loading: $('loading-template'),
    error: $('error-template')
};

function showLoading(message = 'Cargando contenido...') {
    if ($('loadingIndicator')) return;
    const div = templates.loading.content.cloneNode(true);
    div.querySelector('.loading-text').textContent = message;
    document.body.appendChild(div);
}

function hideLoading() { $('loadingIndicator')?.remove(); }

function showError(message) {
    hideLoading();
    const div = templates.error.content.cloneNode(true);
    div.querySelector('.error-text').textContent = message;
    document.body.appendChild(div);
    setTimeout(() => document.querySelector('.alert')?.remove(), 5000);
}

function renderContent(items, grid, empty, placeholder, counter) {
    grid.innerHTML = '';
    if (items.length === 0) return empty.style.display = 'block';
    
    empty.style.display = 'none';
    items.forEach(item => {
        const col = templates.card.content.cloneNode(true);
        const img = col.querySelector('img');
        const link = col.querySelector('a');
        
        img.src = item.image || placeholder;
        img.alt = item.title;
        img.onerror = () => img.src = placeholder;
        link.href = item.url;
        link.title = item.title;
        link.textContent = item.title;
        
        grid.appendChild(col);
    });
    counter.textContent = items.length;
}

function renderMovies() { renderContent(peliculas, peliculasGrid, emptyMovies, MOVIE_PLACEHOLDER, moviesCount); }
function renderSeries() { renderContent(series, seriesGrid, emptySeries, SERIES_PLACEHOLDER, seriesCount); }

function performSearch() {
    const term = searchInput.value.toLowerCase().trim();
    const activeTab = document.querySelector('.tab-pane.active');
    if (!activeTab) return;

    let visible = 0;
    activeTab.querySelectorAll('.col').forEach(card => {
        const match = !term || card.querySelector('.btn').textContent.toLowerCase().includes(term);
        card.style.display = match ? 'block' : 'none';
        if (match) visible++;
    });

    const badge = document.querySelector('.nav-link.active .badge');
    if (badge) badge.textContent = term ? visible : (activeTab.id === 'peliculas-section' ? peliculas.length : series.length);
}

async function reloadData() {
    if (isLoading) return;
    isLoading = true;
    showLoading();

    try {
        const result = await window.DonTorrentApiClient.scrapeAllContent();
        if (!result.success) throw new Error(result.error || 'Error al cargar');
        
        peliculas = result.movies || [];
        series = result.series || [];
        renderMovies();
        renderSeries();
        hideLoading();
    } catch (error) {
        console.error('❌', error.message);
        showError(error.message || 'Error al cargar');
    } finally {
        isLoading = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    searchInput.addEventListener('input', function() {
        performSearch();
        searchClear.classList.toggle('d-none', !this.value.length);
    });

    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.classList.add('d-none');
        performSearch();
    });

    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 'k') return e.preventDefault(), searchInput.focus();
        if (e.key === 'Escape' && searchInput.value) {
            searchInput.value = '';
            searchClear.classList.add('d-none');
            performSearch();
        }
    });

    document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => 
        tab.addEventListener('shown.bs.tab', performSearch)
    );
    
    window.reloadData = reloadData;
    reloadData();
});
