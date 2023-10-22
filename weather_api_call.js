
const apiKey = '9d54b4134840423050e9a3f21b40dc15'; // Personal OpenWeatherMap API key

/**
 * 
 * @brief this function takes a city as a parameter and makes call to api to get weather forcast for that city
 * 
 * @param {*} city the name of the city that you want weather data for 
 * @returns a json obkect containing all relevant weather data
 */
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
/**
 * @brief gets the coords and country of the city 
 * 
 * @param {*} city 
 * @returns json object with lat, lon and country that the city is in
 */
async function getCityLatLonNew(city) {
  try {
    const fetchModule = await import('node-fetch');
    const fetch = fetchModule.default;

    const apiKey = '9d54b4134840423050e9a3f21b40dc15'; // OpenWeatherMap API key

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // create json object with lat,lon as well as country 
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
    "bring_umbrella": false,
    "lon": raw_data.lon,
    "lat": raw_data.lat,
    days: {}
  };
  const days = {};

  // populate the forcast data points for the next 6 days. ( today + next 5)
  for (let i = 1; i <= 6; i++) {
    const type = getCategorization(raw_data.daily[i - 1].temp.day)
    const date = unixTimeToReadableDate(raw_data.daily[i - 1].dt)
    const rainfall_level = raw_data.daily[i - 1].rain;
    const bring_umbrella = rainfall_level && rainfall_level > 0; // Check if rainfall_level is present and greater than 0
    days[`day_${i}`] = {
        "unix_dt": raw_data.daily[i - 1].dt,
        "formated_date" : date,
        "temp": raw_data.daily[i - 1].temp.day,
        "rainfall_level": rainfall_level,
        "windspeed": raw_data.daily[i - 1].wind_speed,
       "weather_type": type,
       "wear_mask" : null
    };
    if(bring_umbrella) forecast.bring_umbrella = true;
  }
  forecast.days = days;

  return forecast;

}

/**
 * @brief - This function returns the category that the temperature falls into COLD, MILD or HOT
 * 
 * @param {*} temp - The temperature to categorize. 
 * @returns The category that the temperature falls into COLD, MILD or HOT
 */
function getCategorization(temp){
  if(temp<13){
      return 'COLD'
  }else if(temp>=13 && temp <=23) {
      return 'MILD'
  } else if(temp>13){
      return 'HOT'
  }
}

/**
 * @brief Converts the unix timestamp into a user readable data format
 * 
 * @param {} unixTimestamp this is the unix timestamp 
 * 
 * @returns timestamp in the form DATE - DAY - MONTH
 */
function unixTimeToReadableDate(unixTimestamp) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const timestampInMilliseconds = unixTimestamp * 1000;
  const date = new Date(timestampInMilliseconds);

  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayOfWeek}, ${day} ${month}`;
}

module.exports = { getWeatherForecastDaily }
