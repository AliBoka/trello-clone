import { useState, useEffect } from 'react';

export const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // We intentionally trigger a re-render to bypass Next.js hydration mismatch with Zustand persist
    // eslint-disable-next-line
    setHasMounted(true);
  }, []);

  return hasMounted;
};
