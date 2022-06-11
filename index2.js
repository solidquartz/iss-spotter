const { nextISSTimesForMyLocation } = require('./iss_promised');
const { printPassTimes } = require('./index');


//this function returns a promise, so call .then on its return value, which takes in a callback to accept the response body
// fetchMyIP()
//   .then(fetchCoordsByIP)
//   .then(fetchISSFlyOverTimes)
//   .then(body => console.log(body));

nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });