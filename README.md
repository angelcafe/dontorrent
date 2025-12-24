# 🎬 DonTorrent Browser

Una aplicación web progresiva (PWA) moderna para explorar el catálogo de películas y series de DonTorrent. Desarrollada 100% con JavaScript del lado del cliente, sin necesidad de backend.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-100%25-yellow.svg)

## 🌐 Aplicación en Vivo

**[🚀 Usar la aplicación](https://angelcastro.es/dontorrent)**

Accede a la aplicación completa y funcional sin necesidad de instalación local.

## ✨ Características

- 🎥 **Exploración de Películas y Series**: Navega por el catálogo completo de DonTorrent
- 🔍 **Búsqueda en Tiempo Real**: Busca en el contenido cargado de forma instantánea
- 📱 **Progressive Web App**: Instala como aplicación nativa en cualquier dispositivo
- 🌐 **100% JavaScript**: No requiere servidor backend ni PHP
- 🎨 **Interfaz Moderna**: Diseño responsive con Bootstrap 5
- 💾 **Scraping del Cliente**: Obtención de datos directamente desde el navegador
- 🔄 **CORS Proxy Fallback**: Sistema inteligente de proxies para evitar restricciones
- ⚡ **Rápida y Eficiente**: Carga y renderizado optimizado de contenido
- 🌙 **Tema Oscuro**: Diseño elegante y cómodo para la vista

## 🚀 Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con Bootstrap 5.3
- **JavaScript (ES6+)**: Lógica de aplicación y scraping
- **Service Worker**: Funcionalidad PWA
- **Web Manifest**: Configuración de instalación
- **Fetch API**: Obtención de datos asíncrona
- **DOM API**: Manipulación dinámica del contenido
- **LocalStorage**: Almacenamiento de datos locales

## 📁 Estructura del Proyecto

```
dontorrent/
├── index.html           # Página principal
├── manifest.json        # Configuración PWA
├── sw.js               # Service Worker
├── front/
│   ├── app.js          # Lógica principal de la aplicación
│   ├── scraper.js      # Funciones de scraping
│   └── icons/          # Iconos de la PWA en múltiples tamaños
├── README.md           # Este archivo
└── LICENSE             # Licencia del proyecto
```

## 🛠️ Instalación y Uso

### Opción 1: Usar la Aplicación en Línea

La forma más rápida de usar la aplicación es accediendo directamente a:

**[https://angelcastro.es/dontorrent](https://angelcastro.es/dontorrent)**

No requiere instalación, funciona directamente desde el navegador y puedes instalarla como PWA.

### Opción 2: Servidor Web Local

#### Requisitos Previos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (para probar la PWA)

```bash
# Con Python 3
python -m http.server 8000

# Con Python 2
python -m SimpleHTTPServer 8000

# Con Node.js (http-server)
npx http-server -p 8000

# Con PHP
php -S localhost:8000
```

Luego abre `http://localhost:8000` en tu navegador.

### Opción 3: Live Server (VS Code)

1. Instala la extensión "Live Server" en VS Code
2. Haz clic derecho en `index.html`
3. Selecciona "Open with Live Server"

### Opción 4: GitHub Pages

1. Sube el proyecto a un repositorio de GitHub
2. Ve a Settings → Pages
3. Selecciona la rama main como fuente
4. Accede a tu sitio en `https://tuusuario.github.io/dontorrent`

## 📱 Instalación como PWA

### En Android:

1. Abre la aplicación en Chrome
2. Toca el menú (⋮)
3. Selecciona "Agregar a pantalla de inicio"
4. Confirma la instalación

### En iOS:

1. Abre la aplicación en Safari
2. Toca el botón de compartir
3. Selecciona "Añadir a pantalla de inicio"
4. Confirma la instalación

### En Escritorio:

1. Abre la aplicación en Chrome/Edge
2. Haz clic en el icono de instalación en la barra de direcciones
3. Confirma la instalación

## 🎯 Funcionalidades

### Búsqueda

- **Búsqueda Local**: Filtra el contenido cargado en tiempo real
- **Búsqueda en DonTorrent**: Abre una búsqueda directa en el sitio original
- **Atajos de Teclado**:
  - `Ctrl+K`: Enfocar barra de búsqueda
  - `Enter`: Buscar en DonTorrent
  - `Esc`: Limpiar búsqueda

### Navegación

- **Pestañas**: Alterna entre películas y series
- **Contadores**: Muestra el número de elementos cargados
- **Grid Responsive**: Se adapta a cualquier tamaño de pantalla

### Scraping Inteligente

- Detección automática de la URL actual de DonTorrent vía Telegram
- Sistema de fallback con múltiples proxies CORS
- Manejo robusto de errores y timeouts
- Extracción de imágenes, títulos y enlaces

## 🔧 Configuración

### Proxies CORS

El archivo `scraper.js` incluye una lista de proxies CORS:

```javascript
const CORS_PROXIES = [
    '',
    'https://corsproxy.io/?',
    'https://api.allorigins.win/raw?url='
];
```

Puedes agregar o modificar proxies según tus necesidades.

### Service Worker

El Service Worker está configurado para cachear recursos estáticos. Puedes modificar la estrategia de caché en `sw.js`.

## 🌐 Cómo Funciona

1. **Detección de URL**: La app consulta el canal de Telegram de DonTorrent para obtener la URL actual
2. **Scraping**: Realiza peticiones HTTP a través de proxies CORS para obtener el HTML
3. **Parsing**: Extrae información de películas y series usando expresiones regulares
4. **Renderizado**: Muestra el contenido en una interfaz responsive
5. **Búsqueda**: Filtra los resultados en tiempo real mientras escribes

## ⚠️ Consideraciones

- Esta aplicación es solo para fines educativos
- Respeta los términos de servicio del sitio original
- El scraping puede fallar si la estructura HTML cambia
- Algunos proxies CORS pueden tener límites de uso
- La disponibilidad depende de servicios de terceros

## 🐛 Solución de Problemas

### El contenido no carga

- Verifica tu conexión a internet
- Comprueba la consola del navegador para errores
- Intenta con otro navegador
- Los proxies CORS pueden estar temporalmente inactivos

### La PWA no se instala

- Asegúrate de servir la app mediante HTTPS o localhost
- Verifica que el Service Worker esté registrado correctamente
- Revisa que el manifest.json sea válido

### Las imágenes no se muestran

- Puede ser un problema de CORS con las imágenes
- Los placeholders SVG se mostrarán como alternativa

## 📝 Roadmap

- [ ] Agregar filtros por género y año
- [ ] Implementar paginación infinita
- [ ] Añadir modo offline completo
- [ ] Mejorar el sistema de caché
- [ ] Agregar detalles de películas/series
- [ ] Implementar favoritos
- [ ] Añadir historial de visualización
- [ ] Modo de vista en lista

## 👨‍💻 Autor

**Ángel Miguel Castro Fernández**

- Email: [angelcafn@gmail.com](mailto:angelcafn@gmail.com)
- Web: [https://angelcastro.es](https://angelcastro.es)

## 📜 Licencia

Copyright © 2025 Ángel Miguel Castro Fernández. Todos los derechos reservados.

Este código es propietario y confidencial. No está permitido copiar, modificar, distribuir o usar este código sin el permiso explícito por escrito del autor. Para solicitudes de licencia, contacta a [angelcafn@gmail.com](mailto:angelcafn@gmail.com).

Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- Bootstrap por el framework CSS
- Google Fonts por la tipografía Inter
- Comunidad de desarrolladores JavaScript

---

💜 **Hecho con pasión por Ángel Castro** - 100% JavaScript, sin PHP

⭐ Si te gusta este proyecto, considera darle una estrella en GitHub!
