"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./skeleton.css");

var _skeleton2 = require("./skeleton");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_skeleton2.Skeleton, {
  Title: _skeleton2.SkeletonTitle,
  Paragraph: _skeleton2.SkeletonParagraph
});

exports.default = _default;