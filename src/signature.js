'use strict';
const conf = require('../conf');
const nodegit = require('nodegit');

var getSignature = function() {
  return nodegit.Signature.now(conf.GIT_AUTHOR, conf.GIT_EMAIL);
}

module.exports = {
  get : getSignature
}