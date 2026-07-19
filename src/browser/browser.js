import browserPolyfill from "webextension-polyfill";

const nativeBrowser = globalThis.browser || globalThis.chrome || browserPolyfill;

export default nativeBrowser;
