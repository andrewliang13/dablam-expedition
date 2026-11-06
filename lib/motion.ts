'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

let lenis: Lenis | null = null;
let registered = false;

export function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function setupMotion() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  if (lenis || reducedMotion()) return lenis;
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  if (process.env.NODE_ENV !== 'production') (window as unknown as { __lenis: Lenis }).__lenis = lenis;
  return lenis;
}

export function scrollToHash(hash: string) {
  const el = document.querySelector(hash) as HTMLElement | null;
  if (!el) return false;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6 });
  else el.scrollIntoView();
  return true;
}

export { gsap, ScrollTrigger };

/** Shared film clock read by the WebGL scene every frame. */
export const film = {
  /** camera progress along the ascent, 0 = valley at dusk, 1 = summit at dawn */
  p: 0,
  /** time of day, 0 = dusk, 0.5 = night, 1 = dawn */
  day: 0,
  /** whether any transparent section is showing the mountain */
  visible: true,
  /** extra wind for the snow near the summit */
  wind: 0,
};
