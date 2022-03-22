"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upload = upload;

var _dom = require("@testing-library/dom");

var _click = require("./click");

var _blur = require("./blur");

var _focus = require("./focus");

var _utils = require("./utils");

function upload(element, fileOrFiles, init, {
  applyAccept = false
} = {}) {
  var _input$files;

  const input = (0, _utils.isElementType)(element, 'label') ? element.control : element;

  if (!input || !(0, _utils.isElementType)(input, 'input', {
    type: 'file'
  })) {
    throw new TypeError(`The ${input === element ? 'given' : 'associated'} ${input == null ? void 0 : input.tagName} element does not accept file uploads`);
  }

  if ((0, _utils.isDisabled)(element)) return;
  (0, _click.click)(element, init == null ? void 0 : init.clickInit);
  const files = (Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles]).filter(file => !applyAccept || isAcceptableFile(file, input.accept)).slice(0, input.multiple ? undefined : 1); // blur fires when the file selector pops up

  (0, _blur.blur)(element); // focus fires when they make their selection

  (0, _focus.focus)(element); // do not fire an input event if the file selection does not change

  if (files.length === ((_input$files = input.files) == null ? void 0 : _input$files.length) && files.every((f, i) => {
    var _input$files2;

    return f === ((_input$files2 = input.files) == null ? void 0 : _input$files2.item(i));
  })) {
    return;
  } // the event fired in the browser isn't actually an "input" or "change" event
  // but a new Event with a type set to "input" and "change"
  // Kinda odd...


  const inputFiles = { ...files,
    length: files.length,
    item: index => files[index],

    [Symbol.iterator]() {
      let i = 0;
      return {
        next: () => ({
          done: i >= files.length,
          value: files[i++]
        })
      };
    }

  };
  (0, _dom.fireEvent)(input, (0, _dom.createEvent)('input', input, {
    target: {
      files: inputFiles
    },
    bubbles: true,
    cancelable: false,
    composed: true
  }));

  _dom.fireEvent.change(input, {
    target: {
      files: inputFiles
    },
    ...(init == null ? void 0 : init.changeInit)
  });
}

function isAcceptableFile(file, accept) {
  if (!accept) {
    return true;
  }

  const wildcards = ['audio/*', 'image/*', 'video/*'];
  return accept.split(',').some(acceptToken => {
    if (acceptToken.startsWith('.')) {
      // tokens starting with a dot represent a file extension
      return file.name.endsWith(acceptToken);
    } else if (wildcards.includes(acceptToken)) {
      return file.type.startsWith(acceptToken.substr(0, acceptToken.length - 1));
    }

    return file.type === acceptToken;
  });
}