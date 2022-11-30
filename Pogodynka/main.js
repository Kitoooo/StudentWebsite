let api_key = "887881f0860eca638365e407a5c31d1e";
let api_pdf = "7ded80d91f2b280ec979100cc8bbba94";
let PolandCenter = {
  lat: 51.9189046,
  lng: 19.1343786,
};

const WeatherApp = class {
  constructor(api_key) {
    this.api_key = api_key;
    this.currentWeatherSelector = document.querySelector("#current-weather");
    this.forcastWeatherSelector = document.querySelector("#forcast-weather");
  }
  __getCityCoords(city) {
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.api_key}`
    )
      .then((response) => response.json())
      .then((data) => {
        return {
          lat: data.coord.lat,
          lon: data.coord.lon,
        };
      });
  }

  async getWeather(city) {
    let coords = await this.__getCityCoords(city);
    this.getCurrentWeather(coords);
    this.getForcastWeather(coords);
  }

  getCurrentWeather(coords) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${this.api_key}&units=metric`;
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Błąd sieci!");
      })
      .then((data) => {
        console.log(data);
        this.renderCurrentWeather(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getForcastWeather(coords) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${this.api_key}&units=metric`;

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Błąd sieci!");
      })
      .then((data) => {
        console.log(data);
        this.renderForcastWeather(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  createWeatherCard(data) {
    const weatherCard = document.createElement("div");
    weatherCard.classList.add("weather-card");

    const { name, main, weather, dt } = data;
    const { temp, feels_like } = main;
    const { icon } = weather[0];
    const iconUrl = `https://openweathermap.org/img/w/${icon}.png`;
    weatherCard.innerHTML = `
      <h4>${name}</h4>
      <p>${this.__convertUnixTimeToDateTime(dt)}</p>
      <img src="${iconUrl}"/>
      <p>Temperatura: ${temp} &#176;C</p>
      <p>Odczuwalna: ${feels_like}%</p>
    `;
    return weatherCard;
  }

  renderCurrentWeather(data) {
    let weatherCard = this.createWeatherCard(data);
    let title = document.createElement("h3");
    title.textContent = "Aktualna pogoda: ";
    this.currentWeatherSelector.innerHTML = "";
    this.currentWeatherSelector.appendChild(title);
    this.currentWeatherSelector.appendChild(weatherCard);
  }

  renderForcastWeather(data) {
    let title = document.createElement("h3");
    title.textContent = "Prognoza pogody na 5dni: ";
    this.forcastWeatherSelector.innerHTML = "";
    this.forcastWeatherSelector.appendChild(title);

    let name = data.city.name;
    let forcastWrapperSelector = document.createElement("div");
    forcastWrapperSelector.classList.add("forcast-weather-wrapper");
    data.list.forEach((item) => {
      item['name'] = name;
      let weatherCard = this.createWeatherCard(item);
      forcastWrapperSelector.appendChild(weatherCard);
    });
    this.forcastWeatherSelector.appendChild(forcastWrapperSelector);
  }
  __convertUnixTimeToDateTime(unixTime) {
    let date = new Date(unixTime * 1000);
    return date.toLocaleString();
  }
};

//app init
let currentWeather = document.getElementById("current-weather");
document.weatherApp = new WeatherApp(api_key, currentWeather);

document.querySelector("#search").addEventListener("click", () => {
  let city = document.querySelector("#location-input").value;
  document.weatherApp.getWeather(city);
});

//XHR TEST current weather
function getCurrentWeather(api_key, coords) {
  let api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${api_key}&units=metric`;
  let request = new XMLHttpRequest();
  request.open("GET",api_url);
  request.send();
  return new Promise((resolve, reject) => {
    request.onload = () => {
      if (request.status == 200) {
        let data = JSON.parse(request.response);
        console.log(data);
        resolve(data);
      } else {
        reject(Error(request.statusText));
      }
    };
  });
}
  