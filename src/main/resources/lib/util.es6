const libs = {
  common: require("/lib/xp/common"),
  content: require('/lib/xp/content')
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

const normalizeSameSite = (value) => {
  const samesite = (value || "lax").toLowerCase();
  return ["unset", "none", "lax", "strict"].indexOf(samesite) !== -1 ? samesite : "lax";
};
exports.normalizeSameSite = normalizeSameSite;

const normalizeCookieAttributes = (cookie) => {
  const normalized = { ...cookie };
  
  // Normalize secure attribute to boolean
  normalized["cookie-secure"] = cookie["cookie-secure"] === true || cookie["cookie-secure"] === "true";
  
  // Normalize samesite to one of: unset, lax, strict, none
  normalized["cookie-samesite"] = normalizeSameSite(cookie["cookie-samesite"]);
  
  // SameSite=None requires Secure per browser spec
  if (normalized["cookie-samesite"] === "none") {
    normalized["cookie-secure"] = true;
  }
  
  return normalized;
};

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
  // Normalize cookie attributes for each cookie in the category
  c.cookies = forceArray(c.cookies).map(cookie => normalizeCookieAttributes(cookie));
  return c;
});
exports.getCookieCategories = getCookieCategories;

exports.getRootSiteConfig = function () {
  const rootNode = libs.content.query({
    count: 1,
    contentTypes: ['portal:site'],
    query: '_parentPath = "/content"'
  }).hits[0];

  const siteConfig = [].concat(rootNode.data.siteConfig);

  for (let i = 0; i < siteConfig.length; i++) {
    if (siteConfig[i].applicationKey === app.name) {
      return siteConfig[i].config;
    }
  }
  return {};
}
