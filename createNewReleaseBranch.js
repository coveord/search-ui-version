'use strict';
const nodegit = require('nodegit');
const travis = require('./travis');
const Promise = require('promise');
const fs = require('fs');
const write = Promise.denodeify(fs.writeFile);
const colors = require('colors');
const username = process.env.USER_NAME || 'none';
const password = process.env.PASSWORD || 'none';
const conf = require('./conf');

if(!username) {
  console.log('No username provided in $USER_NAME'.red);
  process.exit(1);
}

if(!password) {
  console.log('No password provided in $PASSWORD'.red);
  process.exit(1);
}


var getSignature = function() {
  return nodegit.Signature.create(conf.GIT_AUTHOR, conf.GIT_EMAIL, new Date().getTime(), new Date().getTimezoneOffset());
}

var getLastBuildNumber = function() {
  return new Promise(function(resolve, reject) {
    travis.repos(conf.TRAVIS_REPO).get(function(err, res) {
      if(err) {
        console.log(err.red);
        reject(err);
      }
      var buildNumber = parseInt(res.repo.last_build_number, 10) + 1;
      resolve(buildNumber)
    })
  })
}

var createBranch = function(repo, branchName) {
  return repo.getMasterCommit().then(function(commit) {
    return repo.createBranch(branchName, commit, 0, repo.defaultSignature(), `Creating new branch branchName`).then(function() {
      return repo.checkoutBranch(branchName);
    })
  })
}

var bumpPackageJsonVersion = function(repo, branchName) {
  return repo.getHeadCommit().then(function(commit) {
    return commit.getEntry('package.json');
  })
  .then(function(entry) {
    return entry.getBlob();
  })
  .then(function(blob) {
    return getLastBuildNumber().then(function(buildNumber) {
      var json = JSON.parse(blob.toString());
      json.version = `1.${buildNumber}.0`
      return write('./clone/package.json', JSON.stringify(json, null, '  '));
    })
  })
}

var commit = function(repo) {
  var _index;
  var treeOid;
  return repo.refreshIndex()
  .then(function(index) {
    _index = index;
  })
  .then(function() {
    return _index.addByPath('package.json');
  })
  .then(function() {
    return _index.write();
  })
  .then(function() {
    return _index.writeTree();
  })
  .then(function(oid) {
    treeOid = oid;
    return nodegit.Reference.nameToId(repo, 'HEAD')
  })
  .then(function(parent) {
    var author = getSignature();
    var committer = getSignature();
    return repo.createCommit('HEAD', author, committer, conf.GIT_MESSAGE, treeOid, [parent]);
  })
  .then(function(commitId) {
    console.log('New Commit : '.green, commitId.allocfmt());
    return '';
  })
  .catch(function() {
    console.log(arguments)
  })
}

var tag = function(repo, branchName) {
  return repo.getHeadCommit()
  .then(function(commit){
    return commit.sha();
  })
  .then(function(sha) {
    var oid = nodegit.Oid.fromString(sha);
    return repo.createTag(oid, branchName, conf.GIT_MESSAGE);
  })
  .catch(function() {
    console.log(arguments)
  })
}

var push = function(repo, branchName) {
  return repo.getRemote('origin')
  .then(function(remote) {
    return remote.push([`refs/heads/master:refs/heads/${branchName}`], {
      callbacks: {
        certificateCheck : function() {
          return 1;
        },
        credentials: function(url, userName) {
          return nodegit.Cred.userpassPlaintextNew(process.env.USER_NAME, process.env.PASSWORD);
        },
        transferProgress: function(progress) {
          console.log('Progress:'.green, progress);
        }
      }
    })
  })
  .catch(function() {
    console.log('An error occured while pushing to remote'.red);
  })
}

module.exports = {
  create : function(repo, branchName) {
    createBranch(repo, branchName).then(function() {
      bumpPackageJsonVersion(repo, branchName)
      .then(function() {
        return commit(repo);
      })
      .then(function() {
        return tag(repo, branchName);
      })
      .then(function() {
        //return push(repo, branchName);
      })
    })
  }
}