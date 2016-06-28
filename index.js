'use strict';
const nodegit = require('nodegit');
const path = require('path');
const pathToCloneTo = path.resolve('./clone');
const NewRelease = require('./createNewReleaseBranch');

var branchToBuild = process.env.BRANCH_NAME;
if(!branchToBuild) {
  branchToBuild = 'version-testing-release-script'
}


nodegit.Clone(require('./conf').GIT_URL, pathToCloneTo)
  .then(function(repo) {
    return repo.fetch('origin', undefined, function(err) {
      if(err) {
        console.log(err);
        process.exit(1);
      }
      var branchExists = false;
      repo.getReference(`origin/${branchToBuild}`).then(function(ref) {
        branchExists = true;
      })
      .finally(function() {
        if(branchExists) {

        } else {
          NewRelease.create(repo, branchToBuild);
        }
      })
    })
  })