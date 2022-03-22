/*
  @license
	Rollup.js v2.70.1
	Mon, 14 Mar 2022 05:50:08 GMT - commit b8315e03f9790d610a413316fbf6d565f9340cab

	https://github.com/rollup/rollup

	Released under the MIT License.
*/
'use strict';

require('fs');
require('path');
require('process');
require('url');
const loadConfigFile_js = require('./shared/loadConfigFile.js');
require('./shared/rollup.js');
require('./shared/mergeOptions.js');
require('tty');
require('perf_hooks');
require('crypto');
require('events');



module.exports = loadConfigFile_js.loadAndParseConfigFile;
//# sourceMappingURL=loadConfigFile.js.map
