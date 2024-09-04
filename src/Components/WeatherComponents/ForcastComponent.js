import React from 'react';

function Forecast({ forecastData }) {
  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {forecastData.slice(1).map((day, index) => (
        <div
          key={index}
          className="text-center p-4 rounded-lg bg-white bg-opacity-10 shadow backdrop-blur-sm"
        >
          <div className="text-lg font-medium">
            {getDayName(day.date)}
          </div>
          <div className="text-2xl font-bold">{day.avgtempC}°</div>
          <div className="text-md">
            {day.maxtempC}° / {day.mintempC}°
          </div>
          <div className="flex items-center justify-center text-sm">
            {day.hourly[0].weatherIconUrl && (
              <img
                src={day.hourly[0].weatherIconUrl[0].value}
                alt="Weather Icon"
                className="w-6 h-6 mr-2 rounded-full"
              />
            )}
            {day.hourly[0].weatherDesc[0].value}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Forecast;