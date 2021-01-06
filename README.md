# search-ui-version

A helper project to trigger release builds for the coveo-search-ui project.

## Pipelines

### update-or-create-branch

Required variables: `BRANCH_NAME`


* If it's a new branch name that does not exists on the remote (a new release version), the script will :
  * Checkout the configured repo in `conf.js`, create a branch with the given name
  * Get the latest build number from npm.
  * Bump the version in `package.json` by setting it to `2.${LATEST_MINOR_VERSION + 1}.0`
  * Commit the change
  * Create a tag with the version name
  * Push all this to the remote.
  
* If it's an existing branch on the remote (update a release version), this script will :
  * Checkout the branch
  * Bump the `package.json` patch version by +1
  * Create a tag with the patch version
  * Push all this to the remote.
  
Everytime you wish to do a new release or update an older release, just change the `BRANCH_NAME` enviroment variable to the appropriate value before hitting rebuild.
