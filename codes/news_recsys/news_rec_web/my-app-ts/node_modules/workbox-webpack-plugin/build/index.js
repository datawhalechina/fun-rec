"use strict";
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectManifest = exports.GenerateSW = void 0;
const generate_sw_1 = require("./generate-sw");
Object.defineProperty(exports, "GenerateSW", { enumerable: true, get: function () { return generate_sw_1.GenerateSW; } });
const inject_manifest_1 = require("./inject-manifest");
Object.defineProperty(exports, "InjectManifest", { enumerable: true, get: function () { return inject_manifest_1.InjectManifest; } });
// TODO: remove this in v7.
// See https://github.com/GoogleChrome/workbox/issues/3033
exports.default = { GenerateSW: generate_sw_1.GenerateSW, InjectManifest: inject_manifest_1.InjectManifest };
