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
        console.error('Error fetching location:', error);
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