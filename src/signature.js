'use strict';
const conf = require('../conf');
const nodegit = require('nodegit');

var getSignature = function() {
  return nodegit.Signature.create(conf.GIT_AUTHOR, conf.GIT_EMAIL, new Date().getTime(), new Date().getTimezoneOffset());
}

module.exports = {
  get : getSignature
}