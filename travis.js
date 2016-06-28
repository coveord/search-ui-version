const TravisCIAPI = require('travis-ci');
var travis = new TravisCIAPI({
  version : '2.0.0',
  headers : {
    'user-agent' : 'Coveo search-ui version'
  }
})

module.exports = travis;