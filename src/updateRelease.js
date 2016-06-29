'use strict';
const version = require('./version');
const tag = require('./tag');
const commit = require('./commit');
const push = require('./push');
const colors = require('colors');
const signature = require('./signature');

var createBranch = function(repo, branchName) {
  return repo.getReference(`origin/${branchName}`)
  .then(function(ref) {
    return repo.getReferenceCommit(ref);
  })
  .then(function(commit) {
    return repo.createBranch(branchName, commit, 0, repo.defaultSignature(), `Creating new branch branchName`).then(function() {
      return repo.checkoutBranch(branchName);
    })
  })
  .catch(function() {
    console.log('Error found while creating branch'.red, arguments);
  })
}

module.exports = {
  update : function(repo, branchName) {
    var versionBeingBuilt; 
    return createBranch(repo, branchName)
    .then(function() {
      return version.bumpPatchVersion(repo);
    })
    .then(function(versionBuilt) {
      versionBeingBuilt = versionBuilt;
      return commit.commit(repo);
    })
    .then(function() {
      return tag.tag(repo, versionBeingBuilt);
    })
    .then(function() {
      return push.push(repo, branchName, versionBeingBuilt);
    })
    .catch(function() {
      console.log('Error happened while updating release'.red)
    })
  }
}
