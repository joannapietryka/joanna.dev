'use client';

import {useEffect} from 'react';

/** Added after first paint so the manifest is not on the initial request chain. */
export function DeferredManifest() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/site.webmanifest';
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, []);

  return null;
}
