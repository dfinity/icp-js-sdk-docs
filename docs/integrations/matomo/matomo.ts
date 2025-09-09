// Script inspired by https://developer.matomo.org/guides/tracking-javascript-guide and https://github.com/felix-berlin/astro-matomo

import type { MatomoConfig } from "./config.ts";

declare global {
  var _paq: Array<[string] | [string, string | number | boolean]>;
  var _mtm: Array<[string]>;
}

export function initMatomo(options: MatomoConfig): void {
  const heartBeatTimer = 30;
  const cookieDomain = "*.icp.build";

  const _paq = (globalThis._paq = globalThis._paq || []);

  // tracker methods like "setCustomDimension" should be called before "trackPageView"
  _paq.push(["disableCookies"]);
  _paq.push(["enableHeartBeatTimer", heartBeatTimer]);
  _paq.push(["setCookieDomain", cookieDomain]);
  _paq.push([
    "setDocumentTitle",
    globalThis.location.hostname + "/" + document.title,
  ]);

  _paq.push(["trackPageView"]);
  _paq.push(["enableLinkTracking"]);

  if (options.debug) {
    console.warn("Matomo debug mode enabled!");
    globalThis._mtm = globalThis._mtm || [];
    globalThis._mtm.push(["enableDebugMode"]);
  }

  (function () {
    const matomoHost = options.host;

    _paq.push(["setTrackerUrl", `${matomoHost}/matomo.php`]);
    _paq.push(["setSiteId", options.siteId]);

    const g = document.createElement("script");
    const s = document.getElementsByTagName("script")[0];

    g.id = "matomo-script";
    g.type = "text/javascript";
    g.async = true;
    g.defer = true;
    g.src = `${matomoHost}/matomo.js`;
    if (s.parentNode !== null) {
      s.parentNode.insertBefore(g, s);
    }
  })();
}
