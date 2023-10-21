
const apiKey = '9d54b4134840423050e9a3f21b40dc15'; // Replace with your OpenWeatherMap API key

// this function takes a city as a parameter and makes call to api to get weather forcast for that city
async function getWeatherForecastDaily(city) {


  // get the coords for the city in question
  const coords = await getCityLatLonNew(city)
  const lat = coords.lat;
  const lon = coords.lon;
  const country = coords.country;


  // call the api
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,hourly,minutely,alerts&units=metric&appid=${apiKey}`;
  let forecastData;

  try {
    const fetch = await import('node-fetch'); // Use dynamic import
    const response = await fetch.default(apiUrl); // Use .default to access the imported module
    console.log('Response Status:', response.status); // Log the response status

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

  forecastData = await response.json();
  console.log(forecastData)
  } 
  catch (error) {
    console.error('Error fetching weather forecast data:', error);
  }
  // clean the data and create an object with desired data points
  const cleaned_data = createForcastObj(forecastData);
  
  // set the name of the city and country in the data
  cleaned_data.city = city;
  cleaned_data.country = country;

  // return the data
  return cleaned_data;
}

async function getCityLatLonNew(city) {
  try {
    const fetchModule = await import('node-fetch');
    const fetch = fetchModule.default;
    const apiKey = '9d54b4134840423050e9a3f21b40dc15'; // Replace with your OpenWeatherMap API key

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const coords = {
      lat: data.coord.lat,
      lon: data.coord.lon,
      country: data.sys.country
    };

    return coords;
  } catch (error) {
    throw error;
  }
}


// cleand up the forecast data
function createForcastObj(raw_data){
  const forecast = {
    "city": "blank",
    //"country": "blank",
    "lon": raw_data.lon,
    "lat": raw_data.lat,
    days: {}
  };
  const days = {};

  // populate the forcast data points for the next 6 days. ( today + next 5)
  for (let i = 1; i <= 6; i++) {
    const type = getCategorization(raw_data.daily[i - 1].temp.day)
    days[`day_${i}`] = {
        "unix_dt": raw_data.daily[i - 1].dt, // TODO -> convert this into a presentable date format
        "formated_date" : "Incomplete ",
        "temp": raw_data.daily[i - 1].temp.day,
        "rainfall_level": raw_data.daily[i - 1].rain,
        "windspeed": raw_data.daily[i - 1].wind_speed,
       "weather_type": type,
       "wear_mask" : null
    };
  }
  forecast.days = days;

  return forecast;

}

function getCategorization(temp){
  if(temp<13){
      return 'COLD'
  }else if(temp>=13 && temp <=23) {
      return 'MILD'
  } else if(temp>13){
      return 'HOT'
  }
}

module.exports = { getWeatherForecastDaily }
