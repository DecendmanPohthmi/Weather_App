let useFahrenheit = false;
    let lastQuery = null;

    document.getElementById("search-btn").addEventListener("click", () => {
      const city = document.getElementById("city-input").value.trim();
      if (!city) return showError("Please enter a city name.");
      lastQuery = city;
      fetchWeatherData(city);
    });

    document.getElementById("unit-toggle").addEventListener("change", (e) => {
      useFahrenheit = e.target.checked;
      if (lastQuery) fetchWeatherData(lastQuery);
    });

    document.getElementById("add-favorite").addEventListener("click", () => {
      if (typeof lastQuery === "string") {
        let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        if (!favorites.includes(lastQuery)) {
          favorites.push(lastQuery);
          localStorage.setItem("favorites", JSON.stringify(favorites));
          renderFavorites();
        }
      }
    });

    function renderFavorites() {
      const list = document.getElementById("favorites-list");
      list.innerHTML = "";
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      favorites.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;
        li.className = "favorite-item";
        li.onclick = () => {
          lastQuery = city;
          fetchWeatherData(city);
        };
        list.appendChild(li);
      });
    }

    function getWeatherIcon(condition) {
      const lower = condition.toLowerCase();
      if (lower.includes("clear")) return "☀️";
      if (lower.includes("cloud")) return "☁️";
      if (lower.includes("rain")) return "ἲ7️";
      if (lower.includes("drizzle")) return "ἲ6️";
      if (lower.includes("thunderstorm")) return "⛈️";
      if (lower.includes("snow")) return "❄️";
      if (lower.includes("mist") || lower.includes("fog") || lower.includes("haze")) return "ἲb️";
      return "❓";
    }

    function getDayName(dateString) {
      const date = new Date(dateString);
      return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][date.getDay()];
    }

    async function fetchWeatherData(query) {
      const apiKey = "ba29ac5ebf04302b4ef63ff52f4d799d";
      const weatherContainer = document.getElementById("weather-container");
      weatherContainer.innerHTML = "";
      const unit = useFahrenheit ? "imperial" : "metric";
      const unitSymbol = useFahrenheit ? "°F" : "°C";

      try {
        let lat, lon;

        if (typeof query === "string") {
          const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`);
          if (!res.ok) throw new Error("City not found.");
          const data = await res.json();
          lat = data.coord.lat;
          lon = data.coord.lon;
        } else {
          lat = query.lat;
          lon = query.lon;
        }

        lastQuery = query;

        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`);
        const forecast = await forecastRes.json();

        const cityName = forecast.city.name;
        const dates = new Set();
        const today = new Date();
        today.setDate(today.getDate() + 1);
        const tomorrow = today.toISOString().split("T")[0];

        forecast.list.forEach(item => {
          const date = item.dt_txt.split(" ")[0];
          if (date >= tomorrow && !dates.has(date) && dates.size < 3) {
            dates.add(date);
            const { temp, humidity, pressure } = item.main;
            const description = item.weather[0].description;
            const icon = item.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            const emoji = getWeatherIcon(description);

            weatherContainer.innerHTML += `
              <div class="forecast-item">
                <h3>📍 ${cityName}</h3>
                <p>🗓️ ${date} (${getDayName(date)})</p>
                <img src="${iconUrl}" alt="${description}" />
                <p>${emoji} ${description}</p>
                <p>🌡️ Temp: ${temp}${unitSymbol}</p>
                <p>💧 Humidity: ${humidity}%</p>
                <p>🌬️ Pressure: ${pressure} hPa</p>
              </div>
            `;
          }
        });

        if (weatherContainer.innerHTML === "") showError("No forecast data found.");
      } catch (err) {
        showError(`Error: ${err.message}`);
      }
    }

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          lastQuery = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          fetchWeatherData(lastQuery);
        }, () => showError("Unable to get location."));
      } else {
        showError("Geolocation not supported.");
      }
    }

    function showError(msg) {
      document.getElementById("weather-container").innerHTML = `<p class="error">${msg}</p>`;
    }

    // Load favorites on startup
    renderFavorites();