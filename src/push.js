'use strict';
const nodegit = require('nodegit');
const colors = require('colors');
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

console.log(process.env.USER_NAME)

if(!username) {
  console.log('No username provided in $USER_NAME'.red);
  process.exit(1);
}

if(!password) {
  console.log('No password provided in $PASSWORD'.red);
  process.exit(1);
}

var push = function(repo, branchName, tagName) {
  return repo.getRemote('origin')
  .then(function(remote) {
    return remote.push([`refs/heads/${branchName}:refs/heads/${branchName}`, `refs/tags/${tagName}:refs/tags/${tagName}`], {
      callbacks: {
        certificateCheck : function() {
          return 1;
        },
        credentials: function(url, userName) {
          return nodegit.Cred.userpassPlaintextNew(process.env.USER_NAME, process.env.PASSWORD)
        },
        transferProgress: function(progress) {
          console.log('Progress:'.green, progress);
        }
      }
    })
  })
  .catch(function() {
    console.log('An error occured while pushing to remote'.red, arguments);
  })
}

module.exports = {
  push : push
}