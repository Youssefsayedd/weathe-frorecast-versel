import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, BarController, BarElement, Title, Tooltip } from 'chart.js';
import { FaArrowLeft } from 'react-icons/fa';
import windIcon from '../assets/weatheIcons/wind (2).png';
import humidityIcon from '../assets/weatheIcons/water-drop.png';
import temperatureIcon from '../assets/weatheIcons/hot (1).png';
import visibilityIcon from '../assets/weatheIcons/watch.png';
import cloudIcon from '../assets/weatheIcons/clouds.png';
import feelsLikeIcon from '../assets/weatheIcons/thermometer.png';
import dayBackgroundImage from '../assets/backGrounds/sky.png';
import nightBackgroundImage from '../assets/backGrounds/pngegg.png';
import ClimateLineChart from '../Components/Charts/LineChart';
import HumidityChart from '../Components/Charts/HumidityChart';
import UVChart from '../Components/Charts/UVChart';
import DisplaySkeleton from '../Components/SekeltonUI/DisplaySkeleton';
import { API } from '../config';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, BarController, BarElement, Title, Tooltip);

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
  'partly cloudy': 'bg-gradient-to-b from-blue-200 to-gray-200',
  night_clear: 'bg-gradient-to-b from-indigo-800 via-blue-900 to-black',
  night_cloudy: 'bg-gradient-to-b from-gray-700 via-gray-800 to-black',
  night_rainy: 'bg-gradient-to-b from-blue-900 to-black',
  night_stormy: 'bg-gradient-to-b from-gray-900 to-black',
  night_snowy: 'bg-gradient-to-b from-blue-800 via-blue-900 to-black',
  night_foggy: 'bg-gradient-to-b from-gray-800 to-black',
};

function CityWeatherDashboard() {
  const { cityName } = useParams();
  const [weatherCondition, setWeatherCondition] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [climateData, setClimateData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [backgroundClass, setBackgroundClass] = useState('');
  const [isDay, setIsDay] = useState(true);
  const temperatureChartRef = useRef(null);
  const windChartRef = useRef(null);
  const temperatureChartInstance = useRef(null);
  const windChartInstance = useRef(null);
  const navigate=useNavigate();

  useEffect(() => {
    fetchWeatherData(cityName);
  }, [cityName]);

  const fetchWeatherData = (city) => {
    const apiUrl = `https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${API}&q=${city}&format=json&num_of_days=5&extra=localObsTime,isDayTime,utcDateTime&fx=yes&cc=yes&mca=yes&includelocation=yes&show_comments=yes&tp=3&showlocaltime=yes&lang=ar&alerts=yes&aqi=yes`;
    console.log("city"+city)

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
        const currentCondition = data?.data?.current_condition?.[0];
        if (currentCondition) {
          setIsDay(currentCondition.isdaytime === 'yes');
          setWeatherCondition(currentCondition.weatherDesc[0].value);
          setWeather(currentCondition.weatherDesc[0].value);
          setBackgroundClass(getBackgroundClass(currentCondition.weatherDesc?.[0]?.value, currentCondition.isdaytime === 'yes'));
        }

        const climateAverages = data?.data?.ClimateAverages[0]?.month || [];
        setClimateData(climateAverages);

        const hourlyData = data?.data?.weather?.[0]?.hourly || [];
        setHourlyData(hourlyData);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  };

  const getBackgroundClass = (condition, isDay) => {
    const normalizedCondition = condition?.toLowerCase();
    if (!isDay) {
      if (normalizedCondition.includes('clear')) return conditionToGradientClass.night_clear;
      if (normalizedCondition.includes('cloudy')) return conditionToGradientClass.night_cloudy;
      if (normalizedCondition.includes('rain')) return conditionToGradientClass.night_rainy;
      if (normalizedCondition.includes('storm')) return conditionToGradientClass.night_stormy;
      if (normalizedCondition.includes('snow')) return conditionToGradientClass.night_snowy;
      if (normalizedCondition.includes('fog')) return conditionToGradientClass.night_foggy;
      return 'bg-gradient-to-b from-gray-900 to-black'; 
    }

    return conditionToGradientClass[normalizedCondition] || 'bg-gradient-to-b from-blue-400 to-gray-400';
  };

  useEffect(() => {
    if (hourlyData.length > 0 && temperatureChartRef.current) {
      if (temperatureChartInstance.current) {
        temperatureChartInstance.current.destroy();
      }

      const ctx = temperatureChartRef.current.getContext('2d');
      temperatureChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: hourlyData.slice(1).map(hour => `${hour.time.slice(0, -2)}:00`),
          datasets: [{
            label: 'Temperature (°C)',
            data: hourlyData.slice(1).map(hour => hour.tempC),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
          }],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Time',
                color: 'white',
              },
              ticks: {
                color: 'white',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Temperature (°C)',
                color: 'white',
              },
              ticks: {
                color: 'white',
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  const hour = hourlyData[tooltipItem.dataIndex + 1];
                  setWeather(hour.weatherDesc[0].value);
                  return `Temp: ${hour.tempC}°C, Condition: ${hour.weatherDesc[0].value}`;
                }
              }
            }
          },
          maintainAspectRatio: false,
          responsive: true,
        },
      });
    }
  }, [hourlyData]);

  useEffect(() => {
    if (hourlyData.length > 0 && windChartRef.current) {
      if (windChartInstance.current) {
        windChartInstance.current.destroy();
      }

      const ctx = windChartRef.current.getContext('2d');
      windChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: hourlyData.slice(1).map(hour => `${hour.time.slice(0, -2)}:00`),
          datasets: [{
            label: 'Wind Speed (km/h)',
            data: hourlyData.slice(1).map(hour => hour.windspeedKmph),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          }],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Time',
                color: 'white',
              },
              ticks: {
                color: 'white',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Wind Speed (km/h)',
                color: 'white',
              },
              ticks: {
                color: 'white',
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  const hour = hourlyData[tooltipItem.dataIndex + 1];
                  return `Wind: ${hour.windspeedKmph} km/h`;
                }
              }
            }
          },
          maintainAspectRatio: false,
          responsive: true,
        },
      });
    }
  }, [hourlyData]);

  if (!weatherData) {
    return <DisplaySkeleton/>;
  }

  const currentCondition = weatherData?.data?.current_condition?.[0];
  const nearestArea = weatherData?.data?.nearest_area?.[0];
  const localTime = weatherData?.data?.time_zone?.[0]?.localtime;
  const localTimeWithoutDate = localTime ? localTime.split(' ')[1] : '';
  const weathercondition = currentCondition?.weatherDesc?.[0]?.value;
  const weatherIcon = currentCondition?.weatherIconUrl?.[0]?.value;

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
      <div className={`absolute inset-0 ${backgroundClass} opacity-60`}></div> 
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div> 
      <button
        onClick={() => navigate(-1)} // Use navigate to go back
        className="absolute top-4 left-4 bg-white bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 transition-all"
        aria-label="Go back"
      >
        <FaArrowLeft className="text-white w-6 h-6" />
      </button>
      <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-lg w-full lg:max-w-7xl z-10">
        <div className="flex flex-col text-white space-y-6">
          <div className="absolute top-4 right-4 mt-12 mr-12 flex items-center space-x-7">
            <img src={weatherIcon} alt="Weather Icon" className="w-12 h-12 rounded-full" />
            <div className="text-4xl font-san antialiased font-semibold">{weather}</div>
          </div>
          
          <div className="text-center mb-8">
            <div className="text-4xl md:text-7xl font-bold">{cityName}</div>
            <div className="text-2xl md:text-3xl font-light mt-1">{nearestArea?.country?.[0]?.value}</div>
            <div className="text-lg mt-2">{new Date().toLocaleDateString()}</div>
            <div className="text-lg mt-2">City Local Time: {localTimeWithoutDate}</div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="flex flex-col items-center p-6 bg-white bg-opacity-20 rounded-lg">
              <img src={temperatureIcon} alt="Temperature Icon" className="w-10 md:w-12 h-10 md:h-12 mb-3" />
              <div className="text-2xl md:text-3xl font-bold">{currentCondition?.temp_C}°</div>
              <div className="text-sm md:text-lg">Temperature</div>
            </div>
            <div className="flex flex-col items-center p-6 bg-white bg-opacity-20 rounded-lg">
              <img src={windIcon} alt="Wind Icon" className="w-10 md:w-12 h-10 md:h-12 mb-3" />
              <div className="text-md md:text-lg font-medium">Wind: {currentCondition?.windspeedKmph} km/h</div>
            </div>
            <div className="flex flex-col items-center p-6 bg-white bg-opacity-20 rounded-lg">
              <img src={humidityIcon} alt="Humidity Icon" className="w-10 md:w-12 h-10 md:h-12 mb-3" />
              <div className="text-md md:text-lg font-medium">Humidity: {currentCondition?.humidity}%</div>
            </div>
            <div className="flex flex-col items-center p-6 bg-white bg-opacity-20 rounded-lg">
              <img src={visibilityIcon} alt="Visibility Icon" className="w-10 md:w-12 h-10 md:h-12 mb-3" />
              <div className="text-md md:text-lg font-medium">Visibility: {currentCondition?.visibility} km</div>
            </div>
            <div className="flex flex-col items-center p-6 bg-white bg-opacity-20 rounded-lg">
              <img src={cloudIcon} alt="Cloud Cover Icon" className="w-10 md:w-12 h-10 md:h-12 mb-3" />
              <div className="text-md md:text-lg font-medium">Cloud Cover: {currentCondition?.cloudcover}%</div>
            </div>
            <div className="flex flex-col items-center p-6 bg-white bg-opacity-20 rounded-lg">
              <img src={feelsLikeIcon} alt="Feels Like Icon" className="w-10 md:w-12 h-10 md:h-12 mb-3" />
              <div className="text-md md:text-lg font-medium">Feels Like: {currentCondition?.FeelsLikeC}°C</div>
            </div>
          </div>

          {/* Climate and Hourly Data */}
          <div className="mt-8 w-full">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Monthly Climate Averages</h2>
            <ClimateLineChart data={climateData} />
          </div>

          <div className="mt-8 w-full h-64">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Hourly Temperature</h2>
            <canvas ref={temperatureChartRef} className="w-full h-full"></canvas>
          </div>

          <div className="mt-8 w-full h-64">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Wind Speed</h2>
            <canvas ref={windChartRef} className="w-full h-full"></canvas>
          </div>
          
          {/* Humidity and UV Charts */}
          <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 mt-7 text-white">Humidity Chart</h2>
              <HumidityChart data={hourlyData} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 mt-7 text-white">UV Index Chart</h2>
              <UVChart data={hourlyData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CityWeatherDashboard;
