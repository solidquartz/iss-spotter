const request = require('request');

// Makes a single API request to retrieve the user's IP address.
// Input:
// - A callback (to pass back an error or the IP string)
// Returns (via Callback):
// - An error, if any (nullable)
// - The IP address as a string (null if error)


const fetchMyIP = function(callback) {
  request(`https://api.ipify.org?format=json`, (error, response, body) => {

    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      return callback(error, null);
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ip = JSON.parse(body);
    return callback(null, ip.ip);

  });

};




////////////////////////////////////////////

//Makes a single API request to retrieve the lat/lng for a given IPv4 address.
//Input:
//- The ip (ipv4) address (string)
//- A callback (to pass back an error or the lat/lng object)
//Returns (via Callback):
//- An error, if any (nullable)
//- The lat and lng as an object (null if error).

const fetchCoordsByIP = function(ip, callback) {
  request(`https://api.ipbase.com/v2/info?apikey=2JLtDwYebipZyqSKsActC0u0rkhoRxEhpax7NSWL&ip=${ip}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }

    const geoInfo = JSON.parse(body);
    const coords = {
      latitude: geoInfo.data.location.latitude,
      longitude: geoInfo.data.location.longitude
    };
    
    callback(null, coords);

  });
};

module.exports = { fetchMyIP, fetchCoordsByIP };