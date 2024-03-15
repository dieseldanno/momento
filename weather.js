const apiKey ="113a5292ffd46c40d7d647008e25e814";
const apiUrl= "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";


const searchBox = document.querySelector(".search input")
const searchBtn = document.querySelector(".search button")
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weatherContainer").style.display = "none";
    } else {
        let data = await response.json();

        if (data.weather[0].main === "Clouds") {
            weatherIcon.className = "fa-solid fa-cloud";
        } 
        else if (data.weather[0].main === "Clear") {
            weatherIcon.className = "fa-solid fa-sun";
        } 
        else if (data.weather[0].main === "Rain") {
            weatherIcon.className = "fa-solid fa-cloud-showers-heavy";
        }
        else if (data.weather[0].main === "Drizzle") {
            weatherIcon.className = "fa-solid fa-cloud-sun-rain";
        }
        else if (data.weather[0].main === "Mist") {
            weatherIcon.className = "fa-solid fa-cloud-sun";
        }
        else if (data.weather[0].main === "Mist") {
            weatherIcon.className = "fa-solid fa-cloud-sun";
        }
        else if (data.weather[0].main === "Snow") {
            weatherIcon.className = "fa-solid fa-snowflake";
        }
        else if (data.weather[0].main === "Thunderstorm") {
            weatherIcon.className = "fa-solid fa-cloud-bolt";
        }
        else if (data.weather[0].main === "Haze") {
            weatherIcon.className = "fa-solid fa-smog";
        }
        else if (data.weather[0].main === "Fog") {
            weatherIcon.className = "fa-solid fa-smog";
        }
    
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
        document.querySelector(".wind").innerHTML = data.wind.speed + " m/s";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";

        document.querySelector(".weatherContainer").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});
