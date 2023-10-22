const express = require('express');  //import express to create api endpoints

//const { json } = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const { getWeatherForecastDaily } = require('./weather_api_call.js'); // import js file that handled retrieving weather data

const app = express();
const PORT = process.env.PORT || 8081;  // expose the port for the api to listen on

app.use(cors()); // enable CORS for all routes


async function getPolution(lat, lon) {
  try {
    const fetchModule = await import('node-fetch');
    const fetch = fetchModule.default;

    const apiKey = '9d54b4134840423050e9a3f21b40dc15'; // Replace with your OpenWeatherMap API key
    const apiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(JSON.stringify(data, 0, 3));
    const coValue = data['list'][0]['components']['co'];
    const pm2 = data['list'][0]['components']['pm2_5'];

    return coValue;
  } catch (error) {
    throw error;
  }
}

const lat = 53.344;
const lon = -6.2672;

(async () => {
  try {
    const val = await getPolution(lat, lon);
    console.log("value", val);
  } catch (error) {
    console.error("Error:", error);
  }
})();
