import browserPolyfill from "webextension-polyfill";

const nativeBrowser = globalThis.browser || browserPolyfill || globalThis.chrome;

export default nativeBrowser;
