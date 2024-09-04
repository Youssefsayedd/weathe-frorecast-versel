import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingDisplay from './Screens/LandingDisplay';
import CityWeatherDashboard from './Screens/CityWeatherDashboard';

function App() {
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });
      },
      (error) => {
        console.error('Error fetching location:', error.message);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.error("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            console.error("The request to get user location timed out.");
            break;
          case error.UNKNOWN_ERROR:
            console.error("An unknown error occurred.");
            break;
        }
      }
    );
  }, []);
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingDisplay coordinates={coordinates} />} />
        <Route path="/city/:cityName" element={<CityWeatherDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;