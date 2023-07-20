import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function App() {
  const [weatherData, setWeatherData] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [error, setError] = useState(null);

  const API_KEY = "c6dd83a313a396f0868c4e5c0121923c";
  const API_URL = "https://api.openweathermap.org/data/2.5/weather";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        setError("위치 정보를 가져올 수 없습니다.");
      }
    );
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      getWeatherData(latitude, longitude);
    }
  }, [latitude, longitude]);

  const getWeatherData = async (lat, lon) => {
    try {
      const response = await axios.get(
        `${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);
      setError(null);
      //  console.log(response.data);
    } catch (error) {
      setError("날씨 정보를 가져올 수 없습니다.");
      //   console.error(error);
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

  const handleCityButtonClick = (city) => {
    if (city === "London") {
      getWeatherData(51.5074, -0.1278);
    } else if (city === "New York") {
      getWeatherData(40.7128, -74.006);
    } else if (city === "Paris") {
      getWeatherData(48.8566, 2.3522);
    } else if (city === "Tokyo") {
      getWeatherData(35.6895, 139.6917);
    }
  };

  const handleSearchChange = (e) => {
    setSearchCity(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchCity.trim() !== "") {
      searchWeatherData(searchCity);
    }
  };

  const searchWeatherData = async (city) => {
    try {
      const response = await axios.get(
        `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);
      setError(null);
    } catch (error) {
      setWeatherData(null);
      setError("날씨 정보를 가져올 수 없습니다.");
    }
  };

  // 시간 포맷 설정 (초는 안보여주기)
  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 온도가 26도 이상일 경우에 배경색 변경
  const temperatureStyleClass = () => {
    return weatherData && weatherData.main.temp > 26 ? "hot_temperature" : "";
  };

  return (
    <div className={`weather_box ${temperatureStyleClass()}`}>
      {weatherData && (
        <div className="weather_info-container">
          <div>{weatherData.name}</div>
          <div>{new Date().toDateString()}</div>
          <div>{formatTime(new Date())}</div>
          <div>{weatherData.main.temp}°C</div>
          <div>{weatherData.weather[0].description}</div>
        </div>
      )}

      <div>
        <div className="weather_btn">
          <Button variant="info" onClick={handleCurrentLocationClick}>
            Current Location
          </Button>

          <Button
            variant="info"
            onClick={() => handleCityButtonClick("London")}
          >
            London
          </Button>
          <Button
            variant="info"
            onClick={() => handleCityButtonClick("New York")}
          >
            New York
          </Button>
          <Button variant="info" onClick={() => handleCityButtonClick("Paris")}>
            Paris
          </Button>
          <Button variant="info" onClick={() => handleCityButtonClick("Tokyo")}>
            Tokyo
          </Button>
        </div>
      </div>

      <div className="search_btn">
        <Form onSubmit={handleSearchSubmit} className="mt-3">
          <Form.Control
            type="text"
            placeholder="도시를 입력하세요"
            value={searchCity}
            onChange={handleSearchChange}
          />
          <Button variant="info" type="submit" className="mt-2">
            검색
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
