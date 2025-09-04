import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import cityList from "../Components/Citylist";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiSunrise,
  WiSunset,
} from "react-icons/wi";
import clearImg from "../assets/clear.jpeg";
import cloudsImg from "../assets/cloud.webp";
import rainImg from "../assets/rain.jpeg";
import snowImg from "../assets/snow.jpeg";
import thunderImg from "../assets/thunder.jpeg";
import fogImg from "../assets/fog.jpeg";

function getWeatherBg(main) {
  switch (main) {
    case "Rain":
      return rainImg;
    case "Clear":
      return clearImg;
    case "Clouds":
      return cloudsImg;
    case "Snow":
      return snowImg;
    case "Thunderstorm":
      return thunderImg;
    case "Fog":
    case "Mist":
    case "Haze":
      return fogImg;
    default:
      return clearImg;
  }
}

const API_KEY = "8011e02a8cccb4d77e688c203e2e2f6d";
const bannerImage =
  "https://cdn.pixabay.com/photo/2018/11/29/23/32/sky-3846778_1280.jpg";

export default function App() {
  const [weather, setWeather] = useState(null);
  const [query, setQuery] = useState("");
  const [unit, setUnit] = useState("metric");
  const [error, setError] = useState("");
  const [hourly, setHourly] = useState([]);
  const [daily, setDaily] = useState([]);
  const [activeTab, setActiveTab] = useState("today");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        () => setError("Location access denied.")
      );
    }
  }, []);

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
        setError("");
        fetchForecast(lat, lon);
      }
    } catch {
      setError("Error fetching weather.");
    }
  };

  const fetchWeatherByCity = async () => {
    if (!query) return;
    try {
      let res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}`
      );
      let data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
        setError("");
        fetchForecast(data.coord.lat, data.coord.lon);
        setQuery("");
        return;
      }
      res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?zip=${query},NP&appid=${API_KEY}`
      );
      data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
        setError("");
        fetchForecast(data.coord.lat, data.coord.lon);
        setQuery("");
        return;
      }

      res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?zip=${query}&appid=${API_KEY}`
      );
      data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
        setError("");
        fetchForecast(data.coord.lat, data.coord.lon);
        setQuery("");
        return;
      }
      setError("City or zip code not found.");
    } catch {
      setError("Error fetching weather.");
    }
  };

  const fetchForecast = async (lat, lon) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const data = await res.json();
    if (data.cod === "200") {
      setHourly(data.list.slice(0, 12));
      groupDailyForecast(data.list);
    }
  };

  const groupDailyForecast = (list) => {
    const days = {};
    list.forEach((item) => {
      const date = new Date(item.dt_txt).toDateString();
      if (!days[date]) {
        days[date] = {
          temps: [],
          weather: item.weather[0].main,
          dt: item.dt,
        };
      }
      days[date].temps.push(item.main.temp);
    });

    const dailyArr = Object.keys(days).map((date) => {
      const temps = days[date].temps;
      return {
        date,
        dt: days[date].dt,
        min: Math.min(...temps),
        max: Math.max(...temps),
        weather: days[date].weather,
      };
    });

    setDaily(dailyArr);
  };

  const convertTemp = (kelvin) => {
    if (unit === "metric") return Math.round(kelvin - 273.15) + "°C";
    return Math.round(((kelvin - 273.15) * 9) / 5 + 32) + "°F";
  };

  const formatTime = (dtTxt) => {
    const date = new Date(dtTxt);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getIcon = (main) => {
    switch (main) {
      case "Clear":
        return <WiDaySunny size={32} className="text-yellow-400" />;
      case "Clouds":
        return <WiCloud size={32} className="text-gray-500" />;
      case "Rain":
        return <WiRain size={32} className="text-blue-500" />;
      case "Snow":
        return <WiSnow size={32} className="text-blue-300" />;
      case "Thunderstorm":
        return <WiThunderstorm size={32} className="text-purple-600" />;
      case "Fog":
      case "Mist":
      case "Haze":
        return <WiFog size={32} className="text-gray-400" />;
      default:
        return <WiDaySunny size={32} className="text-yellow-400" />;
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value.length > 0) {
      const regex = new RegExp(e.target.value, 'i');
      setSuggestions(cityList.filter(city => regex.test(city)));
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Banner Image */}
      <div
        className="h-56 md:h-72 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 flex items-center justify-center shadow space-x-3 relative">
        <div className="flex items-center w-1/2 border rounded px-3 relative md:1/3">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search city or zip code"
            value={query}
            onChange={handleInputChange}
            className="flex-1 px-1 py-2 outline-none"
            autoComplete="off"
          />
          {/* suggestion  */}
          {suggestions.length > 0 && (
            <ul className="absolute left-0 top-full bg-white border rounded w-full mt-1 z-10 max-h-48 overflow-y-auto shadow-lg">
              {suggestions.map((city) => (
                <li key={city} className="px-0 py-0">
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 cursor-pointer hover:bg-blue-100"
                    onClick={() => {
                      setQuery(city);
                      setSuggestions([]);
                    }}
                  >
                    {city}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={fetchWeatherByCity}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center justify-center"
          aria-label="Search"
        >
          <FiSearch className="text-xl" />
        </button>
        <button
          onClick={() => setUnit(unit === "metric" ? "imperial" : "metric")}
          className="px-3 py-1 rounded bg-blue-600 text-white"
        >
          Toggle to {unit === "metric" ? "°F" : "°C"}
        </button>
      </div>

      {/* Nav Tabs */}
      <div className="bg-gray-100 shadow flex justify-center space-x-2 py-2">
        {["today", "hourly", "tomorrow", "7day"].map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize font-medium px-2 py-1 rounded-lg transition-all duration-200 shadow-sm
              ${activeTab === tab
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white scale-105 border-b-2 border-blue-600"
                : "bg-white text-gray-600 hover:bg-blue-100"}
              ${tab === "tomorrow" ? "border border-purple-400" : ""}
            `}
            style={tab === "tomorrow" ? { fontWeight: 'bold', letterSpacing: '1px', fontSize: '0.95rem' } : { fontSize: '0.95rem' }}
          >
            {tab === "7day"
              ? "7 Day"
              : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Weather Sections */}
      <div className="flex-1 p-6">
        {error && <p className="text-red-500">{error}</p>}

        {activeTab === "today" && weather && (
          <>
            {/* Dynamic Heading with city, country, and real time */}
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-bold">
                {weather.name}, {weather.sys.country}
              </h2>
              <p className="text-lg font-medium mt-1">
                As of {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} {Intl.DateTimeFormat().resolvedOptions().timeZone}, {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex flex-col md:flex-row bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow overflow-hidden">
              {/* dynamic background */}
              <div
                className="md:w-1/2 w-full flex flex-col justify-center items-center text-center py-6 px-4"
                style={{
                  backgroundImage: `url(${getWeatherBg(weather.weather[0].main)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '250px',
                  filter: 'brightness(0.9)',
                }}
              >
                <h2 className="text-2xl font-bold">
                  {weather.name}, {weather.sys.country}
                </h2>
                <p className="text-6xl font-bold mt-2">
                  {convertTemp(weather.main.temp)}
                </p>
                <div className="flex justify-center mt-2">
                  {getIcon(weather.weather[0].main)}
                </div>
                <p className="capitalize text-xl">
                  {weather.weather[0].description}
                </p>
                <p className="mt-2">
                  Day {convertTemp(weather.main.temp_max)} • Night {convertTemp(weather.main.temp_min)}
                </p>
              </div>
              {/* Extra Features */}
              <div className="md:w-1/2 w-full bg-white bg-opacity-20 flex flex-col justify-center p-6">
                {/* Sunrise/Sunset Section */}
                <div className="flex justify-center items-center gap-6 mb-4">
                  <div className="flex items-center gap-1">
                    <WiSunrise className="text-yellow-400 text-xl md:text-lg" />
                    <span className="font-medium text-xs md:text-sm text-black">Sunrise:</span>
                    <span className="text-xs md:text-sm text-black">{weather.sys.sunrise ? new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <WiSunset className="text-orange-400 text-xl md:text-lg" />
                    <span className="font-medium text-xs md:text-sm text-black">Sunset:</span>
                    <span className="text-xs md:text-sm text-black">{weather.sys.sunset ? new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-600 bg-opacity-30 rounded-lg p-3 flex flex-col items-center">
                    <span className="block text-lg font-bold">Humidity</span>
                    <span className="block text-xl">{weather.main.humidity}%</span>
                  </div>
                  <div className="bg-purple-600 bg-opacity-30 rounded-lg p-3 flex flex-col items-center">
                    <span className="block text-lg font-bold">Wind</span>
                    <span className="block text-xl">{weather.wind.speed} m/s</span>
                  </div>
                  <div className="bg-blue-900 bg-opacity-30 rounded-lg p-3 flex flex-col items-center">
                    <span className="block text-lg font-bold">Pressure</span>
                    <span className="block text-xl">{weather.main.pressure} hPa</span>
                  </div>
                  <div className="bg-purple-900 bg-opacity-30 rounded-lg p-3 flex flex-col items-center">
                    <span className="block text-lg font-bold">Visibility</span>
                    <span className="block text-xl">{weather.visibility / 1000} km</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab === "hourly" && hourly.length > 0 && (
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-xl text-center font-bold mb-4">Hourly Forecast for {weather.name}, {weather.sys.country}</h3>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-center border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Time</th>
                    <th className="p-2">Temp</th>
                    <th className="p-2">Condition</th>
                    <th className="p-2">Humidity</th>
                    <th className="p-2">Wind</th>
                  </tr>
                </thead>
                <tbody>
                  {hourly
                    .filter(h => {
                      const now = new Date();
                      const forecastDate = new Date(h.dt_txt);
  
                      return forecastDate > now;
                    })
                    .map((h, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-2">{formatTime(h.dt_txt)}</td>
                        <td className="p-2">{convertTemp(h.main.temp)}</td>
                        <td className="p-2 flex items-center justify-center space-x-1 capitalize">
                          {getIcon(h.weather[0].main)}
                          <span>{h.weather[0].main}</span>
                        </td>
                        <td className="p-2">{h.main.humidity}%</td>
                        <td className="p-2">{h.wind.speed} m/s</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7 Day  */}
        {activeTab === "7day" && daily.length > 0 && (
          <>
            {/* Dynamic Heading */}
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-bold">
                {weather.name}, {weather.sys.country}
              </h2>
              <p className="text-lg font-medium mt-1">
                As of {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} {Intl.DateTimeFormat().resolvedOptions().timeZone}, {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-center border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Date</th>
                    <th className="p-2">Min</th>
                    <th className="p-2">Max</th>
                    <th className="p-2">Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {daily.slice(0, 7).map((d) => (
                    <tr key={d.dt} className="border-b">
                      <td className="p-2">{d.date}</td>
                      <td className="p-2">{convertTemp(d.min)}</td>
                      <td className="p-2">{convertTemp(d.max)}</td>
                      <td className="p-2 flex items-center justify-center space-x-1 capitalize">
                        {getIcon(d.weather)}
                        <span>{d.weather}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Tomorrow's Weather */}
        {activeTab === "tomorrow" && daily.length > 1 && (
          <>
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-bold">
                {weather.name}, {weather.sys.country}
              </h2>
              <p className="text-lg font-medium mt-1">
                Tomorrow • {new Date(Date.now() + 86400000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex flex-col md:flex-row bg-gradient-to-r from-purple-500 to-blue-400 text-white rounded-xl shadow overflow-hidden mt-6">
              {/*background */}
              <div
                className="md:w-1/2 w-full flex flex-col justify-center items-center text-center py-6 px-4"
                style={{
                  backgroundImage: `url(${getWeatherBg(daily[1].weather)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '250px',
                  filter: 'brightness(0.9)',
                }}
              >
                <h2 className="text-2xl font-bold mb-2">
                {weather.name}, {weather.sys.country}
                </h2>
                <p className="text-5xl font-bold mt-2">
                  {convertTemp(daily[1].max)}
                </p>
                <div className="flex justify-center mt-2">
                  {getIcon(daily[1].weather)}
                </div>
                <p className="capitalize text-xl mt-2">
                  {daily[1].weather}
                </p>
                <p className="mt-2">
                  Min {convertTemp(daily[1].min)} • Max {convertTemp(daily[1].max)}
                </p>
                <p className="mt-2 text-sm text-gray-200">{daily[1].date}</p>
              </div>
              {/*Extra Features */}
              <div className="md:w-1/2 w-full bg-white bg-opacity-20 flex flex-col justify-center p-6">
                {/* Sunrise/Sunset Section */}
                <div className="flex justify-center items-center gap-6 mb-4">
                  <div className="flex items-center gap-1">
                    <WiSunrise className="text-yellow-400 text-xl md:text-lg" />
                    <span className="font-medium text-black text-xs md:text-sm">Sunrise:</span>
                    <span className="text-sm text-black">{weather.sys.sunrise ? new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <WiSunset className="text-orange-400 text-xl md:text-lg" />
                    <span className="font-medium text-black text-xs md:text-sm py-4">Sunset:</span>
                    <span className="text-sm text-black py-4">{weather.sys.sunset ? new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-600 bg-opacity-30 rounded-lg p-3 flex flex-col items-center">
                    <span className="block text-lg font-bold">Humidity</span>
                    <span className="block text-xl">{weather.main.humidity}%</span>
                  </div>
                  <div className="bg-purple-600 bg-opacity-30 rounded-lg p-3 flex flex-col items-center">
                    <span className="block text-lg font-bold">Wind</span>
                    <span className="block text-xl">{weather.wind.speed} m/s</span>
                  </div>
                  <div className="bg-blue-900 bg-opacity-30 rounded-lg p-3 flex flex-col items-center">
                    <span className="block text-lg font-bold">Pressure</span>
                    <span className="block text-xl">{weather.main.pressure} hPa</span>
                  </div>
                  <div className="bg-purple-900 bg-opacity-30 rounded-lg p-3 flex flex-col items-center">
                    <span className="block text-lg font-bold">Visibility</span>
                    <span className="block text-xl">{weather.visibility / 1000} km</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
