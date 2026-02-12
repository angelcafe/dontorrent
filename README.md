# 🎬 DonTorrent Browser

Una aplicación web progresiva (PWA) moderna para explorar el catálogo de películas y series de DonTorrent. Soporta dos backends intercambiables (API PHP y API .NET) para scraping eficiente, con un frontend JavaScript moderno.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)
![PHP](https://img.shields.io/badge/Backend-PHP-777BB4.svg)
![.NET](https://img.shields.io/badge/Backend-.NET-777BB4.svg)
![JavaScript](https://img.shields.io/badge/Frontend-JavaScript-yellow.svg)

## 🌐 Aplicación en Vivo

**[🚀 Usar la aplicación](https://angelcastro.es/dontorrent)**

Accede a la aplicación completa y funcional sin necesidad de instalación local.

## ✨ Características

- 🎥 **Exploración de Películas y Series**: Navega por el catálogo de DonTorrent
- 🔍 **Búsqueda en Tiempo Real**: Filtra el contenido cargado de forma instantánea con atajos de teclado (`Ctrl+K`, `Esc`)
- 📱 **Progressive Web App**: Instala como aplicación nativa en cualquier dispositivo
- 🔄 **Doble Backend (PHP / .NET)**: Selector integrado para alternar entre la API PHP y la API .NET, con persistencia en `localStorage`
- 🎨 **Interfaz Moderna**: Diseño responsive con Bootstrap 5.3
- 💾 **Service Worker Cache**: Caché de recursos estáticos (network-first para local, cache-first para CDN)
- 🔒 **Sin CORS**: El scraping se hace en el servidor, sin restricciones en el cliente
- 🌙 **Tema Oscuro**: Diseño elegante y cómodo para la vista
- 🧩 **Plantillas HTML**: Sistema de `<template>` para cards, indicador de carga y alertas de error

## 🚀 Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica con sistema de `<template>` para renderizado dinámico
- **CSS3**: Estilos modernos con Bootstrap 5.3.8
- **JavaScript (ES6+)**: Lógica de aplicación, cliente API con clases y `async/await`
- **Service Worker**: Cache de recursos locales y CDN (`dontorrent-v4`, `dontorrent-cdn-v1`)
- **Web Manifest**: Configuración PWA con iconos en 8 tamaños
- **Fetch API**: Comunicación con los backends
- **localStorage**: Persistencia de la selección de API (PHP / .NET)

### Backend (APIs externas, no incluidas en este repositorio)
- **API PHP**: `https://acf.alwaysdata.net/api`
- **API .NET**: `https://acf-api.runasp.net/api`

## 📁 Estructura del Proyecto

```
dontorrent/
├── index.html           # Página principal (Bootstrap 5.3.8, tema oscuro)
├── manifest.json        # Configuración PWA (8 tamaños de icono)
├── sw.js               # Service Worker (cache local + CDN)
├── front/
│   ├── app.js          # Lógica principal: renderizado, búsqueda, carga de datos
│   ├── api-client.js   # Cliente API: soporte dual PHP/.NET, switch, clase DonTorrentApiClient
│   └── icons/          # Iconos de la PWA (72x72 a 512x512)
├── README.md           # Este archivo
└── LICENSE             # Licencia del proyecto
```

## 🛠️ Instalación y Uso

### Opción 1: Usar la Aplicación en Línea

La forma más rápida de usar la aplicación es accediendo directamente a:

**[https://angelcastro.es/dontorrent](https://angelcastro.es/dontorrent)**

No requiere instalación, funciona directamente desde el navegador y puedes instalarla como PWA.

### Opción 2: Deploy Local

#### Requisitos Previos

- **Backend**: Acceso a las APIs externas (PHP y/o .NET) ya desplegadas, o tu propio backend
- **Frontend**: Servidor web para archivos estáticos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

#### Paso 1: Configurar el Frontend

Edita las constantes en `front/api-client.js` para apuntar a tus servidores:

```javascript
const PHP_API_URL = 'https://acf.alwaysdata.net/api';  // URL de tu API PHP
const NET_API_URL = 'https://acf-api.runasp.net/api';  // URL de tu API .NET
```

#### Paso 2: Servir el Frontend

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server -p 8000

# Con PHP
php -S localhost:8000
```

Luego abre `http://localhost:8000` en tu navegador.

### Opción 3: GitHub Pages o Netlify

1. Sube el proyecto a un repositorio de GitHub
2. Configura la URL de la API en `front/api-client.js`
3. Despliega en GitHub Pages, Netlify o Vercel
4. **Importante**: Asegúrate de que tu API tenga CORS configurado correctamente

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
- **Atajos de Teclado**:
  - `Ctrl+K`: Enfocar barra de búsqueda
  - `Esc`: Limpiar búsqueda

### Navegación

- **Pestañas**: Alterna entre películas y series
- **Contadores**: Muestra el número de elementos cargados
- **Grid Responsive**: Se adapta a cualquier tamaño de pantalla

### API Switch

- **Toggle PHP / .NET**: Alterna entre las dos APIs disponibles desde la cabecera
- **Persistencia**: La selección se guarda en `localStorage` y se restaura al recargar
- **Recarga automática**: Al cambiar de API se refresca el contenido

## 🔧 Configuración

### URLs de las APIs

Edita las constantes al inicio de `front/api-client.js`:

```javascript
const PHP_API_URL = 'https://acf.alwaysdata.net/api';
const NET_API_URL = 'https://acf-api.runasp.net/api';
```

Los endpoints utilizados son:

| Endpoint | Descripción |
|---|---|
| `/dontorrent/movies` | Obtiene el listado de películas |
| `/dontorrent/series` | Obtiene el listado de series |

### Service Worker

El Service Worker (`sw.js`) gestiona dos cachés:

- **`dontorrent-v4`**: Recursos locales (HTML, JS, iconos, manifest) — estrategia *network-first*
- **`dontorrent-cdn-v1`**: Recursos CDN (Bootstrap CSS/JS) — estrategia *cache-first*

## 🌐 Cómo Funciona

1. **Carga**: La aplicación web carga en el navegador (Service Worker cachea recursos estáticos)
2. **Selección de API**: Se utiliza la API seleccionada (PHP o .NET) según la preferencia guardada en `localStorage`
3. **Petición paralela**: El cliente lanza `getMovies()` y `getSeries()` en paralelo con `Promise.all`
4. **Scraping (servidor)**: El backend realiza el scraping de DonTorrent y devuelve JSON
5. **Normalización**: `DonTorrentApiClient` normaliza la respuesta independientemente del formato del backend
6. **Renderizado**: Se renderizan las tarjetas usando `<template>` HTML con carga lazy de imágenes
7. **Búsqueda**: Filtra los resultados en tiempo real ocultando/mostrando tarjetas en el DOM

## ⚠️ Consideraciones

- Esta aplicación es solo para fines educativos
- Depende de APIs externas (PHP y/o .NET) para funcionar
- Respeta los términos de servicio del sitio original
- El scraping puede fallar si la estructura HTML del sitio cambia
- La disponibilidad depende de las APIs backend

## 🐛 Solución de Problemas

### El contenido no carga

- Prueba a cambiar de API con el toggle PHP/.NET en la cabecera
- Verifica las URLs de las APIs en `front/api-client.js`
- Revisa la consola del navegador para errores de red o CORS
- Comprueba tu conexión a internet

### Error de CORS

- Asegúrate de que la API backend tenga tu dominio en su lista de orígenes permitidos
- Verifica que la API responda correctamente a peticiones OPTIONS (preflight)

### La API responde lento

- El scraping puede tardar unos segundos la primera vez
- Los backends suelen cachear los resultados para peticiones siguientes

### La PWA no se instala

- Asegúrate de servir la app mediante HTTPS o localhost
- Verifica que el Service Worker esté registrado correctamente
- Revisa que el manifest.json sea válido

### Las imágenes no se muestran

- Puede ser un problema de CORS con las imágenes desde DonTorrent
- Los placeholders SVG se mostrarán como alternativa

## 📚 Documentación Adicional

- **Endpoints utilizados**: `/dontorrent/movies`, `/dontorrent/series`
- **API PHP**: `https://acf.alwaysdata.net/api`
- **API .NET**: `https://acf-api.runasp.net/api`

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

- Bootstrap 5.3.8 por el framework CSS (vía jsDelivr CDN)
- Comunidad de desarrolladores JavaScript

---

💜 **Hecho con pasión por Ángel Castro** - Frontend JavaScript + Backend PHP/.NET

⭐ Si te gusta este proyecto, considera darle una estrella en GitHub!
