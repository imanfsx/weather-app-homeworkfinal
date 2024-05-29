import axios from "axios";
import React, { useState, useEffect } from "react";
import "./styles.css";

export default function App() {
  useEffect(() => {
    const searchCityInput = document.querySelector("#search-city-input");

    const city = (event) => {
      event.preventDefault();
      const query = searchCityInput.value;
      const apiKey = "384o5eb54t8f21820fdceb7ff6b5a26b";
      const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${query}&key=${apiKey}&units=metric`;
      axios.get(apiUrl).then(weather);
    };

    const weather = (response) => {
      const cityTemperature = document.querySelector(".temp-value");
      cityTemperature.innerHTML = Math.round(response.data.temperature.current);
      const currentConditions = document.querySelector("#current-conditions");
      currentConditions.innerHTML = response.data.condition.description;
      const humidity = document.querySelector("#humidity");
      humidity.innerHTML = `${response.data.temperature.humidity}%`;
      const wind = document.querySelector("#wind");
      wind.innerHTML = `${response.data.wind.speed}km/h`;
      const icon = document.querySelector("#temp-icon");
      icon.innerHTML = `<img src="${response.data.condition.icon_url}" id="temp-icon" />`;
      const currentDay = document.querySelector("#current-day-time");
      const date = new Date(response.data.time * 1000);
      currentDay.innerHTML = formatDate(date);

      getForecast(response.data.city);
    };

    const cityInput = document.querySelector("#search-city");
    cityInput.addEventListener("submit", city);

    const formatDate = (date) => {
      let minutes = date.getMinutes();
      let hours = date.getHours();
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      let day = days[date.getDay()];
      if (minutes < 10) {
        minutes = `0${minutes}`;
      }
      return `${day} ${hours}:${minutes},`;
    };

    const formatDay = (timestamp) => {
      const date = new Date(timestamp * 1000);
      const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
      return days[date.getDay()];
    };

    const getForecast = (city) => {
      const apiKey = "384o5eb54t8f21820fdceb7ff6b5a26b";
      const apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
      axios.get(apiUrl).then(displayForecast);
    };

    const displayForecast = (response) => {
      let forecastHtml = "";
      response.data.daily.forEach(function (day, index) {
        if (index < 5) {
          forecastHtml += `<div class="weather-forecast-day">
              <div class="forecast-day">${formatDay(day.time)}</div>
              <div>
                <img
                  src="${day.condition.icon_url}"
                  class="forecast-icon"
                /> 
              </div>
              <div class="forecast-temp">
                <span class="forecast-hi">
                  <strong>${Math.round(day.temperature.maximum)}°</strong>
                </span>
                <span class="forecast-low">
                  ${Math.round(day.temperature.minimum)}°
                </span>
              </div>
            </div>`;
        }
      });
      const forecastElement = document.querySelector("#forecast");
      forecastElement.innerHTML = forecastHtml;
    };

    return () => {
      cityInput.removeEventListener("submit", city);
    };
  }, []);

  return (
    <div>
      <form id="search-city">
        <input type="text" id="search-city-input" />
        <button type="submit">Search</button>
      </form>
      <div className="weather-info">
        <div>
          Temperature: <span className="temp-value"></span>°C
        </div>
        <div id="current-conditions"></div>
        <div id="humidity"></div>
        <div id="wind"></div>
        <div id="current-day-time"></div>
        <div id="temp-icon"></div>
      </div>
      <div id="forecast"></div>
    </div>
  );
}
