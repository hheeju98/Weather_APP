import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [weatherData, setWeatherData] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const API_KEY = "c6dd83a313a396f0868c4e5c0121923c";
  const API_URL = "https://api.openweathermap.org/data/2.5/weather";
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);
  useEffect(() => {
    if (latitude && longitude) {
      getWeatherData();
    }
  }, [latitude, longitude]);

  const getWeatherData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      {weatherData ? (
        <div>
          <h2>{weatherData.name}</h2>
          <h2>{new Date().toDateString()}</h2>
          <h2>{new Date().toLocaleTimeString()}</h2>
          <h2>{weatherData.main.temp}°C</h2>
          <p>{weatherData.weather[0].description}</p>
        </div>
      ) : (
        <p>날씨 정보를 불러오는 중입니다...</p>
      )}
      <button>Current Location</button>
      <button>London</button>
      <button>New York</button>
    </div>
  );
}

export default App;
