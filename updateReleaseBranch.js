var bumpPackageJsonVersion = function(repo, branchName) {
  repo.getBranchCommit(`origin/${branchName}`).then(function(commit) {
    repo.createBranch(branchName, commit, 0, repo.defaultSignature(), `Creating new branch branchName`).then(function() {
      return repo.checkoutBranch(branchName);
    })
    .then(function() {
      return commit.getEntry('package.json');
    })
    .then(function(entry) {
      return entry.getBlob();
    })
    .then(function(blob) {
      getLastBuildNumber().then(function(buildNumber) {
        console.log(blob.toString(), buildNumber);
      })
    })
  })
}