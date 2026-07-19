import { useCallback, useEffect, useState } from "react";
import { getStored, removeStored, setStored } from "../services/storage.js";

export function useStorage(initialState = {}) {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    setLoading(true);
    const stored = await getStored(Object.keys(initialState));
    setState((current) => ({ ...current, ...stored }));
    setLoading(false);
    return stored;
  }, [initialState]);

  const update = useCallback(async (values) => {
    setState((current) => ({ ...current, ...values }));
    await setStored(values);
  }, []);

  const clear = useCallback(async (keys) => {
    await removeStored(keys);
    setState((current) => {
      const next = { ...current };
      for (const key of keys) delete next[key];
      return next;
    });
  }, []);

  useEffect(() => {
    hydrate().catch(() => setLoading(false));
  }, [hydrate]);

  return {
    state,
    loading,
    hydrate,
    update,
    clear
  };
}
