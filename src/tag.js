'use strict';
const colors = require('colors');
const conf = require('../conf');
const nodegit = require('nodegit');

var tag = function(repo, tagName) {

  return repo.getHeadCommit()
  .then(function(commit) {
    return commit.sha();
  })
  .then(function(sha) {
    var oid = nodegit.Oid.fromString(sha);
    return repo.createTag(oid, tagName, conf.GIT_MESSAGE);
  })
  .then(function() {
    console.log('Tag created : '.green, tagName);
  })
  .catch(function() {
    console.log('Error found while tagging the release'.red, arguments)
  })
}

module.exports = {
  tag : tag
}