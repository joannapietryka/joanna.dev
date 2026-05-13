'use client';
import { useEffect, useRef } from 'react';

type Props = React.VideoHTMLAttributes<HTMLVideoElement>;

/**
 * Drop-in replacement for <video autoPlay> that reliably starts playback
 * after Next.js client-side navigation.  Browsers only honour the `autoplay`
 * HTML attribute during initial page parse; when React inserts a video node
 * into the DOM via a soft-nav the attribute is ignored, so we call
 * .load() + .play() imperatively after mount.
 */
export function AutoPlayVideo({ className, ...props }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.load();
    el.play().catch(() => {
      // Browser blocked autoplay (e.g. aggressive data-saver mode) — ignore.
    });
  }, []);

  return <video ref={ref} className={className} {...props} />;
}
