// API key for OpenWeatherMap
const apiKey = '97edebb0bfbdbd917d28d386ab217451';

// Retrieve weather data for a given city
function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  // Make API request
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Process and display current weather conditions
      const currentWeather = data.list[0];
      const cityName = data.city.name;
      const currentDate = new Date(currentWeather.dt * 1000).toLocaleDateString();
      const weatherIcon = currentWeather.weather[0].icon;
      const temperature = Math.round(currentWeather.main.temp - 273.15);
      const humidity = currentWeather.main.humidity;
      const windSpeed = currentWeather.wind.speed;

      document.getElementById('city-name').textContent = cityName;
      document.getElementById('current-date').textContent = currentDate;
      document.getElementById('weather-icon').src = `http://openweathermap.org/img/w/${weatherIcon}.png`;
      document.getElementById('temperature').textContent = `Temperature: ${temperature}°C`;
      document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
      document.getElementById('wind-speed').textContent = `Wind Speed: ${windSpeed} km/h`;

      // Process and display 5-day forecast
      const forecastContainer = document.getElementById('forecast-container');
      forecastContainer.innerHTML = '';

      for (let i = 1; i < 6; i++) {
        const forecast = data.list[i * 8];
        const forecastDate = new Date(forecast.dt * 1000).toLocaleDateString();
        const forecastIcon = forecast.weather[0].icon;
        const forecastTemperature = Math.round(forecast.main.temp - 273.15);
        const forecastHumidity = forecast.main.humidity;
        const forecastWindSpeed = forecast.wind.speed;

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
          <h3>${forecastDate}</h3>
          <img src="http://openweathermap.org/img/w/${forecastIcon}.png" alt="Weather Icon">
          <p>Temperature: ${forecastTemperature}°C</p>
          <p>Humidity: ${forecastHumidity}%</p>
          <p>Wind Speed: ${forecastWindSpeed} km/h</p>
        `;

        forecastContainer.appendChild(forecastItem);
      }
    })
    .catch(error => console.log('Error:', error));
}

// Handle form submission
document.getElementById('search-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const cityInput = document.getElementById('city-input');
  const city = cityInput.value.trim();

  if (city !== '') {
    getWeatherData(city);
    cityInput.value = '';

    // Store search history in local storage
    let searchHistory = localStorage.getItem('searchHistory');
    searchHistory = searchHistory ? JSON.parse(searchHistory) : [];
    searchHistory.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    displaySearchHistory();
  }
});

// Display search history
function displaySearchHistory() {
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = '';

  let searchHistory = localStorage.getItem('searchHistory');
  searchHistory = searchHistory ? JSON.parse(searchHistory) : [];

  searchHistory.forEach(city => {
    const listItem = document.createElement('li');
    listItem.textContent = city;
    listItem.addEventListener('click', function() {
      getWeatherData(city);
    });

    historyList.appendChild(listItem);
  });
}

// Initialize the dashboard
displaySearchHistory();
