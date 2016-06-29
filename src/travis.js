'use strict';
const TravisCIAPI = require('travis-ci');
const conf = require('../conf.js');

var client = new TravisCIAPI({
  version : '2.0.0',
  headers : {
    'user-agent' : 'Coveo search-ui version'
  }
})

var getLastBuildNumber = function() {
  return new Promise(function(resolve, reject) {
    client.repos(conf.TRAVIS_REPO).get(function(err, res) {
      if(err) {
        console.log('Error while getting build number from travis : ', err.red);
        reject(err);
      }
      var buildNumber = parseInt(res.repo.last_build_number, 10) + 1;
      resolve(buildNumber)
    })
  })
}

module.exports = { 
  client : client,
  getLastBuildNumber: getLastBuildNumber
} 