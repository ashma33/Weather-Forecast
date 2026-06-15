// ============ Stars Dynamic Building Engine ============
const container = document.getElementById('stars');
if (container) {
    for (let i = 0; i < 80; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        const size = Math.random() * 2 + 1;
        
        s.style.width = `${size}px`;
        s.style.height = `${size}px`;
        s.style.top = `${Math.random() * 100}%`;
        s.style.left = `${Math.random() * 100}%`;
        s.style.setProperty('--dur', `${2 + Math.random() * 4}s`);
        s.style.setProperty('--delay', `-${Math.random() * 4}s`);
        
        container.appendChild(s);
    }
}

// ============ Live Clock ============
function updateTime() {
    const now = new Date();
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    
    const dayEl = document.getElementById('live-day');
    const dateEl = document.getElementById('live-date');
    const timeEl = document.getElementById('live-time');

    if (dayEl) dayEl.textContent = days[now.getDay()];
    if (dateEl) dateEl.textContent = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    
    let h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    
    if (timeEl) {
        timeEl.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} ${ampm}`;
    }
}
updateTime();
setInterval(updateTime, 1000);

// ============ Search Flow Actions ============
function goSearch() {
    // Looks for 'cityInput' or falls back to 'searchInput' to prevent errors
    const inputElement = document.getElementById('cityInput') || document.getElementById('searchInput');
    const err = document.getElementById('errorMsg');
    
    if (!inputElement) {
        console.error("Could not find the search input element in your HTML!");
        return;
    }

    const city = inputElement.value.trim();
    
    if (!city) { 
        if (err) err.style.display = 'block'; 
        return; 
    }
    if (err) err.style.display = 'none';
    
    // REDIRECT ACTION: Opens weather.html and securely appends your searched city 
    window.location.href = `weather.html?city=${encodeURIComponent(city)}`;
}

function quickSearch(city) {
    const inputElement = document.getElementById('cityInput') || document.getElementById('searchInput');
    if (inputElement) {
        inputElement.value = city;
        goSearch();
    }
}

// ============ Event Listeners Linker ============
// This binds your index.html markup layout directly to your script logic automatically
window.addEventListener('load', () => {
    const searchBtn = document.getElementById('searchBtn');
    const inputElement = document.getElementById('cityInput') || document.getElementById('searchInput');

    if (searchBtn) {
        searchBtn.addEventListener('click', goSearch);
    }
    if (inputElement) {
        inputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                goSearch();
            }
        });
    }
});






