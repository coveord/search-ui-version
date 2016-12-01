'use strict';
const nodegit = require('nodegit');
const path = require('path');
const pathToCloneTo = path.resolve('./clone');
const newRelease = require('./src/createNewRelease');
const updateRelease = require('./src/updateRelease');
const isOfficial = require('./src/isOfficial');
const colors = require('colors');

var branchToBuild = process.env.BRANCH_NAME;

if(! branchToBuild) {
  console.log('No $BRANCH_NAME set. Did you forget to configure the travis job correctly ?'.red);
  process.exit(1);
} else {
  console.log(`Branch version detected : ${branchToBuild}`.green);
  if(isOfficial()) {
    console.log('!!! Doing an official build !!!'.rainbow);
  } else {
    console.log('Doing a beta build'.green);
  }
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
      .catch(function() {
      })
      .finally(function() {
        if(branchExists) {
          console.log('Branch already exists : updating release'.green);
          return updateRelease.update(repo, branchToBuild).then(function() {
            console.log('Release updated'.green);
            process.exit(0);
          });
        } else {
          console.log('Branch does not exists : creating new release'.green);
          return newRelease.create(repo, branchToBuild).then(function() {
            console.log('New release created'.green);
            process.exit(0);
          });
        }
      })
    })
  })