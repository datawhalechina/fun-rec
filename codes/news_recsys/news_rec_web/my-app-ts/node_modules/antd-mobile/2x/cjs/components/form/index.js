"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./index.css");

var _form = require("./form");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _formItem = require("./form-item");

var _header = require("./header");

var _rcFieldForm = require("rc-field-form");

var _formSubscribe = require("./form-subscribe");

var _formArray = require("./form-array");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_form.Form, {
  Item: _formItem.FormItem,
  Subscribe: _formSubscribe.FormSubscribe,
  Header: _header.Header,
  Array: _formArray.FormArray,
  useForm: _rcFieldForm.useForm
});

exports.default = _default;