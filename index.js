const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8081;

const { getWeatherForecastDaily } = require('./weather_api_call.js');


const sample_data= {
  "city": "Sample Data City",
  "lon": 1000,
  "lat": 1000,
  "days" : {
      "day_one" : {
          "unix_dt": 100000000,
          "formated_date": "1.12.2023",
          "temp": 100 ,
          "rainfall_level": 12,
          "windspeed": 20 ,
          "weather_type": "COLD",
          "wear_mask" : true
      },
      "day_two" :{
          "unix_dt": 20000000,
          "formated_date": "2.12.2023",
          "temp": 23.4 ,
          "rainfall_level": 12,
          "windspeed": 20 ,
          "weather_type": "COLD",
          "wear_mask" : true
      },
      "day_three": {
          "unix_dt": 3000000,
          "formated_date": "3.12.2023",
          "temp": 23.4 ,
          "rainfall_level": 12,
          "windspeed": 20 ,
          "weather_type": "COLD",
          "wear_mask" : true
      },
      "day_four":{
          "unix_dt": 4000000,
          "formated_date": "4.12.2023",
          "temp": 23.4 ,
          "rainfall_level": 12,
          "windspeed": 20 ,
          "weather_type": "COLD",
          "wear_mask" : true
      },
      "day_five": {
          "unix_dt": 5000000,
          "formated_date": "5.12.2023",
          "temp": 23.4 ,
          "rainfall_level": 12,
          "windspeed": 20 ,
          "weather_type": "COLD",
          "wear_mask" : true
      }
  }
}
           


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

app.get('/', async (req, res) => {
  const username = req.query.username || 'myogeshchavan97';
  try {
    const reply = {
      message :  'great success'
    }
    
    res.send(reply);
  } 
  catch (error) {
    res.status(400).send('Error while getting list of repositories');
  }
});

app.get('/sample', async (req, res) => {
  try {
    const reply = {
      message :  'great success'
    }
    
    res.send(sample_data);
  } 
  catch (error) {
    res.status(400).send('Error while getting list of repositories');
  }
});

app.get('/weather/:input', async (req, res) => {
  const input = req.params.input;
  console.log("\nReceived weather forecast request for City:");
  console.log(input);

  try {
    const result = await getdata(input);  // Await the asynchronous function
    //console.log(JSON.stringify(result, null, 4));
    res.send(result);  // Use res.json to send JSON response
  } 
  catch (error) {
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
