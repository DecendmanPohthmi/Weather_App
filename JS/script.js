// Event listener for button click
document.getElementById("search-btn").addEventListener("click", () => {
    const city = document.getElementById("city-input").value;
    fetchWeatherData(city);
  });
  
  // Function to convert date to day name
  function getDayName(dateString) {
    const date = new Date(dateString);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
  }
  
  async function fetchWeatherData(city) {
    const apiKey = "ba29ac5ebf04302b4ef63ff52f4d799d";
    const weatherContainer = document.getElementById("weather-container");
    weatherContainer.innerHTML = "";  // Clear previous data
  
    try {
      // Fetch current weather to get coordinates
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      if (!response.ok) throw new Error(`City not found: ${response.statusText}`);
  
      const data = await response.json();
      const { lat, lon } = data.coord;
  
      // Fetch 5-day forecast
      const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
      const forecastData = await forecastResponse.json();

      console.log(forecastData);
  
      if (forecastData.cod !== "200") throw new Error("Forecast data not available");
  
      // Get tomorrow's date
      const today = new Date();
      today.setDate(today.getDate() + 1);  // Set to tomorrow
      const tomorrow = today.toISOString().split("T")[0];
  
      // Display forecast for the next 3 days starting from tomorrow
      const dates = new Set();
      
      forecastData.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
  
        // Only add from tomorrow onwards and limit to 3 unique days
        if (date >= tomorrow && !dates.has(date) && dates.size < 3) {
          dates.add(date);
  
          // Get the day name
          const dayName = getDayName(date);
  
          // Display weather details
          const { temp, humidity, pressure } = item.main;
          const description = item.weather[0].description;
  
          weatherContainer.innerHTML += `
            <div class="forecast-item">
              <p>📅 Date: ${date} (${dayName})</p>
              <p>🌡️ Temp: ${temp}°C</p>
              <p>💧 Humidity: ${humidity}%</p>
              <p>🌬️ Pressure: ${pressure} hPa</p>
              <p>🌤️ Weather: ${description}</p>
              <hr/>
            </div>
          `;
        }
      });
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      weatherContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  }
  