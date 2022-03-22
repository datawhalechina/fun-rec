"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var isUrlRe = /^(?:https?:)?\/\//i;
var url_1 = tslib_1.__importDefault(require("url"));
var request;
var abstract_file_manager_js_1 = tslib_1.__importDefault(require("../less/environment/abstract-file-manager.js"));
var logger_1 = tslib_1.__importDefault(require("../less/logger"));
var UrlFileManager = function () { };
UrlFileManager.prototype = Object.assign(new abstract_file_manager_js_1.default(), {
    supports: function (filename, currentDirectory, options, environment) {
        return isUrlRe.test(filename) || isUrlRe.test(currentDirectory);
    },
    loadFile: function (filename, currentDirectory, options, environment) {
        return new Promise(function (fulfill, reject) {
            if (request === undefined) {
                try {
                    request = require('needle');
                }
                catch (e) {
                    request = null;
                }
            }
            if (!request) {
                reject({ type: 'File', message: 'optional dependency \'needle\' required to import over http(s)\n' });
                return;
            }
            var urlStr = isUrlRe.test(filename) ? filename : url_1.default.resolve(currentDirectory, filename);
            /** native-request currently has a bug */
            var hackUrlStr = urlStr.indexOf('?') === -1 ? urlStr + '?' : urlStr;
            request.get(hackUrlStr, { follow_max: 5 }, function (err, resp, body) {
                if (err || resp && resp.statusCode >= 400) {
                    var message = resp && resp.statusCode === 404
                        ? "resource '" + urlStr + "' was not found\n"
                        : "resource '" + urlStr + "' gave this Error:\n  " + (err || resp.statusMessage || resp.statusCode) + "\n";
                    reject({ type: 'File', message: message });
                    return;
                }
                if (resp.statusCode >= 300) {
                    reject({ type: 'File', message: "resource '" + urlStr + "' caused too many redirects" });
                    return;
                }
                body = body.toString('utf8');
                if (!body) {
                    logger_1.default.warn("Warning: Empty body (HTTP " + resp.statusCode + ") returned by \"" + urlStr + "\"");
                }
                fulfill({ contents: body || '', filename: urlStr });
            });
        });
    }
});
exports.default = UrlFileManager;
//# sourceMappingURL=url-file-manager.js.map