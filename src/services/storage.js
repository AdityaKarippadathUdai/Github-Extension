import extension from "../browser/browser";

export async function getStored(keys) {
  return extension.storage.local.get(keys);
}

export async function setStored(values) {
  return extension.storage.local.set(values);
}

export async function removeStored(keys) {
  return extension.storage.local.remove(keys);
}
