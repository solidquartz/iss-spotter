const request = require('request-promise-native');

//returns promise of request for IP data as JSON string
const fetchMyIP = function() {

  return request('https://api.ipify.org?format=json');

};


//input: JSON string containing IP address
//returns: promise of request for lat/lon (JSON)
const fetchCoordsByIP = function(body) {

  const ip = JSON.parse(body).ip;
  return request(`https://freegeoip.app/json/${ip}`);

};

//input: JSON body containing geo data response
//returns: promise of request for fly over data (JSON)
const fetchISSFlyOverTimes = function(body) {

  const { latitude, longitude } = JSON.parse(body);
  const url = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`;
  return request(url);
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};


module.exports = { nextISSTimesForMyLocation };