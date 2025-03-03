let input = document.getElementById('cityname');
let searchbtn = document.getElementById('searchbtn');
let cityNameElement = document.getElementById('city');
let temp = document.getElementById('temp');
let description = document.getElementById('description');
let humidity = document.getElementById('humidity');
let wind = document.getElementById('wind');
let weatherIcon = document.getElementById('weather-icon');
let forecastContainer = document.getElementById('forecast');

const API_KEY = 'cf2f3c21ddeac483982a833e84fb7fc9';

const apicall = async (cityName) => {
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
    let forecastAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(api);
        const json = await response.json();

        if (json.cod === '404') {
            cityNameElement.textContent = 'City not found';
            return;
        }

        cityNameElement.textContent = `Weather in ${json.name}`;
        temp.textContent = `${json.main.temp}°C`;
        description.textContent = `${json.weather[0].description}`;
        humidity.textContent = `Humidity: ${json.main.humidity}%`;
        wind.textContent = `Wind Speed: ${json.wind.speed} km/h`;

        const iconCode = json.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
        weatherIcon.src = iconUrl;
        weatherIcon.style.display = 'block'; // Show icon after search

        // Fetch 5-day forecast
        const forecastResponse = await fetch(forecastAPI);
        const forecastJson = await forecastResponse.json();
        displayForecast(forecastJson);

    } catch (error) {
        console.log('Error fetching data', error);
    }
};

const displayForecast = (data) => {
    forecastContainer.innerHTML = ''; 
    const dailyData = {};

    data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyData[date]) {
            dailyData[date] = item;
        }
    });

    Object.values(dailyData).slice(0, 5).forEach(day => {
        const forecastDiv = document.createElement('div');
        forecastDiv.classList.add('day');

        forecastDiv.innerHTML = `
            <h4>${new Date(day.dt_txt).toLocaleDateString()}</h4>
            <img src="http://openweathermap.org/img/w/${day.weather[0].icon}.png" alt="Weather">
            <p>${day.main.temp}°C</p>
        `;

        forecastContainer.appendChild(forecastDiv);
    });
};

// Search on button click or pressing Enter
searchbtn.addEventListener('click', () => apicall(input.value.trim()));
input.addEventListener('keypress', (event) => {
    if (event.key === "Enter") apicall(input.value.trim());
});
