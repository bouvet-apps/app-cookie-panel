const libs = {
  common: require("/lib/xp/common")
};

const forceArray = (data) => {
  // eslint-disable-next-line no-restricted-globals
  if (data === undefined || data === null || (typeof data === "number" && isNaN(data))) return [];
  return Array.isArray(data) ? data : [data];
};
exports.forceArray = forceArray;

const controlCookieName = `${app.name}-cookie-control`;
exports.controlCookieName = controlCookieName;

const getCategoryId = category => `cookie-panel-${libs.common.sanitize(category.title)}`;
exports.getCategoryId = getCategoryId;

const getCookieCategories = siteConfig => [{
  title: siteConfig["cookie-panel-required-title"],
  description: siteConfig["cookie-panel-required-description"],
  cookies: [],
  default: true
},
...forceArray(siteConfig["cookie-panel-categories"])
].map((category) => {
  const c = category;
  c.id = getCategoryId(c);
  return c;
});
exports.getCookieCategories = getCookieCategories;
