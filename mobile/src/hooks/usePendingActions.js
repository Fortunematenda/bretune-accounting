import { useCallback, useEffect, useState } from 'react';
import { clearPendingAction, enqueuePendingAction, getPendingActions } from '../lib/offlineStore';

export function usePendingActions() {
  const [actions, setActions] = useState([]);

  const refresh = useCallback(async () => {
    const next = await getPendingActions();
    setActions(next);
    return next;
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (action) => {
    const next = await enqueuePendingAction(action);
    setActions(next);
    return next;
  }, []);

  const remove = useCallback(async (id) => {
    const next = await clearPendingAction(id);
    setActions(next);
    return next;
  }, []);

  return { actions, refresh, add, remove };
}
