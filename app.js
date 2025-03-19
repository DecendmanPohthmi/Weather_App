const lat = "25.5689";
const lon = "91.8831";
const API = "ba29ac5ebf04302b4ef63ff52f4d799d";

const fetchWeather = async () => {
    const apiURl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API}`;
    try {
        const response = await fetch(apiURl);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
    }
};

fetchWeather();
