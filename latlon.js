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
  
  // Example usage:
  const city = 'London'; // Replace with the city you want to get coordinates for
  
  getCityLatLon(city)
    .then(coords => {
      console.log(coords);
    })
    .catch(error => {
      console.error(error);
    });
  