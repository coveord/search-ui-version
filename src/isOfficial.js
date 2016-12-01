'use strict';

const isOfficialBuild = function() {
  let isOfficial = false;
  if(process.env.IS_OFFICIAL != undefined) {
    isOfficial = process.env.IS_OFFICIAL.toLowerCase() == 'true';
  }
  return isOfficial;
}

module.exports = isOfficialBuild;