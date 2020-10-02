"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var libs = {
  common: require("/lib/xp/common")
};

var forceArray = function forceArray(data) {
  if (data === undefined || data === null || typeof data === "number" && isNaN(data)) return [];
  return Array.isArray(data) ? data : [data];
};

exports.forceArray = forceArray;
var controlCookieName = "".concat(app.name, "-cookie-control");
exports.controlCookieName = controlCookieName;

var getCategoryId = function getCategoryId(category) {
  return "cookie-panel-".concat(libs.common.sanitize(category.title));
};

exports.getCategoryId = getCategoryId;

var getCookieCategories = function getCookieCategories(siteConfig) {
  return [{
    title: siteConfig["cookie-panel-required-title"],
    description: siteConfig["cookie-panel-required-description"],
    cookies: [],
    "default": true
  }].concat(_toConsumableArray(forceArray(siteConfig["cookie-panel-categories"]))).map(function (category) {
    var c = category;
    c.id = getCategoryId(c);
    return c;
  });
};

exports.getCookieCategories = getCookieCategories;