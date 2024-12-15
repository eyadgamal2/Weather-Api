const apiKey = `e5037c0a46804d8483a225943240201`; 
const weatherApiBaseUrl = `https://api.weatherapi.com/v1/`; 
const weatherContainer = document.querySelector("#container"); 
const inputField = document.querySelector("input"); 
let fetchedWeatherData = {}; 

const extractDateInfo = (dateString) => {
    const parsedDate = new Date(dateString);
    const dayName = parsedDate.toLocaleString("en-US", { weekday: "long" });
    const date = parsedDate.toLocaleString("en-US", { day: "2-digit" });
    const monthName = parsedDate.toLocaleString("en-US", { month: "long" });
    return { dayName, date, monthName };
};

const renderWeatherCards = (forecastArray) => {
    let content = ``; 
    forecastArray.forEach((forecast, index) => {
        const { dayName, date, monthName } = extractDateInfo(forecast.date);
        content += `
            <div class="col-md-6 col-lg-4">
                <div class="card text-white">
                    <div class="d-flex justify-content-between align-items-center fs-3">
                        ${index === 0 ? `<p>${dayName}</p><p>${date} ${monthName}</p>` : `<p>${dayName}</p>`}
                    </div>
                    <div class="fs-4">
                        ${index === 0 ? `<p class="text-start">${fetchedWeatherData.location.name}</p>` : ""}
                        <div class="d-flex flex-column justify-content-between align-items-center">
                            ${index === 0 ? `
                                <p class="display-2 fw-bold">${fetchedWeatherData.current.temp_c} &deg;C</p>
                                <img src="${fetchedWeatherData.current.condition.icon}" alt="Weather Icon">`
                            : `
                                <p>${forecast.day.maxtemp_c} &deg;C</p>
                                <p>${forecast.day.mintemp_c} &deg;C</p>
                                <img src="${forecast.day.condition.icon}" alt="Weather Icon"/>
                            `}
                        </div>
                        <p class="text-center fs-3">
                            ${index === 0 ? `${fetchedWeatherData.current.condition.text}` : `${forecast.day.condition.text}`}
                        </p>
                    </div>
                    ${index === 0 ? `
                        <div class="d-flex justify-content-between align-items-center py-2">
                            <span><i class="fa-solid fa-umbrella"></i> ${forecast.day.daily_chance_of_rain}%</span>
                            <span><i class="fa-solid fa-wind"></i> ${forecast.day.maxwind_kph} KM/H</span>
                            <span><i class="fa-solid fa-compass"></i> ${fetchedWeatherData.current.wind_dir}</span>
                        </div>
                    ` : ""}
                </div>
            </div>`;
    });
    weatherContainer.innerHTML = content;
};

const fetchWeatherData = async (query = "cairo") => {
    if (query.trim().length < 3) return; // شرط جديد للتحقق
    try {
        const response = await fetch(`${weatherApiBaseUrl}forecast.json?key=${apiKey}&q=${query}&days=3`);
        const data = await response.json();
        fetchedWeatherData = data;
        renderWeatherCards(fetchedWeatherData.forecast.forecastday);
    } catch (err) {
        console.error("Error fetching weather data:", err);
    }
};

inputField.addEventListener("input", (event) => {
    fetchWeatherData(event.target.value);
});

window.navigator.geolocation.getCurrentPosition(
    (position) => {
        fetchWeatherData(`${position.coords.latitude},${position.coords.longitude}`);
    },
    () => {
        fetchWeatherData(); 
    }
);
