const express = require('express');  //import express to create api endpoints
const cors = require('cors'); // Import the cors middleware
const { getWeatherForecastDaily } = require('./weather_api_call.js'); // import js file that handled retrieving weather data

const app = express();
const PORT = process.env.PORT || 8081;  // expose the port for the api to listen on

app.use(cors()); // enable CORS for all routes

      


/**
 * 
 * @param {*} city The name of the city that weather data is wanted for
 * @returns json object with all relevent weather adn location data.
 */
async function getdata(city) {
  try {
    const result = await getWeatherForecastDaily(city);
    // console.log(JSON.stringify(result, null, 4));
    return result;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;  // Rethrow the error to be caught by the caller
  }
}


/**
 * @brief rerturns the current polution data for a lat and long
 */
app.get('/polution/:lat/:lon', async (req, res) => { 
  const lat = req.params.lat;  
  const lon = req.params.lon;  
  console.log("\nRECEIVED POLUTION REQUEST FOR : ( ",lat, ", ", lon, ")");

  const apiKey = '9d54b4134840423050e9a3f21b40dc15'; //OpenWeatherMap API key
  const apiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  try {
    // call the api
    try {
      const fetch = await import('node-fetch'); // Use dynamic import
      const response = await fetch.default(apiUrl); // Use .default to access the imported module
      console.log('Response Status:', response.status); // Log the response status
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

    result = await response.json();
    console.log(result)
    } 
    catch (error) {
      console.error('Error fetching weather forecast data:', error);
    }
    const coValue = result['list'][0]['components']['co'];
    const pm2 = result['list'][0]['components']['pm2_5'];

    const polution_data = {
      co : coValue,
      pm2_5: pm2
    }

    res.send(polution_data);
  } 
  catch (error) {
    res.status(400).send('Error while fetching data');
  }


 });


/**
 * @brief This is a GET enpoint that takes the city name as an input and return the weather data for the city
 */
app.get('/weather/:input', async (req, res) => {
  const input = req.params.input; // extract the city from the get call
  console.log("\nReceived weather forecast request for City:");
  console.log(input);

  try {
    const result = await getdata(input);  // pass the city name to get data and await json object response - this is an object with relevant weather data
    console.log(result)
    res.json(result);  // Use res.json to send JSON response
  } catch (error) { 
    res.status(500).json({ error: 'Error fetching weather data' }); // handle any error and log them
  }
});

// set the API listening on the defined port
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
