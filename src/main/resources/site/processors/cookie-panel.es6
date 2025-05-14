const libs = {
  portal: require("/lib/xp/portal"),
  cache: require("/lib/cache"),
  util: require("/lib/util")
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

  const siteConfig = libs.portal.getSiteConfig();
  const categories = libs.util.getCookieCategories(siteConfig);

  const model = {
    controlCookie: controlCookieName,
    url: libs.portal.serviceUrl({ service: "cookie-info" }),
    showSettings: req.params.cookie_settings === "true",
    theme: siteConfig["cookie-panel-theme"] === "none" ? "" : `theme ${siteConfig["cookie-panel-theme"]}`,
    buttonOrder: siteConfig["cookie-panel-button-order"],
    title: siteConfig["cookie-panel-text-title"],
    description: siteConfig["cookie-panel-text-description"],
    settingsLabel: siteConfig["cookie-panel-settings-button-label"],
    acceptLabel: siteConfig["cookie-panel-accept-button-label"],
    rejectLabel: siteConfig["cookie-panel-reject-button-label"],
    saveLabel: siteConfig["cookie-panel-save-button-label"],
    readMoreLabel: siteConfig["cookie-panel-read-more-link-label"],
    readMoreLink: libs.portal.pageUrl({ id: siteConfig["cookie-panel-read-more-link"] }),
    categories: categories,
    expireControlCookieAfterDays: siteConfig["control-cookie-expire-after-days"],
    controlCookieInvalidateNumber: siteConfig["control-cookie-invalidate-number"]
  };

  res.pageContributions.headEnd = libs.util.forceArray(res.pageContributions.headEnd);
  res.pageContributions.bodyEnd = libs.util.forceArray(res.pageContributions.bodyEnd);
  const script = `<script src="${libs.portal.assetUrl({ path: "js/main.js" })}" defer></script>`;
  res.pageContributions.bodyEnd.push(script);

  if (model.layout !== "none") {
    const style = `<link rel="stylesheet" href="${libs.portal.assetUrl({ path: "css/main.css" })}"/>`;
    res.pageContributions.headEnd.push(style);
  }

  const html = render(model);
  res.pageContributions.bodyEnd.push(html);

  return res;
};
