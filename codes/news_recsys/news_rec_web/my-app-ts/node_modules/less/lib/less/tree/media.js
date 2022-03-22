"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ruleset_1 = tslib_1.__importDefault(require("./ruleset"));
var value_1 = tslib_1.__importDefault(require("./value"));
var selector_1 = tslib_1.__importDefault(require("./selector"));
var anonymous_1 = tslib_1.__importDefault(require("./anonymous"));
var expression_1 = tslib_1.__importDefault(require("./expression"));
var atrule_1 = tslib_1.__importDefault(require("./atrule"));
var utils = tslib_1.__importStar(require("../utils"));
var Media = function (value, features, index, currentFileInfo, visibilityInfo) {
    this._index = index;
    this._fileInfo = currentFileInfo;
    var selectors = (new selector_1.default([], null, null, this._index, this._fileInfo)).createEmptySelectors();
    this.features = new value_1.default(features);
    this.rules = [new ruleset_1.default(selectors, value)];
    this.rules[0].allowImports = true;
    this.copyVisibilityInfo(visibilityInfo);
    this.allowRoot = true;
    this.setParent(selectors, this);
    this.setParent(this.features, this);
    this.setParent(this.rules, this);
};
Media.prototype = Object.assign(new atrule_1.default(), {
    type: 'Media',
    isRulesetLike: function () {
        return true;
    },
    accept: function (visitor) {
        if (this.features) {
            this.features = visitor.visit(this.features);
        }
        if (this.rules) {
            this.rules = visitor.visitArray(this.rules);
        }
    },
    genCSS: function (context, output) {
        output.add('@media ', this._fileInfo, this._index);
        this.features.genCSS(context, output);
        this.outputRuleset(context, output, this.rules);
    },
    eval: function (context) {
        if (!context.mediaBlocks) {
            context.mediaBlocks = [];
            context.mediaPath = [];
        }
        var media = new Media(null, [], this._index, this._fileInfo, this.visibilityInfo());
        if (this.debugInfo) {
            this.rules[0].debugInfo = this.debugInfo;
            media.debugInfo = this.debugInfo;
        }
        media.features = this.features.eval(context);
        context.mediaPath.push(media);
        context.mediaBlocks.push(media);
        this.rules[0].functionRegistry = context.frames[0].functionRegistry.inherit();
        context.frames.unshift(this.rules[0]);
        media.rules = [this.rules[0].eval(context)];
        context.frames.shift();
        context.mediaPath.pop();
        return context.mediaPath.length === 0 ? media.evalTop(context) :
            media.evalNested(context);
    },
    evalTop: function (context) {
        var result = this;
        // Render all dependent Media blocks.
        if (context.mediaBlocks.length > 1) {
            var selectors = (new selector_1.default([], null, null, this.getIndex(), this.fileInfo())).createEmptySelectors();
            result = new ruleset_1.default(selectors, context.mediaBlocks);
            result.multiMedia = true;
            result.copyVisibilityInfo(this.visibilityInfo());
            this.setParent(result, this);
        }
        delete context.mediaBlocks;
        delete context.mediaPath;
        return result;
    },
    evalNested: function (context) {
        var i;
        var value;
        var path = context.mediaPath.concat([this]);
        // Extract the media-query conditions separated with `,` (OR).
        for (i = 0; i < path.length; i++) {
            value = path[i].features instanceof value_1.default ?
                path[i].features.value : path[i].features;
            path[i] = Array.isArray(value) ? value : [value];
        }
        // Trace all permutations to generate the resulting media-query.
        //
        // (a, b and c) with nested (d, e) ->
        //    a and d
        //    a and e
        //    b and c and d
        //    b and c and e
        this.features = new value_1.default(this.permute(path).map(function (path) {
            path = path.map(function (fragment) { return fragment.toCSS ? fragment : new anonymous_1.default(fragment); });
            for (i = path.length - 1; i > 0; i--) {
                path.splice(i, 0, new anonymous_1.default('and'));
            }
            return new expression_1.default(path);
        }));
        this.setParent(this.features, this);
        // Fake a tree-node that doesn't output anything.
        return new ruleset_1.default([], []);
    },
    permute: function (arr) {
        if (arr.length === 0) {
            return [];
        }
        else if (arr.length === 1) {
            return arr[0];
        }
        else {
            var result = [];
            var rest = this.permute(arr.slice(1));
            for (var i = 0; i < rest.length; i++) {
                for (var j = 0; j < arr[0].length; j++) {
                    result.push([arr[0][j]].concat(rest[i]));
                }
            }
            return result;
        }
    },
    bubbleSelectors: function (selectors) {
        if (!selectors) {
            return;
        }
        this.rules = [new ruleset_1.default(utils.copyArray(selectors), [this.rules[0]])];
        this.setParent(this.rules, this);
    }
});
exports.default = Media;
//# sourceMappingURL=media.js.map