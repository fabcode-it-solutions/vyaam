import { useEffect, useState } from 'react';

import { useSessionStore } from './useSessionStore';

/** True once the persisted session has been read back from AsyncStorage. */
export function useSessionHydrated() {
  const [hydrated, setHydrated] = useState(useSessionStore.persist.hasHydrated());

  useEffect(() => {
    if (hydrated) return;
    return useSessionStore.persist.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);

  return hydrated;
}
