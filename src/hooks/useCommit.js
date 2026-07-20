import { useCallback, useMemo, useState } from "react";
import { commitFile } from "../services/commitService.js";
import {
  validateBranch,
  validateCode,
  validateCommitMessage,
  validateFilePath,
  validateRepository,
  validateToken
} from "../utils/validators.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useRepo } from "../context/RepoContext.jsx";

export function useCommit() {
  const auth = useAuth();
  const repo = useRepo();
  const [committing, setCommitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = useCallback(
    ({ code, commitMessage }) => {
      const errors = {};
      if (!validateToken(auth.token)) errors.token = "Save a valid GitHub token first.";
      if (!validateRepository(repo.selectedRepo)) errors.repository = "Select a repository.";
      if (!validateBranch(repo.selectedBranch)) errors.branch = "Select a branch.";
      if (!validateFilePath(repo.filePath)) errors.filePath = "Enter a valid file path such as src/components/App.jsx.";
      if (!validateCode(code)) errors.code = "Paste or type source code.";
      if (!validateCommitMessage(commitMessage)) errors.commitMessage = "Enter a commit message.";
      return errors;
    },
    [auth.token, repo.filePath, repo.selectedBranch, repo.selectedRepo]
  );

  const submitCommit = useCallback(
    async ({ code, commitMessage }) => {
      const errors = validate({ code, commitMessage });
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) {
        setToast({ type: "error", message: "Fix the highlighted fields and try again." });
        return { ok: false, errors };
      }

      setCommitting(true);
      setToast(null);
      try {
        const result = await commitFile({
          token: auth.token,
          owner: repo.selectedRepo.owner.login,
          repo: repo.selectedRepo.name,
          branch: repo.selectedBranch,
          filePath: repo.filePath.trim(),
          commitMessage: commitMessage.trim(),
          content: code
        });
        await repo.rememberCommitMessage(commitMessage.trim());
        setToast({
          type: "success",
          message: `Committed ${repo.filePath.trim()} to ${repo.selectedRepo.full_name}.`
        });
        setFieldErrors({});
        return { ok: true, result };
      } catch (cause) {
        setToast({ type: "error", message: cause?.message || "Commit failed." });
        return { ok: false, error: cause };
      } finally {
        setCommitting(false);
      }
    },
    [auth.token, repo, validate]
  );

  return useMemo(
    () => ({
      committing,
      toast,
      fieldErrors,
      setToast,
      submitCommit
    }),
    [committing, toast, fieldErrors, submitCommit]
  );
}
