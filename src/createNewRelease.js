'use strict';
const travis = require('./travis');
const colors = require('colors');
const version = require('./version');
const tag = require('./tag');
const commit = require('./commit');
const push = require('./push');
const signature = require('./signature');

var createBranch = function(repo, branchName) {
  return repo.getMasterCommit()
  .then(function(commit) {
    return repo.createBranch(branchName, commit, 0, signature.get(), `Creating new branch branchName`).then(function() {
      return repo.checkoutBranch(branchName);
    })
  })
  .catch(function() {
    console.log('Error found while creating branch'.red, arguments);
  })
}

module.exports = {
  create : function(repo, branchName) {
    var versionBeingBuilt;
    return createBranch(repo, branchName)
    .then(function() {
      return travis.getLastBuildNumber()
      .then(function(buildNumber) {
        return version.setVersion(repo, buildNumber, 0);
      })
      .then(function(versionNumber) {
        versionBeingBuilt = versionNumber;
        return versionBeingBuilt;
      })
    })
    .then(function() {
      return commit.commit(repo);
    })
    .then(function() {
      return tag.tag(repo, versionBeingBuilt);
    })
    .then(function() {
      return push.push(repo, branchName, versionBeingBuilt);
    })
  }
}
