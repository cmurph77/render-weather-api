function unixTimeToReadableDate(unixTimestamp) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
    const timestampInMilliseconds = unixTimestamp * 1000;
    const date = new Date(timestampInMilliseconds);
  
    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    return `${dayOfWeek}, ${day} ${month} ${year}`;
  }
  
  // Example usage:
  const unixTimestamp = 1634782858; // Replace with your Unix timestamp
  const readableDate = unixTimeToReadableDate(unixTimestamp);
  console.log(readableDate);
  