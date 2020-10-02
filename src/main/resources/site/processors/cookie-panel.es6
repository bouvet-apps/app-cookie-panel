const libs = {
  portal: require("/lib/xp/portal"),
  cache: require("/lib/cache"),
  util: require("/lib/util")
};

const HEADER_NAME = "X-Cookiepanel";
const HEADER_VALUE_INCLUDE = "include";

/**
 * Set up cookies with rejected values
 * @param categories Cookie categories
 * @param res Response object
 */
const getRejectedCookies = (categories, res) => {
  const cookies = res.cookies || {};
  libs.util.forceArray(categories).forEach((category) => {
    libs.util.forceArray(category.cookies).forEach((cookie) => {
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

/**
 * Render JSON page contribution
 * @param model Model to render
 */
const render = model => `<script type="application/json" data-cookie-panel-selector="config">${JSON.stringify(model)}</script>`;

exports.responseProcessor = (req, res) => {
  const controlCookieName = libs.util.controlCookieName;

  if (req.mode !== "live") {
    return res;
  }

  if (req.cookies[controlCookieName] === "true"
    && !req.params.cookie_settings
    && res.headers[HEADER_NAME] !== HEADER_VALUE_INCLUDE) {
    return res;
  }

  const siteConfig = libs.portal.getSiteConfig();
  const categories = libs.util.getCookieCategories(siteConfig);

  const model = {
    controlCookie: controlCookieName,
    url: libs.portal.serviceUrl({ service: "cookie-info" }),
    showSettings: req.params.cookie_settings === "true",
    // passive: res.headers[HEADER_NAME] === HEADER_VALUE_INCLUDE,
    accepted: req.cookies[controlCookieName] === "true",
    theme: siteConfig["cookie-panel-theme"] === "none" ? "" : `theme ${siteConfig["cookie-panel-theme"]}`,
    buttonOrder: siteConfig["cookie-panel-button-order"],
    title: siteConfig["cookie-panel-text-title"],
    description: siteConfig["cookie-panel-text-description"],
    settingsLabel: siteConfig["cookie-panel-settings-button-label"],
    acceptLabel: siteConfig["cookie-panel-accept-button-label"],
    saveLabel: siteConfig["cookie-panel-save-button-label"],
    readMoreLabel: siteConfig["cookie-panel-read-more-link-label"],
    readMoreLink: libs.portal.pageUrl({ id: siteConfig["cookie-panel-read-more-link"] }),
    categories: categories
  };

  res.pageContributions.headEnd = libs.util.forceArray(res.pageContributions.headEnd);
  const script = `<script src="${libs.portal.assetUrl({ path: "js/main.js" })}" defer></script>`;
  res.pageContributions.bodyEnd.push(script);

  if (model.layout !== "none") {
    const style = `<link rel="stylesheet" href="${libs.portal.assetUrl({ path: "css/main.css" })}"/>`;
    res.pageContributions.headEnd.push(style);
  }

  const html = render(model);
  res.pageContributions.bodyEnd = libs.util.forceArray(res.pageContributions.bodyEnd);
  res.pageContributions.bodyEnd.push(html);

  // If no control cookie is set, reject all cookies by default to achieve opt-in functionality
  if (!req.cookies[controlCookieName]) {
    res.cookies = getRejectedCookies(siteConfig["cookie-panel-categories"], res);
  }

  return res;
};
