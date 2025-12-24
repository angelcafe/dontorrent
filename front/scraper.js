// Scraper del lado del cliente

const CORS_PROXIES = [
    '',
    'https://corsproxy.io/?',
    'https://api.allorigins.win/raw?url='
];

let currentProxyIndex = 0;

async function fetchWithCORS(url) {
    for (let i = 0; i < CORS_PROXIES.length; i++) {
        const proxyIndex = (currentProxyIndex + i) % CORS_PROXIES.length;
        const proxy = CORS_PROXIES[proxyIndex];
        const finalUrl = proxy ? proxy + encodeURIComponent(url) : url;
        
        try {
            const response = await fetch(finalUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'User-Agent': navigator.userAgent
                },
                cache: 'no-cache'
            });
            
            if (response.ok) {
                currentProxyIndex = proxyIndex;
                const html = await response.text();
                
                if (html.includes('Cloudflare') && html.includes('Access denied')) {
                    continue;
                }
                
                return html;
            } else {
                continue;
            }
        } catch (error) {
            continue;
        }
    }
    
    throw new Error('No se pudo conectar con DonTorrent');
}

async function getDonTorrentURL() {
    const telegramUrl = 'https://t.me/s/DonTorrent';
    
    try {
        const html = await fetchWithCORS(telegramUrl);
        
        if (!html || html.trim() === '') {
            return null;
        }
        
        const regex = /https?:\/\/dontorrent\.[a-z0-9.-]+/gi;
        const matches = html.match(regex);
        
        if (matches && matches.length > 0) {
            const url = matches[matches.length - 1];
            return url.replace(/\/$/, '');
        } else {
            return null;
        }
    } catch (error) {
        console.error('❌ Error obteniendo URL:', error.message);
        return null;
    }
}

function extractMovies(html, baseUrl) {
    const movies = [];
    const regex = /<a[^>]*href=["'](\/pelicula\/\d+\/([^"']+))["'][^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["']/gi;
    
    let match;
    while ((match = regex.exec(html)) !== null) {
        const url = baseUrl + match[1];
        const slug = match[2];
        const image = match[3].startsWith('//') ? 'https:' + match[3] : match[3];
        const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        movies.push({ url, title, image });
    }
    
    return movies;
}

function extractSeries(html, baseUrl) {
    const series = [];
    const regex = /<a[^>]*href=["'](\/serie\/\d+\/\d+\/([^"']+))["'][^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["']/gi;
    
    let match;
    while ((match = regex.exec(html)) !== null) {
        const url = baseUrl + match[1];
        const slug = match[2];
        const image = match[3].startsWith('//') ? 'https:' + match[3] : match[3];
        const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        series.push({ url, title, image });
    }
    
    return series;
}

async function scrapePage(baseUrl, pageNum = 1) {
    const url = pageNum > 1 ? `${baseUrl}/page/${pageNum}` : baseUrl;
    
    try {
        const html = await fetchWithCORS(url);
        const movies = extractMovies(html, baseUrl);
        const series = extractSeries(html, baseUrl);
        
        return {
            success: true,
            page: pageNum,
            movies: movies,
            series: series
        };
    } catch (error) {
        return {
            success: false,
            page: pageNum,
            error: error.message
        };
    }
}

async function scrapeAllContent() {
    try {
        const donTorrentUrl = await getDonTorrentURL();
        
        if (!donTorrentUrl) {
            throw new Error('No se pudo obtener la URL de DonTorrent');
        }
        
        // Guardar la URL para usar en búsquedas
        localStorage.setItem('donTorrentUrl', donTorrentUrl);
        
        const allMovies = [];
        const allSeries = [];
        const TOTAL_PAGES = 10;
        
        for (let page = 1; page <= TOTAL_PAGES; page++) {
            const result = await scrapePage(donTorrentUrl, page);
            
            if (result.success) {
                allMovies.push(...result.movies);
                allSeries.push(...result.series);
            }
        }
        
        // Eliminar duplicados por URL
        const uniqueMovies = Array.from(new Map(allMovies.map(m => [m.url, m])).values());
        const uniqueSeries = Array.from(new Map(allSeries.map(s => [s.url, s])).values());
        
        return {
            success: true,
            movies: uniqueMovies,
            series: uniqueSeries
        };
    } catch (error) {
        console.error('❌ Error:', error.message);
        return {
            success: false,
            error: error.message,
            movies: [],
            series: []
        };
    }
}

window.DonTorrentScraper = {
    getDonTorrentURL,
    scrapePage,
    fetchWithCORS,
    scrapeAllContent
};
