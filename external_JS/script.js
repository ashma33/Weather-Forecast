// ============ API CONFIGURATION ============
const API_KEY = 'ba2e6f893e4e4d4e2d6d1cd54a5bc731';
const API_CONFIG = {
    weatherApi: 'https://api.openweathermap.org/data/2.5/weather',
    forecastApi: 'https://api.openweathermap.org/data/2.5/forecast'
};

// ============ STATE MANAGEMENT ============
let currentWeather = null;
let currentForecast = null; 
let currentCoords = { lat: null, lon: null };
let map = null;
let marker = null;
let isCelsius = true;
let isLoading = false;

// ============ DOM ELEMENTS ============
const elements = {
    // Landing Page Elements
    cityInput: document.getElementById('cityInput'),
    searchForm: document.getElementById('searchForm'),
    errorMsg: document.getElementById('errorMsg'),
    liveTime: document.getElementById('live-time'),
    liveDate: document.getElementById('live-date'),
    liveDay: document.getElementById('live-day'),

    // Weather Display Elements
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    currentLocationBtn: document.getElementById('currentLocationBtn'),
    tempToggleBtn: document.getElementById('tempToggleBtn'),
    tempUnitDisplay: document.getElementById('tempUnitDisplay'),
    displayUnit: document.getElementById('displayUnit'),
    cityName: document.getElementById('cityName'),
    weatherDate: document.getElementById('weatherDate'), 
    temperature: document.getElementById('temperature'),
    weatherIcon: document.getElementById('weatherIcon'),
    weatherDescription: document.getElementById('weatherDescription'),
    feelsLike: document.getElementById('feelsLike'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    visibility: document.getElementById('visibility'),
    pressure: document.getElementById('pressure'),
    windGustsDisplay: document.getElementById('windGustsDisplay'), 
    precipitation: document.getElementById('precipitation'),
    cloudCover: document.getElementById('cloudCover'),
    dewPoint: document.getElementById('dewPoint'),
    dewPointUnit: document.getElementById('dewPointUnit'),
    hourlyForecast: document.getElementById('hourlyForecast'),
    dailyForecast: document.getElementById('dailyForecast'),
    lifestyleTips: document.getElementById('lifestyleTips'),
    rainContainer: document.getElementById('rainContainer'),
    snowContainer: document.getElementById('snowContainer'),
    errorToast: document.getElementById('errorToast'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    alertsContainer: document.getElementById('alertsContainer'),
    alertsContent: document.getElementById('alertsContent'),
    animatedBg: document.querySelector('.animated-bg'),
    sunContainer: document.getElementById('sunContainer'),
mistContainer: document.getElementById('mistContainer'),
lightningContainer: document.getElementById('lightningContainer'),
cloudContainerEl: document.querySelector('.cloud-container'),
    bodyElement: document.body
    
};

// ============ LIVE DATETIME CLOCK ============
function updateLiveClock() {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    if (elements.liveDay) elements.liveDay.textContent = days[now.getDay()];
    if (elements.liveDate) elements.liveDate.textContent = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    if (elements.liveTime) elements.liveTime.textContent = `${hours}:${minutes} ${ampm}`;
}
updateLiveClock();
setInterval(updateLiveClock, 60000);

// ============ LIFESTYLE TIPS DATA ============
const lifestyleTipsData = [
    { icon: '☀️', text: 'Perfect day for outdoor activities and walks', weather: [800] },
    { icon: '🧴', text: 'UV levels are intense—apply sunscreen (SPF 30+)', weather: [800, 801] },
    { icon: '🕶️', text: 'Wear sunglasses to protect your eyes from glare', weather: [800, 801] },
    { icon: '👕', text: 'Opt for light, breathable cotton clothes today', weather: [800, 801, 802] },
    { icon: '🚴', text: 'Great conditions for an outdoor run or cycling session', weather: [800, 801] },
    { icon: '🌤️', text: 'Pleasant weather outside—enjoy a step out today', weather: [801, 802] },
    { icon: '📷', text: 'Great natural lighting conditions for photography', weather: [801, 802] },
    { icon: '🧺', text: 'Good laundry day—clothes will dry steadily', weather: [800, 801, 802] },
    { icon: '☁️', text: 'Overcast skies—expect reduced solar heating today', weather: [803, 804] },
    { icon: '☕', text: 'Cozy indoor weather—perfect for a warm beverage', weather: [803, 804, 500, 501] },
    { icon: '🦟', text: 'Expect high mosquito activity due to heavy humidity', weather: [803, 804, 500, 501, 520] },
    { icon: '🏃', text: 'Comfortable, cooler temperature for an outdoor jog', weather: [802, 803, 804] },
    { icon: '💡', text: 'Dim ambient daylight—you may need indoor lights on early', weather: [804] },
    { icon: '☂️', text: 'Drizzle or light rain—carry an umbrella or raincoat', weather: [500, 501, 520, 521, 300, 301, 302] },
    { icon: '🚗', text: 'Wet surfaces—skip the car wash today', weather: [500, 501, 502, 520, 200, 201, 202] },
    { icon: '👟', text: 'Slip-resistant footwear is recommended on pavement', weather: [500, 501, 502, 520, 600, 601] },
    { icon: '🍿', text: 'Excellent evening to stay inside and watch a movie', weather: [500, 501, 502, 200, 201] },
    { icon: '🌧️', text: 'Torrential downpour—expect structural pooling and leaks', weather: [502, 503, 504, 522] },
    { icon: '🌊', text: 'Minor street flooding likely—avoid low-lying roads', weather: [502, 503, 504, 522] },
    { icon: '🚘', text: 'Aquaplaning risk—drive slowly and keep your distance', weather: [502, 503, 504, 522, 611, 612] },
    { icon: '🏠', text: 'Reschedule non-essential outdoor travel plans if possible', weather: [502, 503, 504, 202, 212] },
    { icon: '⛈️', text: 'Severe lightning risk—stay clear of open fields or metal structures', weather: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232] },
    { icon: '🔌', text: 'Unplug sensitive electrical devices to shield from power surges', weather: [200, 201, 202, 211, 212, 221] },
    { icon: '📶', text: 'Atmospheric variance could cause minor internet or TV drops', weather: [211, 212, 221] },
    { icon: '❄️', text: 'Snow accumulation active—bundle up in layered clothing', weather: [600, 601, 602, 611, 612, 620, 621, 622] },
    { icon: '🧣', text: 'Protect your extremities—wear thick gloves and a scarf', weather: [600, 601, 602, 611] },
    { icon: '⛸️', text: 'Extremely icy paths—high risk of slips and falls', weather: [601, 602, 611, 612] },
    { icon: '🌫️', text: 'Dense fog or mist—severely compromised roadway visibility', weather: [701, 711, 721, 741] }
];

// ============ MAPPING LANDING SEARCHES ============
function goSearch() {
    if (!elements.cityInput) return;
    const cityName = elements.cityInput.value.trim();
    
    if (cityName === "") {
        if (elements.errorMsg) elements.errorMsg.style.display = 'block';
        return;
    }
    if (elements.errorMsg) elements.errorMsg.style.display = 'none';
    
    executeWeatherFetchOrRedirect(cityName);
}

// Handles quick chip tags
function quickSearch(cityName) {
    executeWeatherFetchOrRedirect(cityName);
}

function executeWeatherFetchOrRedirect(city) {
    if (!elements.cityName) {
        window.location.href = `weather.html?city=${encodeURIComponent(city)}`;
        return;
    }
    fetchWeatherData(city);
}

// ============ CORE DATA FETCHING MAPPING ============
async function fetchWeatherData(city) {
    toggleLoading(true);
    try {
        const weatherRes = await fetch(`${API_CONFIG.weatherApi}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
        if (!weatherRes.ok) throw new Error("City layout record not found.");
        currentWeather = await weatherRes.json();
        
        currentCoords.lat = currentWeather.coord.lat;
        currentCoords.lon = currentWeather.coord.lon;

        const forecastRes = await fetch(`${API_CONFIG.forecastApi}?lat=${currentCoords.lat}&lon=${currentCoords.lon}&appid=${API_KEY}&units=metric`);
        if (!forecastRes.ok) throw new Error("Forecast schedule failed.");
        currentForecast = await forecastRes.json();

        updateWeatherUI();
        updateMapLayout(currentCoords.lat, currentCoords.lon, currentWeather.name);
    } catch (err) {
        showToast(err.message);
    } finally {
        toggleLoading(false);
    }
}

// ============ CORE UI UPDATES ============
function updateWeatherUI() {
    if (!currentWeather) return;

    if (elements.cityName) elements.cityName.textContent = `${currentWeather.name}, ${currentWeather.sys.country}`;
    if (elements.weatherDescription) elements.weatherDescription.textContent = currentWeather.weather[0].description;
    
    if (elements.weatherIcon) {
        const iconCode = currentWeather.weather[0].icon;
        elements.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        elements.weatherIcon.alt = currentWeather.weather[0].description;
    }

    if (elements.weatherDate) {
        elements.weatherDate.textContent = new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
    }

    if (elements.humidity) elements.humidity.textContent = `${currentWeather.main.humidity}%`;
    if (elements.pressure) elements.pressure.textContent = `${currentWeather.main.pressure} hPa`;
    if (elements.visibility) elements.visibility.textContent = `${(currentWeather.visibility / 1000).toFixed(1)} km`;
    if (elements.cloudCover) elements.cloudCover.textContent = `${currentWeather.clouds.all}%`;
    
    if (elements.windSpeed) elements.windSpeed.textContent = `${currentWeather.wind.speed} m/s`;
    if (elements.windGustsDisplay) {
        elements.windGustsDisplay.textContent = currentWeather.wind.gust ? `${currentWeather.wind.gust} m/s` : '0 m/s';
    }

    if (elements.precipitation) {
        let rain = currentWeather.rain ? currentWeather.rain['1h'] || currentWeather.rain['3h'] || 0 : 0;
        elements.precipitation.textContent = `${rain} mm`;
    }

    renderTemperatures();
    triggerWeatherEffects(currentWeather.weather[0].id);
    generateLifestyleTips(currentWeather.weather[0].id);
    renderForecastTracks();
}

function renderTemperatures() {
    if (!currentWeather) return;
    
    let temp = currentWeather.main.temp;
    let feels = currentWeather.main.feels_like;
    let dew = currentWeather.main.temp - ((100 - currentWeather.main.humidity) / 5);

    if (!isCelsius) {
        temp = (temp * 9/5) + 32;
        feels = (feels * 9/5) + 32;
        dew = (dew * 9/5) + 32;
    }

    if (elements.temperature) elements.temperature.textContent = Math.round(temp);
    if (elements.feelsLike) elements.feelsLike.textContent = `${Math.round(feels)}°`;
    if (elements.dewPoint) elements.dewPoint.textContent = Math.round(dew);
    if (elements.displayUnit) elements.displayUnit.textContent = isCelsius ? 'C' : 'F';
    if (elements.dewPointUnit) elements.dewPointUnit.textContent = isCelsius ? 'C' : 'F';
}

// ============ RENDER TIMELINE FORECASTS ============
function renderForecastTracks() {
    if (!currentForecast || !elements.hourlyForecast || !elements.dailyForecast) return;

    elements.hourlyForecast.innerHTML = '';
    elements.dailyForecast.innerHTML = '';
    

    currentForecast.list.slice(0, 8).forEach(item => {
        let time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let temp = isCelsius ? Math.round(item.main.temp) : Math.round((item.main.temp * 9/5) + 32);
        
        elements.hourlyForecast.innerHTML += `
            <div class="hourly-item">
                <div class="hourly-item-time">${time}</div>
                <div class="hourly-item-icon">
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="icon" style="width:100%;height:100%;"/>
                </div>
                <div class="hourly-item-temp">${temp}°</div>
            </div>`;
    });

    const uniqueDays = [];
    currentForecast.list.forEach(item => {
        let dayName = new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'short' });
        if (!uniqueDays.includes(dayName) && uniqueDays.length < 5) {
            uniqueDays.push(dayName);
            let tempHigh = isCelsius ? Math.round(item.main.temp_max) : Math.round((item.main.temp_max * 9/5) + 32);
            let tempLow = isCelsius ? Math.round(item.main.temp_min) : Math.round((item.main.temp_min * 9/5) + 32);

            elements.dailyForecast.innerHTML += `
                <div class="daily-item">
                    <div class="daily-item-day">${dayName}</div>
                    <div class="daily-item-icon">
                        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="icon" style="width:100%;height:100%;"/>
                    </div>
                    <div class="daily-item-temps">
                        <span class="daily-item-high">${tempHigh}°</span>
                        <span class="daily-item-low">${tempLow}°</span>
                    </div>
                </div>`;
        }
    });
}

// ============ ATMOSPHERIC EFFECTS ANIMATIONS ============
let lightningInterval = null;

function triggerWeatherEffects(conditionId) {
    // Reset everything first
    if (elements.rainContainer) elements.rainContainer.classList.remove('active');
    if (elements.snowContainer) elements.snowContainer.classList.remove('active');
    if (elements.sunContainer) elements.sunContainer.classList.remove('active');
    if (elements.mistContainer) elements.mistContainer.classList.remove('active');
    if (elements.cloudContainerEl) elements.cloudContainerEl.classList.remove('overcast');
    stopLightning();

    if (conditionId >= 200 && conditionId < 300) {
        if (elements.rainContainer) {
            elements.rainContainer.classList.add('active');
            generateRain();
        }
        startLightning();
    } else if (conditionId >= 300 && conditionId < 600) {
        if (elements.rainContainer) {
            elements.rainContainer.classList.add('active');
            generateRain();
        }
    } else if (conditionId >= 600 && conditionId < 700) {
        if (elements.snowContainer) {
            elements.snowContainer.classList.add('active');
            generateSnow();
        }
    } else if (conditionId >= 700 && conditionId < 800) {
        if (elements.mistContainer) elements.mistContainer.classList.add('active');
    } else if (conditionId === 800) {
        if (elements.sunContainer) elements.sunContainer.classList.add('active');
    } else if (conditionId === 803 || conditionId === 804) {
        if (elements.cloudContainerEl) elements.cloudContainerEl.classList.add('overcast');
    }
}

function startLightning() {
    if (!elements.lightningContainer) return;
    elements.lightningContainer.classList.add('active');

    const flash = () => {
        elements.lightningContainer.classList.remove('flash');
        void elements.lightningContainer.offsetWidth; // force reflow to restart animation
        elements.lightningContainer.classList.add('flash');
    };

    flash();
    lightningInterval = setInterval(flash, 5000 + Math.random() * 5000);
}
function generateRain() {
    if (!elements.rainContainer) return;
    elements.rainContainer.innerHTML = '';
    const dropCount = 100;
    for (let i = 0; i < dropCount; i++) {
        const drop = document.createElement('div');
        drop.classList.add('raindrop');
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${0.4 + Math.random() * 0.4}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        elements.rainContainer.appendChild(drop);
    }
}

function generateSnow() {
    if (!elements.snowContainer) return;
    elements.snowContainer.innerHTML = '';
    const flakeCount = 60;
    for (let i = 0; i < flakeCount; i++) {
        const flake = document.createElement('div');
        flake.classList.add('snowflake');
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.width = flake.style.height = `${4 + Math.random() * 6}px`;
        flake.style.animationDuration = `${5 + Math.random() * 6}s`;
        flake.style.animationDelay = `${Math.random() * 5}s`;
        elements.snowContainer.appendChild(flake);
    }
}
function stopLightning() {
    if (lightningInterval) {
        clearInterval(lightningInterval);
        lightningInterval = null;
    }
    if (elements.lightningContainer) {
        elements.lightningContainer.classList.remove('active', 'flash');
    }
}

// ============ DISCOVER LIFESTYLE RECOMMENDATIONS ============
function generateLifestyleTips(conditionId) {
    if (!elements.lifestyleTips) return;
    elements.lifestyleTips.innerHTML = '';

    const matchingTips = lifestyleTipsData.filter(tip => tip.weather.includes(conditionId));
    const tipsToDisplay = matchingTips.length ? matchingTips : lifestyleTipsData.slice(0, 3);

    tipsToDisplay.forEach(tip => {
        elements.lifestyleTips.innerHTML += `
            <div class="lifestyle-tip">
                <span class="lifestyle-tip-icon">${tip.icon}</span>
                <span class="lifestyle-tip-text">${tip.text}</span>
            </div>`;
    });
}

// ============ LEAFLET INTERACTIVE MAP MAPPING ============
function updateMapLayout(lat, lon, name) {
    const mapDiv = document.getElementById('map');
    if (!mapDiv) return;

    if (typeof L === 'undefined') {
        console.error("Leaflet CDN engine missing.");
        return;
    }

    if (!map) {
        map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        marker = L.marker([lat, lon]).addTo(map).bindPopup(name).openPopup();
    } else {
        map.setView([lat, lon], 10);
        marker.setLatLng([lat, lon]).setPopupContent(name).openPopup();
    }
}

// ============ UNIT TOGGLING HANDLER ============
if (elements.tempToggleBtn) {
    elements.tempToggleBtn.addEventListener('click', () => {
        isCelsius = !isCelsius;
        if (elements.tempUnitDisplay) elements.tempUnitDisplay.textContent = isCelsius ? '°F' : '°C';
        renderTemperatures();
        renderForecastTracks();
    });
}

// ============ INTERACTION HANDLERS ============
if (elements.searchBtn) {
    elements.searchBtn.addEventListener('click', () => {
        const query = elements.searchInput ? elements.searchInput.value.trim() : "";
        if (query) fetchWeatherData(query);
    });
}

// NEW CHANGES: Enter key event handler for weather page input text box
if (elements.searchInput) {
    elements.searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const query = elements.searchInput.value.trim();
            if (query) fetchWeatherData(query);
        }
    });
}

// NEW CHANGES: Enter key event handler for primary landing page input text box
if (elements.cityInput) {
    elements.cityInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            goSearch();
        }
    });
}

if (elements.currentLocationBtn) {
    elements.currentLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            toggleLoading(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const res = await fetch(`${API_CONFIG.weatherApi}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
                        currentWeather = await res.json();
                        fetchWeatherData(currentWeather.name);
                    } catch {
                        showToast("Failed to parse device coordinates.");
                        toggleLoading(false);
                    }
                },
                () => {
                    showToast("Location access denied.");
                    toggleLoading(false);
                }
            );
        }
    });
}

// ============ UI UTILITIES ============
function toggleLoading(show) {
    isLoading = show;
    if (elements.loadingIndicator) {
        if (show) elements.loadingIndicator.classList.add('active');
        else elements.loadingIndicator.classList.remove('active');
    }
}

function showToast(msg) {
    if (!elements.errorToast) return;
    elements.errorToast.textContent = msg;
    elements.errorToast.classList.add('show');
    setTimeout(() => elements.errorToast.classList.remove('show'), 3000);
}

// Check for parameters on display load
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const urlCity = params.get('city');
    if (urlCity) {
        if (elements.searchInput) elements.searchInput.placeholder = 'Search for another city...';
        fetchWeatherData(urlCity);
    }
});