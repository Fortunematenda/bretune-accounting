import { useEffect, useState } from 'react';
import { getCachedValue, setCachedValue } from '../lib/offlineStore';

export function useCachedResource(cacheKey, data) {
  const [cached, setCached] = useState(null);

  useEffect(() => {
    let mounted = true;
    getCachedValue(cacheKey).then((value) => {
      if (mounted) setCached(value);
    });
    return () => {
      mounted = false;
    };
  }, [cacheKey]);

  useEffect(() => {
    if (data == null) return;
    setCachedValue(cacheKey, data).catch(() => {});
  }, [cacheKey, data]);

  return cached;
}
