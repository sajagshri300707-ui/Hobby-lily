import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BranchContext = createContext(null);

// Branch storage helpers
export function getBranchKey(parentHobby, branchName) {
  return `branch_${parentHobby}_${branchName.toLowerCase().replace(/\s+/g, '-')}`;
}

export function getActiveBranchFromStorage() {
  try {
    const raw = localStorage.getItem('hl_active_branch');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setActiveBranchInStorage(branch) {
  if (branch) {
    localStorage.setItem('hl_active_branch', JSON.stringify(branch));
    document.documentElement.setAttribute('data-branch', 'true');
  } else {
    localStorage.removeItem('hl_active_branch');
    document.documentElement.removeAttribute('data-branch');
  }
}

export function BranchProvider({ children }) {
  const [activeBranch, setActiveBranchState] = useState(() => getActiveBranchFromStorage());

  // Apply branch theme on mount
  useEffect(() => {
    if (activeBranch) {
      document.documentElement.setAttribute('data-branch', 'true');
    } else {
      document.documentElement.removeAttribute('data-branch');
    }
  }, [activeBranch]);

  const setActiveBranch = useCallback((branch) => {
    setActiveBranchState(branch);
    setActiveBranchInStorage(branch);
  }, []);

  const startBranch = useCallback((parentHobby, branchName, pathData) => {
    const branch = {
      parentHobby,
      branchName,
      storageKey: getBranchKey(parentHobby, branchName),
      parentChapterAtBranch: pathData?.chapters?.length || 0,
      startedAt: Date.now(),
      status: 'active',
    };
    setActiveBranch(branch);
    return branch;
  }, [setActiveBranch]);

  const promoteBranch = useCallback(() => {
    // Branch becomes a full hobby — path already in localStorage under branch key
    // Just clear the active branch state
    setActiveBranch(null);
  }, [setActiveBranch]);

  const abandonBranch = useCallback(() => {
    // Merge branch chapters into parent path, then clear
    if (!activeBranch) return;
    try {
      const branchPath = JSON.parse(localStorage.getItem(activeBranch.storageKey) || 'null');
      const parentPath = JSON.parse(localStorage.getItem(`path_${activeBranch.parentHobby}`) || 'null');

      if (branchPath && parentPath) {
        // Mark branch chapters as completed and merge into parent
        const branchChapters = (branchPath.chapters || []).map(ch => ({
          ...ch,
          chapterTitle: `[Branch: ${activeBranch.branchName}] ${ch.chapterTitle}`,
          isBranchChapter: true,
          tasks: ch.tasks.map(t => ({ ...t, status: 'completed' })),
        }));
        parentPath.chapters = [...parentPath.chapters, ...branchChapters];
        localStorage.setItem(`path_${activeBranch.parentHobby}`, JSON.stringify(parentPath));
      }
    } catch (e) {
      console.error('Branch merge error:', e);
    }
    setActiveBranch(null);
  }, [activeBranch, setActiveBranch]);

  const leaveBranch = useCallback(() => {
    // Just exit branch mode without merging — branch stays in storage
    setActiveBranch(null);
  }, [setActiveBranch]);

  return (
    <BranchContext.Provider value={{
      activeBranch,
      startBranch,
      promoteBranch,
      abandonBranch,
      leaveBranch,
      isInBranch: !!activeBranch,
    }}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const ctx = useContext(BranchContext);
  if (!ctx) throw new Error('useBranch must be used within BranchProvider');
  return ctx;
}
