document.getElementById("search-btn").addEventListener("click", function () {
  const city = document.getElementById("city-input").value;
  fetchWeatherData(city);
});
async function fetchWeatherData(city) {
  const apiKey = "ba29ac5ebf04302b4ef63ff52f4d799d";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log("Weather data:", data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}