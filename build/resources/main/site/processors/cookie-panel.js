"use strict";

var libs = {
  portal: require("/lib/xp/portal"),
  cache: require("/lib/cache"),
  util: require("/lib/util")
};
var HEADER_NAME = "X-Cookiepanel";
var HEADER_VALUE_INCLUDE = "include";

var getRejectedCookies = function getRejectedCookies(categories, res) {
  var cookies = res.cookies || {};
  libs.util.forceArray(categories).forEach(function (category) {
    libs.util.forceArray(category.cookies).forEach(function (cookie) {
      cookies[cookie["cookie-name"]] = {
        value: cookie["cookie-value-rejected"],
        path: "/",
        secure: false,
        httpOnly: false
      };
    });
  });
  return cookies;
};

var render = function render(model) {
  return "<script type=\"application/json\" data-cookie-panel-selector=\"config\">".concat(JSON.stringify(model), "</script>");
};

exports.responseProcessor = function (req, res) {
  var controlCookieName = libs.util.controlCookieName;

  if (req.mode !== "live") {
    return res;
  }

  if (req.cookies[controlCookieName] === "true" && !req.params.cookie_settings && res.headers[HEADER_NAME] !== HEADER_VALUE_INCLUDE) {
    return res;
  }

  var siteConfig = libs.portal.getSiteConfig();
  var categories = libs.util.getCookieCategories(siteConfig);
  var model = {
    controlCookie: controlCookieName,
    url: libs.portal.serviceUrl({
      service: "cookie-info"
    }),
    showSettings: req.params.cookie_settings === "true",
    passive: res.headers[HEADER_NAME] === HEADER_VALUE_INCLUDE,
    accepted: req.cookies[controlCookieName] === "true",
    theme: siteConfig["cookie-panel-theme"] === "none" ? "" : "theme ".concat(siteConfig["cookie-panel-theme"]),
    buttonOrder: siteConfig["cookie-panel-button-order"],
    title: siteConfig["cookie-panel-text-title"],
    description: siteConfig["cookie-panel-text-description"],
    settingsLabel: siteConfig["cookie-panel-settings-button-label"],
    acceptLabel: siteConfig["cookie-panel-accept-button-label"],
    saveLabel: siteConfig["cookie-panel-save-button-label"],
    readMoreLabel: siteConfig["cookie-panel-read-more-link-label"],
    readMoreLink: libs.portal.pageUrl({
      id: siteConfig["cookie-panel-read-more-link"]
    }),
    categories: categories
  };
  res.pageContributions.headEnd = libs.util.forceArray(res.pageContributions.headEnd);
  var script = "<script src=\"".concat(libs.portal.assetUrl({
    path: "js/main.js"
  }), "\" defer></script>");
  res.pageContributions.bodyEnd.push(script);

  if (model.layout !== "none") {
    var style = "<link rel=\"stylesheet\" href=\"".concat(libs.portal.assetUrl({
      path: "css/main.css"
    }), "\"/>");
    res.pageContributions.headEnd.push(style);
  }

  var html = render(model);
  res.pageContributions.bodyEnd = libs.util.forceArray(res.pageContributions.bodyEnd);
  res.pageContributions.bodyEnd.push(html);

  if (!req.cookies[controlCookieName]) {
    res.cookies = getRejectedCookies(siteConfig["cookie-panel-categories"], res);
  }

  return res;
};