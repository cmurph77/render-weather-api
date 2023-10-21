const { json } = require("express");

const apiKey = '9d54b4134840423050e9a3f21b40dc15'; // Replace with your OpenWeatherMap API key

function getCityLatLon(city) {
  return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`)
    .then((res) => res.json())
    .then((result) => {
        console.log(JSON.stringify(result, null, 3));
        const coords = {
        lat: result.coord.lat,
        lon: result.coord.lon,
        country: result.sys.country
      };
      return coords;
    });
}

async function main() {
  console.log("Hello World");
  try {
    const coords = await getCityLatLon('DUBLIN,ie');
    console.log(JSON.stringify(coords, null, 3));
  } catch (error) {
    console.error('Error fetching city coordinates:', error);
  }
}

main();