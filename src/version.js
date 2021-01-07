'use strict';
const conf = require('../conf');
const fs = require('fs');
const Promise = require('promise');
const write = Promise.denodeify(fs.writeFile);
const colors = require('colors');
const exec = require('child_process').exec;

var getPackageJson = function(repo) {
  return repo.getHeadCommit().then(function(commit) {
    return commit.getEntry('package.json');
  })
  .then(function(entry) {
    return entry.getBlob();
  })
}

var setPackageJsonVersion = function(repo, minorVersion, patchVersion) {
  var completeVersion = `${conf.MAJOR_VERSION}.${minorVersion}.${patchVersion}`;

  return getPackageJson(repo)
  .then(function(blob) {
    var json = JSON.parse(blob.toString());
    json.version = completeVersion;
    return write('./clone/package.json', JSON.stringify(json, null, '  '));
  })
  .then(function() {
    console.log('New version set in package.json :'.green, completeVersion);
    return completeVersion;
  })
  .catch(function() {
    console.log('Error while setting package json version'.red, arguments);
  })
}

var bumpPatchVersion = function(repo) {
  return getPackageJson(repo)
  .then(function(blob) {
    var json = JSON.parse(blob.toString());
    var regex = /([0-9]+)\.([0-9]+)\.([0-9]+)/;
    var matches = json.version.match(regex);
    var minor = parseInt(matches[2], 10);
    var patch = parseInt(matches[3], 10) + 1;
    return setPackageJsonVersion(repo, minor, patch);
  })
}

const bumpMinorVersion = (repo) => {
  return getLastMinorVersion()
  .then(lastMinor => setPackageJsonVersion(repo, lastMinor + 1, 0))
}

const getLastMinorVersion = () => {
  return new Promise(resolve => {
    exec('npm show coveo-search-ui version', (error, stdout, stderr)=>{
      if(error) {
        console.log('Error while fetching last version of coveo-search-ui', error);
        process.exit(1);
      }
      console.log('Last official version of coveo-search-ui is ', stdout);
      const extracted = extractVersionMajorMinorPatch(stdout);
      resolve(extracted.minor);
    })
  })
}

const extractVersionMajorMinorPatch = (completeVersion) => {
  const regex = /([0-9]+)\.([0-9]+)\.([0-9]+)/;
  const matches = completeVersion.match(regex);
  return {
    major : parseInt(matches[1], 10),
    minor : parseInt(matches[2], 10),
    patch : parseInt(matches[3], 10)
  }
}

module.exports = {
  bumpPatchVersion,
  bumpMinorVersion,
}