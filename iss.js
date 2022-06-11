const request = require('request');

// Makes a single API request to retrieve the user's IP address.
// Input:
// - A callback (to pass back an error or the IP string)
// Returns (via Callback):
// - An error, if any (nullable)
// - The IP address as a string (null if error)


const fetchMyIP = (callback) => {
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

const fetchCoordsByIP = (ip, callback) => {
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

/////////////////////////////////////////////////////


//Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
//Input:
//- An object with keys `latitude` and `longitude`
//- A callback (to pass back an error or the array of resulting data)
//Returns (via Callback):
//- An error, if any (nullable)
//- The fly over times as an array of objects (null if error). 

const fetchISSFlyOverTimes = (coords, callback) => {
  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS Flyovers for coordinates: ${body}`), null);
      return;
    }

    const issData = JSON.parse(body);
    const passTimes = issData.response;
    callback(null, passTimes);

  });
};

/////////////////////////////////////////////////////////

//Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
//Input:
//- A callback with an error or results.
//Returns (via Callback):
//- An error, if any (nullable)
//- The fly-over times as an array (null if error):
//[ { risetime: <number>, duration: <number> }, ... ]


const nextISSTimesForMyLocation = (callback) => {

  //call fetchMyIP
  fetchMyIP((error, ip) => {
    //check errors
    if (error) {
      return callback(null);
    }

    //call fetchCoordsByIP
    fetchCoordsByIP(ip, (error, coords) => {
      //check errors
      if (error) {
        return callback(null);
      }

      //fetchISSFlyOverTimes
      fetchISSFlyOverTimes(coords, (error, passTimes) => {
        //check errors
        if (error) {
          return callback(null);
        }

        //callback
        return callback(null, passTimes);
      });
    });
  });
};



module.exports = { nextISSTimesForMyLocation };