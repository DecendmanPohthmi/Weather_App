document.getElementById("search-btn").addEventListener("click", function () {
  const city = document.getElementById("city-input").value;
  fetchWeatherData(city);
});
async function fetchWeatherData(city) {
  const apiKey = "ba29ac5ebf04302b4ef63ff52f4d799d";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    document.getElementById("city-name").innerHTML = `<strong>City:</strong> ${data.name}`
    document.getElementById("humidity").innerHTML = `<strong>Humidity:</strong> ${data.main.humidity}`
    document.getElementById("pressure").innerHTML = `<strong>Pressure:</strong> ${data.main.pressure}`
    document.getElementById("temperature").innerHTML = `<strong>Temperature:</strong> ${data.main.temp}℃`
    document.getElementById("weather-description").innerHTML = `<strong>Description:</strong> ${data.weather[0].description}`
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}