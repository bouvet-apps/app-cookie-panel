# Cookie Panel for Enonic XP
Opt-in Cookie Panel for Enonic XP.

## How it works
Cookie Panel works by setting a few user-definable functional control cookies to communicate with other apps that they shouldn't add their tracking to
the the site. By default, before the user has consented to tracking cookies, all these cookies are set to their rejected value
by Cookie Panel.

Once the user has consented to the specific cookie categories, Cookie Panel will set the control cookies to their accepted value to communicate to the
other apps that they now can render their content.

## Features
- Opt-in cookie consent for your users
- Custom cookie groups/categories that users can enable/disable individually
- Configurable cookie security attributes (Secure and SameSite)
- Easy integration with other applications
- Built-in light and dark themes to fit most site designs
- Custom styling if you want something different from the built-in themes
- Content Security Policy compatible

## Configuring Cookie Security

### Per-Cookie Attributes
For each cookie in a category, you can configure:

- **Secure**: When enabled, the cookie is only sent over HTTPS connections. On HTTP pages, the browser will not set the cookie.
- **SameSite**: Controls when the cookie is sent with cross-site requests:
  - `Lax` (default): Cookie is sent in same-site requests and top-level navigations. Provides CSRF protection while maintaining compatibility.
  - `Strict`: Cookie is only sent in same-site requests. Most restrictive option.
  - `None`: Cookie is sent in all contexts, including cross-site requests. **Requires `Secure=true`**. Use for cookies that need to work in cross-site contexts.
  - Not set: Omits the attribute entirely (for legacy compatibility).

### Control Cookie Attributes
The internal control cookie used by Cookie Panel can also be configured with security attributes in the "Behavior" section:

- **Secure**: Recommended to enable in production HTTPS environments.
- **SameSite**: Defaults to `Lax` for security.

### Important Notes
- JavaScript-set cookies cannot use the `HttpOnly` attribute (server-only). If your security audit requires `HttpOnly`, you must use server-set cookies.
- `SameSite=None` requires `Secure=true`. If you configure `SameSite=None` without `Secure`, the implementation will automatically enable `Secure`.
- On HTTP (non-HTTPS) pages, cookies marked as `Secure` will not be persisted by the browser. This is expected behavior and not an error.
- See [MDN: Practical implementation guides for cookies](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Cookies) for more details.

## Customizing
You can add CSS styling in your own applications to make the panels fit any design you want.

### Open settings panel from a link or button
There are 2 ways to add buttons that directly open the cookie settings panel.

#### URL parameter
If you add a cookie_settings=true parameter to your URL, Cookie Panel will load and open its settings
?cookie_settings=true

#### Button attribute
You can add your own button to open the the panel with the attribute `data-cookie-panel-selector="open-settings"`

```
<button data-cookie-panel-selector="open-settings">
  Open cookie settings
</button>
```

### Refresh on save
If you have serverside rendered components that need specific consent from the user before presenting it to the user (external video players etc),
you can tell Cookie Panel that the page needs refreshing after saving cookie settings. To do this, you add an application/json script block
to your page with a specific selector attribute Cookie Panel can pick up. If you add this using page contributions from the parts that require
a reload to properly render, this behaviour will only affect pages using those parts and not reload if the parts aren't used.

```
<script data-cookie-panel-selector="page-config">
  { reloadOnSave: true }
</script>
```

### Run code on consent
Your app can add a function to run both on page load and when user consent is given. When consent is granted for a specific category, the app will
execute a function for each cookie within that category—if any exist. On page load, the function will run for every cookie across all categories.

Register a function on the `window.__RUN_ON_COOKIE_CONSENT__` object, the key being the same as the cookie name in the cookie panel app config.

With this site config:
![Bilde av site config](./images/panel-config-name.png)

You would register in your app frontend JS like this:

```
window.__RUN_ON_COOKIE_CONSENT__ = window.__RUN_ON_COOKIE_CONSENT__ || {};
window.__RUN_ON_COOKIE_CONSENT__["com-enonic-app-ga_disabled"] = function () {
  // Code to be run on consent
}`;

```

It's important the RUN_ON_COOKIE_CONSENT function is set on the window object before the cookie panel app tries to execute it. The cookie panel front-end script that executes it is added to the body end,
is deferred and runs on DOMContentLoaded, so your script needs to be loaded and executed before that.

## Integrating
Cookie Panel works out of the box with these apps:
- [Google Tag Manager](https://github.com/bouvet-apps/app-google-tag-manager/tree/feature/cookie-panel-support/dist)
- [Google Analytics](https://github.com/bouvet-apps/app-google-analytics/tree/feature/cookie-panel-support/dist)
- [Facebook Pixel](https://github.com/bouvet-apps/app-facebook-pixel/tree/feature/cookie-panel-support)

## Version history

### 1.0.0 Initial release

