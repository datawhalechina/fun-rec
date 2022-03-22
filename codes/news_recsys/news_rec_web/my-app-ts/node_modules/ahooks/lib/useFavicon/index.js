"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var ImgTypeMap = {
  SVG: 'image/svg+xml',
  ICO: 'image/x-icon',
  GIF: 'image/gif',
  PNG: 'image/png'
};

var useFavicon = function useFavicon(href) {
  react_1.useEffect(function () {
    if (!href) return;
    var cutUrl = href.split('.');
    var imgSuffix = cutUrl[cutUrl.length - 1].toLocaleUpperCase();
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = ImgTypeMap[imgSuffix];
    link.href = href;
    link.rel = 'shortcut icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }, [href]);
};

exports["default"] = useFavicon;