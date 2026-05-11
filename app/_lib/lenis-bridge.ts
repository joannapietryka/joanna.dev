/**
 * Lets ScrollTrigger read/write scroll when the home shell uses Lenis on `#scroll-root`.
 * StudioGlass registers the instance; SiteFooter (and similar) can wire scrollerProxy.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let lenisRef: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerSiteLenis(instance: any | null) {
  lenisRef = instance;
}

export function unregisterSiteLenis() {
  lenisRef = null;
}

export function getSiteLenis() {
  return lenisRef;
}
