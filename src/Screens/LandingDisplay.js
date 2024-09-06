import React, { useState, useEffect, useCallback } from 'react';
import { API } from '../config';
import { Country, State, City } from 'country-state-city';
import windIcon from '../assets/weatheIcons/wind (2).png';
import humidityIcon from '../assets/weatheIcons/water-drop.png';
import temperatureIcon from '../assets/weatheIcons/thermometer.png';
import dayBackgroundImage from '../assets/backGrounds/sky.png';
import nightBackgroundImage from '../assets/backGrounds/pngegg.png';
import { useNavigate, useLocation } from 'react-router-dom';
import Forecast from '../Components/WeatherComponents/ForcastComponent';
import LandingDisplaySkeleton from '../Components/SekeltonUI/DisplaySkeleton';

const statescoor = {
  "Suez": { latitude: 29.9668, langitude: 32.5498 },
  "Port Said": { latitude: 31.2653, langitude: 32.3019 },
  "Luxor": { latitude: 25.6872, langitude: 32.6396 },
};

const conditionToGradientClass = {
  sunny: 'bg-gradient-to-b from-yellow-300 via-yellow-200 to-yellow-100',
  clear: 'bg-gradient-to-b from-blue-300 via-blue-100 to-blue-50',
  cloudy: 'bg-gradient-to-b from-gray-200 to-gray-400',
  rainy: 'bg-gradient-to-b from-blue-500 to-gray-600',
  stormy: 'bg-gradient-to-b from-gray-700 to-gray-900',
  snowy: 'bg-gradient-to-b from-blue-200 to-white',
  foggy: 'bg-gradient-to-b from-gray-400 to-gray-500',
  misty: 'bg-gradient-to-b from-gray-300 to-gray-400',
  overcast: 'bg-gradient-to-b from-gray-500 to-gray-700',
  night_clear: 'bg-gradient-to-b from-indigo-800 via-blue-900 to-black',
  night_cloudy: 'bg-gradient-to-b from-gray-700 via-gray-800 to-black',
  night_rainy: 'bg-gradient-to-b from-blue-900 to-black',
  night_stormy: 'bg-gradient-to-b from-gray-900 to-black',
  night_snowy: 'bg-gradient-to-b from-blue-800 via-blue-900 to-black',
  night_foggy: 'bg-gradient-to-b from-gray-800 to-black',
};

function LandingDisplay({ coordinates }) {
  const [weatherData, setWeatherData] = useState(null);
  const [countryName, setCountryName] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [weatherCondition, setWeatherCondition] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [backgroundClass, setBackgroundClass] = useState('');
  const [isDay, setIsDay] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [localTime, setLocalTime] = useState('');
  const [currentCoordinates, setCoordinates] = useState(coordinates || null);
  const [states, setStates] = useState([]); // New state for storing states of the country
  const [selectedState, setSelectedState] = useState('');
  const [region, setregion] = useState(''); // State for selected state
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch weather data from the API
  const fetchWeatherData = useCallback((latitude, longitude) => {
    const apiUrl = `https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${API}&q=${latitude},${longitude}&format=json&num_of_days=7&extra=isDayTime&date=yes&includelocation=yes&tp=12&showlocaltime=yes&lang=ar`;
    console.log("visited")
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (
          data?.data?.current_condition?.length > 0 &&
          data?.data?.nearest_area?.length > 0
        ) {
          const currentCondition = data.data.current_condition[0];
          const nearestArea = data.data.nearest_area[0];
          const forecast = data.data.weather;

          setWeatherData(data);
          setCityName(nearestArea.areaName[0].value);
          setCountryName(nearestArea.country[0].value);
          setTemperature(currentCondition.temp_C);
          setWindSpeed(currentCondition.windspeedKmph);
          setHumidity(currentCondition.humidity);
          setWeatherCondition(currentCondition.weatherDesc[0].value);
          setWeatherIcon(currentCondition.weatherIconUrl[0].value);
          setForecastData(forecast);
          setIsDay(currentCondition.isdaytime === 'yes');
          setBackgroundClass(
            getBackgroundClass(
              currentCondition.weatherDesc[0].value,
              currentCondition.isdaytime === 'yes'
            )
          );
          setLocalTime(data.data.time_zone[0].localtime.split(' ')[1]);

          // Fetch states when country name is set
          const country = Country.getAllCountries().find(
            (c) => c.name === nearestArea.country[0].value
          );
          if (country) {
            const countryStates = State.getStatesOfCountry(country.isoCode);
            setStates(countryStates);
          }
        } else {
          alert('City not found. Please try another search.');
        }
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        alert('An error occurred while fetching the data. Please try again.');
      });
  }, []);

  // Fetch user's geolocation
  useEffect(() => {
    if (!currentCoordinates) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
        },
        (error) => {
          console.error('Error fetching location:', error.message);
          alert('Unable to fetch your location. Please enable location services.');
        }
      );
    }
  }, [currentCoordinates]);

  // Fetch weather data based on coordinates or after navigating back
  useEffect(() => {
    if (currentCoordinates) {
      fetchWeatherData(currentCoordinates.latitude, currentCoordinates.longitude);
    }
  }, [currentCoordinates, fetchWeatherData]);

  // Trigger fetch when coming back from cityDashboard
  useEffect(() => {
    if (location.state?.from === 'cityDashboard' && currentCoordinates) {
      fetchWeatherData(currentCoordinates.latitude, currentCoordinates.longitude);
    }
  }, [location, currentCoordinates, fetchWeatherData]);

  // Get background class based on condition
  const getBackgroundClass = (condition, isDay) => {
    const normalizedCondition = condition.toLowerCase();
    if (!isDay) {
      if (normalizedCondition.includes('clear')) return conditionToGradientClass.night_clear;
      if (normalizedCondition.includes('cloudy')) return conditionToGradientClass.night_cloudy;
      if (normalizedCondition.includes('rain')) return conditionToGradientClass.night_rainy;
      if (normalizedCondition.includes('storm')) return conditionToGradientClass.night_stormy;
      if (normalizedCondition.includes('snow')) return conditionToGradientClass.night_snowy;
      if (normalizedCondition.includes('fog')) return conditionToGradientClass.night_foggy;
      return 'bg-gradient-to-b from-gray-900 to-black'; // Default for night
    }

    return conditionToGradientClass[normalizedCondition] || 'bg-gradient-to-b from-blue-400 to-gray-400';
  };

  // Handle search query for city or state
  const handleSearch = () => {
    if (searchQuery) {
      const state = states.find(s => s.name === searchQuery);
      if (state) {
        console.log("rere" + region);
        navigate(`/city/${region}`);
      } else {
        const apiUrl = `https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${API}&q=${searchQuery}&format=json&num_of_days=1`;

        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            if (data?.data?.error) {
              alert('City not found. Please try another search.');
            } else {
              navigate(`/city/${searchQuery}`);
            }
          })
          .catch((error) => {
            console.error('Error fetching city data:', error);
            alert('An error occurred while fetching the data. Please try again.');
          });
      }
    }
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Handle state selection from dropdown
  const handleStateSelect = (e) => {
    const state = e.target.value;
    const stated = states.find(s => s.name === state);
    const cityCoordinates = statescoor[stated.name];
    console.log("stae" + typeof (stated.name) + cityCoordinates)
    console.log(cityCoordinates != undefined);
    //console.log(cityCoordinates.latitude+" "+cityCoordinates.langitude);
    console.log(stated.latitude + " " + stated.longitude);
    let apiUrl;
    if (cityCoordinates != undefined) {
      apiUrl = `https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${API}&q=${cityCoordinates.latitude},${cityCoordinates.langitude}&format=json&num_of_days=7&extra=isDayTime&date=yes&includelocation=yes&tp=12&showlocaltime=yes&lang=ar`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (
            data?.data?.current_condition?.length > 0 &&
            data?.data?.nearest_area?.length > 0
          ) {
            const nearestArea = data.data.nearest_area[0];
            console.log("region" + nearestArea.areaName[0].value);
            setregion(nearestArea.areaName[0].value);
            navigate(`/city/${nearestArea.areaName[0].value}`);
          }
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
          alert('An error occurred while fetching the data. Please try again.');
        });
    } else {
      apiUrl = `https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${API}&q=${stated.latitude},${stated.longitude}&format=json&num_of_days=7&extra=isDayTime&date=yes&includelocation=yes&tp=12&showlocaltime=yes&lang=ar`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (
            data?.data?.current_condition?.length > 0 &&
            data?.data?.nearest_area?.length > 0
          ) {
            const nearestArea = data.data.nearest_area[0];
            console.log("region" + nearestArea.region[0].value);
            setregion(nearestArea.region[0].value);
            navigate(`/city/${nearestArea.region[0].value}`);
          }
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
          alert('An error occurred while fetching the data. Please try again.');
        });
    }

    setSelectedState(state);
  };

  // Handle Enter key press in search bar
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen transition-all duration-300 relative ${isDay ? '' : 'bg-black'}`}
      style={{
        backgroundImage: `url(${isDay ? dayBackgroundImage : nightBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className={`absolute inset-0 ${backgroundClass} ${isDay ? 'opacity-40' : 'opacity-60'}`}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80"></div>
      {currentCoordinates ? (
        <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-lg w-full lg:max-w-7xl z-10">
          {weatherData ? (
            <div className="flex flex-col text-white">
              {/* Weather Info */}
              <div className="flex justify-between items-center ">
                <div className="flex flex-col">
                  <div className="text-7xl font-bold">{cityName}</div>
                  <div className="text-3xl font-light mt-1">{countryName}</div>
                  <div className="text-lg mt-2">
                    {getDayName(new Date())} {new Date().toLocaleDateString()}
                  </div>
                  <div className="text-lg mt-2">{localTime}</div>
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex items-center mb-8">
                    {weatherIcon && (
                      <img
                        src={weatherIcon}
                        alt="Weather Icon"
                        className="w-16 h-16 mr-4 rounded-full"
                      />
                    )}
                    <div className="flex items-center">
                      <img
                        src={temperatureIcon}
                        alt="Temperature Icon"
                        className="w-10 h-10 mr-2"
                      />
                      <div className="text-7xl font-bold">{temperature}°</div>
                    </div>
                  </div>
                  <div className="flex space-x-6 text-sm">
                    <div className="flex items-center">
                      <img
                        src={windIcon}
                        alt="Wind Icon"
                        className="w-4 h-4 mr-1"
                      />
                      <span className="font-medium">Wind:</span> {windSpeed} km/h
                    </div>
                    <div className="flex items-center">
                      <img
                        src={humidityIcon}
                        alt="Humidity Icon"
                        className="w-4 h-4 mr-1"
                      />
                      <span className="font-medium">Humidity:</span> {humidity}%
                    </div>
                  </div>
                </div>
              </div>
             
              {/* Search Bar and States Dropdown */}
              <div className="flex justify-center rounded-l-lg  mb-8">
                <select
                  value={selectedState}
                  onChange={handleStateSelect}
                  className="rounded-l-lg bg-white bg-opacity-20 text-white focus:outline-none"
                >
                  <option value="">Select City</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.name} className='text-black'>
                      {state.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Search for a city "
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="px-4 py-2 bg-white  bg-opacity-20 text-white placeholder-white focus:outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 rounded-r-lg bg-white bg-opacity-20 text-white hover:bg-opacity-30 focus:outline-none"
                >
                  Search
                </button>
              </div>
               {/* Weather Condition */}
               <div className="text-center mb-8 mt-8">
                <div className="text-5xl font-bold">{weatherCondition}</div>
              </div>
              <Forecast forecastData={forecastData} />
            </div>
          ) : (
            <p className="text-lg">Loading weather data...</p>
          )}
        </div>
      ) : (
        <p className="text-lg">Loading coordinates...</p>
      )}
    </div>
  );
}

export default LandingDisplay;