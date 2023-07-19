import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

function App() {
  const [weatherData, setWeatherData] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const API_KEY = "c6dd83a313a396f0868c4e5c0121923c";
  const API_URL = "https://api.openweathermap.org/data/2.5/weather";

  useEffect(() => {
    const getWeatherByCurrentLocation = async () => {
      try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        getWeatherData(latitude, longitude);
      } catch (error) {
        console.error(error);
      }
    };

    const getCurrentPosition = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    };

    getWeatherByCurrentLocation();
  }, []);

  const getWeatherData = async (latitude, longitude) => {
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
        getWeatherData(latitude, longitude);
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
      <Button variant="info" onClick={handleCurrentLocationClick}>
        Current Location
      </Button>
      <Button variant="info">London</Button>
      <Button variant="info">New York</Button>
      <Button variant="info">Paris</Button>
      <Button variant="info">Tokyo</Button>

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
    </div>
  );
}

export default App;
