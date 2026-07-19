import React, { useEffect, useMemo, useState } from "react";
import extension from "./browser/browser";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { RepoProvider, useRepo } from "./context/RepoContext.jsx";
import { useCommit } from "./hooks/useCommit.js";
import Popup from "./popup/Popup.jsx";

function AppContent() {
  const auth = useAuth();
  const repo = useRepo();
  const commit = useCommit();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await auth.bootstrap();
      } finally {
        if (active) setReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      auth,
      repo,
      commit,
      ready
    }),
    [auth, repo, commit, ready]
  );

  return <Popup {...value} />;
}

export default function App() {
  useEffect(() => {
    void extension.runtime?.sendMessage?.({ type: "popup_opened" });
  }, []);

  return (
    <AuthProvider>
      <RepoProvider>
        <AppContent />
      </RepoProvider>
    </AuthProvider>
  );
}
