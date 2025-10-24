 // Leaflet map setup for listing show page. Initialize after window load so
  // the layout's Leaflet script has been parsed. Retry a couple of times if
  // Leaflet isn't immediately available.
  (function () {
    const mapEl = document.getElementById('listing-map');
    if (!mapEl) return;
    const address = mapEl.dataset.address || '';
    const titleData = mapEl.dataset.title ? JSON.parse(mapEl.dataset.title) : '';
    const latAttr = mapEl.dataset.lat;
    const lonAttr = mapEl.dataset.lon;
    const initMap = (lat, lon) => {
      const map = L.map('listing-map').setView([lat, lon], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      const marker = L.marker([lat, lon]).addTo(map);
      marker.bindPopup(`<strong>${titleData}</strong><br/>${address}`).openPopup();
    };

    const tryInit = () => {
      if (typeof L === 'undefined') return false;
      if (latAttr && lonAttr) {
        initMap(parseFloat(latAttr), parseFloat(lonAttr));
      } else if (address) {
        const url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(address);
        fetch(url)
          .then(res => res.json())
          .then(data => {
            if (!data || data.length === 0) return;
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            initMap(lat, lon);
          })
          .catch(err => console.warn('Map geocode failed', err));
      }
      return true;
    };

    const onLoadInit = () => {
      // try immediately
      if (tryInit()) return;
      // otherwise retry a few times (Leaflet script might still be loading)
      let attempts = 0;
      const interval = setInterval(() => {
        attempts += 1;
        if (tryInit() || attempts >= 6) {
          clearInterval(interval);
          if (attempts >= 6) console.warn('Leaflet not available after retries; map will not render');
        }
      }, 300);
    };

    if (document.readyState === 'complete') onLoadInit();
    else window.addEventListener('load', onLoadInit);
  })();