import extension from "../browser/browser";

extension.runtime.onInstalled.addListener(() => {
  extension.storage.local.get(["ghce.token"]).catch(() => {});
});

extension.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "popup_opened") {
    sendResponse({ ok: true });
  }
  return false;
});
