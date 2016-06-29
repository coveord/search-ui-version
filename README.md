# search-ui-version

* Create a travis job for this repo.
* In Travis setting, set the `BRANCH_NAME` environments variable.
* Modify the `conf.js` file with the required variables.
* Start the travis job (you can use "rebuild", do not need to push anything new to trigger a build)


* If it's a new branch name that does not exists on the remote (a new release version), the script will :
  * Checkout the configured repo in `conf.js`, create a branch with the given name
  * Get the latest build number from travis
  * Bump the version in `package.json` by setting it to `1.${BUILD_NUMBER}.0`
  * Commit the change
  * Create a tag with the version name
  * Push all this to the remote.
  
* If it's an existing branch on the remote (update a release version), this script will :
  * Checkout the branch
  * Bump the `package.json` minor version by +1
  * Create a tag with the minor version
  * Push all this to the remote.
  
Everytime you wish to do a new release or update an older release, just change the `BRANCH_NAME` enviroment variable to the appropriate value before hitting rebuild..
