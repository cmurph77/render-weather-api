const express = require('express');  //import express to create api endpoints

//const { json } = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const { getWeatherForecastDaily } = require('./weather_api_call.js'); // import js file that handled retrieving weather data

const app = express();
const PORT = process.env.PORT || 8081;  // expose the port for the api to listen on

app.use(cors()); // enable CORS for all routes



// const sample_data= {
//   "city": "Sample Data City",
//   "lon": 1000,
//   "lat": 1000,
//   "days" : {
//       "day_one" : {
//           "unix_dt": 100000000,
//           "formated_date": "1.12.1999",
//           "temp": 100 ,
//           "rainfall_level": 12,
//           "windspeed": 20 ,
//           "weather_type": "COLD",
//           "wear_mask" : true
//       },
//       "day_two" :{
//           "unix_dt": 20000000,
//           "formated_date": "2.12.1999",
//           "temp": 23.4 ,
//           "rainfall_level": 12,
//           "windspeed": 20 ,
//           "weather_type": "COLD",
//           "wear_mask" : true
//       },
//       "day_three": {
//           "unix_dt": 3000000,
//           "formated_date": "3.12.1999",
//           "temp": 23.4 ,
//           "rainfall_level": 12,
//           "windspeed": 20 ,
//           "weather_type": "COLD",
//           "wear_mask" : true
//       },
//       "day_four":{
//           "unix_dt": 4000000,
//           "formated_date": "4.12.1999",
//           "temp": 23.4 ,
//           "rainfall_level": 12,
//           "windspeed": 20 ,
//           "weather_type": "COLD",
//           "wear_mask" : true
//       },
//       "day_five": {
//           "unix_dt": 5000000,
//           "formated_date": "5.12.1999",
//           "temp": 23.4 ,
//           "rainfall_level": 12,
//           "windspeed": 20 ,
//           "weather_type": "COLD",
//           "wear_mask" : true
//       }
//   }
// }
           


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

// app.get('/', async (req, res) => {
//   try {
//     const reply = {
//       message :  'great success'
//     }
    
//     res.send(reply);
//   } 
//   catch (error) {
//     res.status(400).send('Error while getting list of repositories');
//   }
// });

// app.get('/sample', async (req, res) => {
//   try {
//     const reply = {
//       message :  'great success'
//     }
//     console.log("RECIEVED SAMPLE DATA REQUEST")
    
//     res.send(sample_data);
//   } 
//   catch (error) {
//     res.status(400).send('Error while getting list of repositories');
//   }
// });

// app.get('/sample/:input', async (req, res) => {
//   const input = req.params.input;
//   try {

//     console.log("RECIEVED SAMPLE DATA REQUEST")
//     sample_data.city = input;
//     res.send(sample_data);
//   } 
//   catch (error) {
//     res.status(400).send('Error while fetching data');
//   }
// });

app.get('/polution/:lat/:lon', async (req, res) => { 
  const lat = req.params.lat;  
  const lon = req.params.lon;  
  console.log("\nRECEIVED POLUTION REQUEST FOR : ( ",lat, ", ", lon, ")");

  const apiKey = '9d54b4134840423050e9a3f21b40dc15'; // Replace with your OpenWeatherMap API key
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
