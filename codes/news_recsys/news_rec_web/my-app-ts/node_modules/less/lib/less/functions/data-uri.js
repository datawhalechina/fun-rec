"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var quoted_1 = tslib_1.__importDefault(require("../tree/quoted"));
var url_1 = tslib_1.__importDefault(require("../tree/url"));
var utils = tslib_1.__importStar(require("../utils"));
var logger_1 = tslib_1.__importDefault(require("../logger"));
exports.default = (function (environment) {
    var fallback = function (functionThis, node) { return new url_1.default(node, functionThis.index, functionThis.currentFileInfo).eval(functionThis.context); };
    return { 'data-uri': function (mimetypeNode, filePathNode) {
            if (!filePathNode) {
                filePathNode = mimetypeNode;
                mimetypeNode = null;
            }
            var mimetype = mimetypeNode && mimetypeNode.value;
            var filePath = filePathNode.value;
            var currentFileInfo = this.currentFileInfo;
            var currentDirectory = currentFileInfo.rewriteUrls ?
                currentFileInfo.currentDirectory : currentFileInfo.entryPath;
            var fragmentStart = filePath.indexOf('#');
            var fragment = '';
            if (fragmentStart !== -1) {
                fragment = filePath.slice(fragmentStart);
                filePath = filePath.slice(0, fragmentStart);
            }
            var context = utils.clone(this.context);
            context.rawBuffer = true;
            var fileManager = environment.getFileManager(filePath, currentDirectory, context, environment, true);
            if (!fileManager) {
                return fallback(this, filePathNode);
            }
            var useBase64 = false;
            // detect the mimetype if not given
            if (!mimetypeNode) {
                mimetype = environment.mimeLookup(filePath);
                if (mimetype === 'image/svg+xml') {
                    useBase64 = false;
                }
                else {
                    // use base 64 unless it's an ASCII or UTF-8 format
                    var charset = environment.charsetLookup(mimetype);
                    useBase64 = ['US-ASCII', 'UTF-8'].indexOf(charset) < 0;
                }
                if (useBase64) {
                    mimetype += ';base64';
                }
            }
            else {
                useBase64 = /;base64$/.test(mimetype);
            }
            var fileSync = fileManager.loadFileSync(filePath, currentDirectory, context, environment);
            if (!fileSync.contents) {
                logger_1.default.warn("Skipped data-uri embedding of " + filePath + " because file not found");
                return fallback(this, filePathNode || mimetypeNode);
            }
            var buf = fileSync.contents;
            if (useBase64 && !environment.encodeBase64) {
                return fallback(this, filePathNode);
            }
            buf = useBase64 ? environment.encodeBase64(buf) : encodeURIComponent(buf);
            var uri = "data:" + mimetype + "," + buf + fragment;
            return new url_1.default(new quoted_1.default("\"" + uri + "\"", uri, false, this.index, this.currentFileInfo), this.index, this.currentFileInfo);
        } };
});
//# sourceMappingURL=data-uri.js.map