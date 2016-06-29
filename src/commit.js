'use strict';
const conf = require('../conf');
const nodegit = require('nodegit');
const signature = require('./signature');
const colors = require('colors');

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
    var author = signature.get();
    var committer = signature.get();
    return repo.createCommit('HEAD', author, committer, conf.GIT_MESSAGE, treeOid, [parent]);
  })
  .then(function(commitId) {
    console.log('New Commit : '.green, commitId.allocfmt());
    return '';
  })
  .catch(function() {
    console.log('Error found while doing a commit : '.red, arguments)
  })
}

module.exports = {
  commit : commit
}