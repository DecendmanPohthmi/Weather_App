// Event listener for button click
let btn = document.getElementById("search-btn");
btn.addEventListener("click", () => {
  const city = document.getElementById("city-input").value;
  fetchWeatherData(city);
});

async function fetchWeatherData(city) {
  const apiKey = "ba29ac5ebf04302b4ef63ff52f4d799d";
  const weatherContainer = document.getElementById("weather-container");
  weatherContainer.innerHTML = ""; // Clear previous data

  try {
    // Fetch current weather to get coordinates
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);

    if (!response.ok) throw new Error(`City not found: ${response.statusText}`);

    const data = await response.json();
    const lat = data.coord.lat;
    const lon = data.coord.lon;

    // Fetch forecast data
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    if (forecastData.cod !== "200") throw new Error("Forecast data not available");

    // Get the next 3 unique days
    const today = new Date();
    const dates = [];
    for (let i = 1; i <= 3; i++) {
      const nextDay = new Date();
      nextDay.setDate(today.getDate() + i);
      dates.push(nextDay.toISOString().split('T')[0]);
    }

    // Extract and display weather data for the next 3 days
    let displayedDays = 0;
    for (let i = 0; i < forecastData.list.length; i++) {
      const forecastDate = forecastData.list[i].dt_txt.split(' ')[0];

      if (dates.includes(forecastDate) && displayedDays < 3) {
        const weather = forecastData.list[i];

        const temperature = weather.main.temp;
        const humidity = weather.main.humidity;
        const pressure = weather.main.pressure;
        const weatherDescription = weather.weather[0].description;

        // Displaying weather info dynamically
        const forecastDiv = document.createElement("div");
        forecastDiv.classList.add("forecast-item");

        forecastDiv.innerHTML = `
          <p>📅 Date: ${forecastDate}</p>
          <p>🌡️ Temp: ${temperature}°C</p>
          <p>💧 Humidity: ${humidity}%</p>
          <p>🌬️ Pressure: ${pressure} hPa</p>
          <p>🌤️ Weather: ${weatherDescription}</p>
          <hr/>
        `;

        weatherContainer.appendChild(forecastDiv);
        displayedDays++;
      }
    }
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    weatherContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}
