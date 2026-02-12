const PHP_API_URL = 'https://acf.alwaysdata.net/api';
const NET_API_URL = 'https://acf-api.runasp.net/api';

const API_CONFIG = {
    baseUrl: localStorage.getItem('selectedApi') || PHP_API_URL,
    endpoints: { getMovies: '/dontorrent/movies', getSeries: '/dontorrent/series' }
};

async function switchApi(useDotNet) {
    const newUrl = useDotNet ? NET_API_URL : PHP_API_URL;
    API_CONFIG.baseUrl = newUrl;
    localStorage.setItem('selectedApi', newUrl);
    
    const [phpLabel, netLabel] = ['phpLabel', 'netLabel'].map(id => document.getElementById(id));
    if (phpLabel && netLabel) {
        phpLabel.classList.toggle('text-white', !useDotNet);
        phpLabel.classList.toggle('text-secondary', useDotNet);
        netLabel.classList.toggle('text-white', useDotNet);
        netLabel.classList.toggle('text-secondary', !useDotNet);
    }
    
    window.reloadData?.();
}

function initApiSwitch() {
    const apiSwitch = document.getElementById('apiSwitch');
    if (!apiSwitch) return;
    
    const useDotNet = localStorage.getItem('selectedApi') === NET_API_URL;
    apiSwitch.checked = useDotNet;
    
    const [phpLabel, netLabel] = ['phpLabel', 'netLabel'].map(id => document.getElementById(id));
    if (useDotNet) {
        netLabel?.classList.replace('text-secondary', 'text-white');
    } else {
        phpLabel?.classList.replace('text-secondary', 'text-white');
    }
    
    apiSwitch.addEventListener('change', e => switchApi(e.target.checked));
}

(document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initApiSwitch) : initApiSwitch());

class DonTorrentApiClient {
    constructor(config = API_CONFIG) { this.config = config; }

    async get(endpoint, params = {}) {
        const url = new URL(this.config.baseUrl + endpoint);
        Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.append(k, v));

        const response = await fetch(url, {
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.mensaje || `Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        if (!data.success) throw new Error(data.mensaje || 'Error en la API');
        return data.data;
    }

    async getMovies() { return this.get(this.config.endpoints.getMovies); }
    async getSeries() { return this.get(this.config.endpoints.getSeries); }

    async scrapeAllContent() {
        try {
            const [movies, series] = await Promise.all([this.getMovies(), this.getSeries()])
                .then(r => r.map((d, i) => this.normalizeContentList(d, i === 0 ? 'movies' : 'series')));
            return { success: true, movies: movies || [], series: series || [] };
        } catch (error) {
            console.error('❌ Error:', error.message);
            return { success: false, error: error.message, movies: [], series: [] };
        }
    }

    normalizeContentList(payload, type) {
        if (Array.isArray(payload)) return payload;
        if (!payload || typeof payload !== 'object') return [];
        return payload[type] || payload.data || payload.items || [];
    }
}

window.DonTorrentApiClient = new DonTorrentApiClient();
window.switchApi = switchApi;
