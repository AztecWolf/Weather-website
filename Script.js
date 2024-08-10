document.getElementById('fetch-weather').addEventListener('click', fetchWeather);

function fetchWeather() {
    const city = document.getElementById('city-input').value.trim();

    if (city === '') {
        document.getElementById('current-weather').innerHTML = `<p>Please enter a city name.</p>`;
        return;
    }

    const apiKey = 'dfa01d55eba2815bf322df628fb62a1c';  
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    document.getElementById('current-weather').innerHTML = `<p>Loading...</p>`;
    document.getElementById('forecast').innerHTML = '';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
            const currentWeather = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <div class="weather-card">
                    <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" class="weather-icon" alt="${data.weather[0].description}">
                    <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
                    <p><strong>Feels like:</strong> ${data.main.feels_like} °C</p>
                    <p><strong>Weather:</strong> ${data.weather[0].description}</p>
                    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                    <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
                    <p><strong>Sunrise:</strong> ${sunrise}</p>
                    <p><strong>Sunset:</strong> ${sunset}</p>
                </div>
            `;
            document.getElementById('current-weather').innerHTML = currentWeather;
            fetchForecast(data.coord.lat, data.coord.lon, apiKey);
        })
        .catch(error => {
            document.getElementById('current-weather').innerHTML = `<p>${error.message}</p>`;
        });
}

function fetchForecast(lat, lon, apiKey) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            let forecastHTML = '';
            for (let i = 0; i < data.list.length; i += 8) {
                const forecast = data.list[i];
                const date = new Date(forecast.dt * 1000).toLocaleDateString();
                forecastHTML += `
                    <div class="forecast-item">
                        <h3>${date}</h3>
                        <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" class="weather-icon" alt="${forecast.weather[0].description}">
                        <p><strong>Temp:</strong> ${forecast.main.temp} °C</p>
                        <p>${forecast.weather[0].description}</p>
                    </div>
                `;
            }
            document.getElementById('forecast').innerHTML = forecastHTML;
        });
}
