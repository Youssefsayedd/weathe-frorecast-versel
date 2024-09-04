import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingDisplay from './Screens/LandingDisplay';
import CityWeatherDashboard from './Screens/CityWeatherDashboard';

function AppRoutes({coordinates}) {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingDisplay coordinates={coordinates} />} />
        <Route path="/city/:cityName" element={<CityWeatherDashboard />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;