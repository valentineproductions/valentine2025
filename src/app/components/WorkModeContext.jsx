'use client';

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
} from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import styles from './WorkModeContext.module.css';

export const WORK_MODE_STORAGE_KEY = 'workViewMode';

/** Stills only when URL has `/work?stills` (or legacy `?mode=stills`). Plain `/work` always opens Motion; last tab is not restored from storage. */
export const WORK_QUERY_STILLS = 'stills';

function normalizeMode(s) {
  return s === 'stills' ? 'stills' : 'motion';
}

const WorkModeContext = createContext(null);

export function useWorkPageChrome() {
  return useContext(WorkModeContext);
}

function WorkModeProviderSuspended({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isWorkPage = pathname === '/work';

  const [mode, setModeState] = useState('motion');
  const [workNavHidden, setWorkNavHidden] = useState(false);
  const [motionReveal, setMotionReveal] = useState(false);
  const motionSlideIndexRef = useRef(0);
  const lastWindowScrollRef = useRef(0);

  useEffect(() => {
    if (!isWorkPage) return;

    if (searchParams.has('motion')) {
      router.replace('/work', { scroll: false });
      return;
    }

    if (searchParams.get('mode') === 'motion') {
      router.replace('/work', { scroll: false });
      return;
    }

    if (searchParams.get('mode') === 'stills') {
      setModeState('stills');
      try {
        localStorage.setItem(WORK_MODE_STORAGE_KEY, 'stills');
      } catch (_) {}
      router.replace('/work?stills', { scroll: false });
      return;
    }

    const hasStillsKey = searchParams.has(WORK_QUERY_STILLS);
    const stillsVal = searchParams.get(WORK_QUERY_STILLS);
    const wantsStills =
      hasStillsKey &&
      (stillsVal === '' ||
        stillsVal === null ||
        stillsVal === '1' ||
        stillsVal === 'true' ||
        (stillsVal && stillsVal !== '0' && stillsVal !== 'false'));

    if (wantsStills) {
      setModeState('stills');
      try {
        localStorage.setItem(WORK_MODE_STORAGE_KEY, 'stills');
      } catch (_) {}
      return;
    }

    /* Default: Motion on every visit to /work without an explicit stills query.
       Stills is only shown when the URL asks for it (?stills) or the user toggles in-session. */
    setModeState('motion');
    try {
      localStorage.setItem(WORK_MODE_STORAGE_KEY, 'motion');
    } catch (_) {}
  }, [isWorkPage, searchParams, router]);

  const setMode = useCallback(
    (m) => {
      const next = normalizeMode(m);
      setModeState(next);
      try {
        localStorage.setItem(WORK_MODE_STORAGE_KEY, next);
      } catch (_) {}
      router.replace(next === 'stills' ? '/work?stills' : '/work', { scroll: false });
      setWorkNavHidden(false);
      setMotionReveal(false);
      motionSlideIndexRef.current = 0;
    },
    [router]
  );

  const reportMotionSlideIndex = useCallback(
    (i) => {
      motionSlideIndexRef.current = i;
      setWorkNavHidden(false);
    },
    [motionReveal]
  );

  useEffect(() => {
    setWorkNavHidden(false);
  }, [isWorkPage, mode]);

  useEffect(() => {
    setWorkNavHidden(false);
  }, [motionReveal, isWorkPage, mode]);

  useEffect(() => {
    return;
  }, [motionReveal, isWorkPage, mode]);

  const value = useMemo(() => {
    if (!isWorkPage) return null;
    return {
      mode,
      setMode,
      workNavHidden,
      workNavStillsLight: mode === 'stills',
      motionReveal,
      setMotionReveal,
      reportMotionSlideIndex,
      motionSlideIndexRef,
    };
  }, [
    isWorkPage,
    mode,
    setMode,
    workNavHidden,
    motionReveal,
    reportMotionSlideIndex,
  ]);

  const showMotionRevealZone = false;

  return (
    <WorkModeContext.Provider value={value}>
      {children}
      {showMotionRevealZone && null}
    </WorkModeContext.Provider>
  );
}

export function WorkModeProvider({ children }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <WorkModeProviderSuspended>{children}</WorkModeProviderSuspended>
    </Suspense>
  );
}
