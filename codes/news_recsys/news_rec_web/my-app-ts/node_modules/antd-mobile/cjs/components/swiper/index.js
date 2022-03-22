"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./swiper.css");

var _swiper2 = require("./swiper");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _swiperItem = require("./swiper-item");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_swiper2.Swiper, {
  Item: _swiperItem.SwiperItem
});

exports.default = _default;