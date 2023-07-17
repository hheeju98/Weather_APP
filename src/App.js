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
        <h1>에러 발생</h1>;
        console.error(error);
      }
    );
  }, []);

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

  const handleCurrentLocationClick = () => {
    if (latitude && longitude) {
      if (weatherData) {
        setWeatherData(""); // 날씨 정보 초기화
      } else {
        getWeatherData();
      }
    }
  };

  // 시간 포맷 설정 (초는 안보여주기)
  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {weatherData ? (
        <div>
          <h2>{weatherData.name}</h2>
          <h2>{new Date().toDateString()}</h2>
          <h2>{formatTime(new Date())}</h2>
          <h2>{weatherData.main.temp}°C</h2>
          <p>{weatherData.weather[0].description}</p>
        </div>
      ) : (
        <p></p>
      )}
      <button onClick={handleCurrentLocationClick}>Current Location</button>
      <button>London</button>
      <button>New York</button>
    </div>
  );
}

export default App;
