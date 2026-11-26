'use client';
import { useCallback, useEffect, useState } from 'react';

export type Mode = 'night' | 'day';
const KEY = 'yug-theme';

/** Day/night mode, remembered between pages. Starts as night to match server HTML. */
export function useTheme() {
  const [mode, setMode] = useState<Mode>('night');
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === 'day' || saved === 'night') setMode(saved);
    } catch {}
  }, []);
  const toggle = useCallback(() => {
    setMode((m) => {
      const next: Mode = m === 'night' ? 'day' : 'night';
      try { localStorage.setItem(KEY, next); } catch {}
      return next;
    });
  }, []);
  return { mode, toggle };
}

/** Keeps the toggle button's accessible label in sync with the current mode. */
export function useToggleLabel(root: React.RefObject<HTMLElement | null>, mode: Mode) {
  useEffect(() => {
    root.current?.querySelectorAll('.tgl').forEach((b) => b.setAttribute('aria-label', mode === 'night' ? 'Switch to day mode' : 'Switch to night mode'));
  }, [root, mode]);
}
