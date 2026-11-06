'use client';
import { useEffect, useRef } from 'react';
import { gsap, reducedMotion, ScrollTrigger, setupMotion } from '@/lib/motion';

export default function Reveal({
  children,
  className = '',
  mode = 'rise',
  as: Tag = 'div',
  label,
}: {
  children: React.ReactNode;
  className?: string;
  mode?: 'rise' | 'develop';
  as?: 'div' | 'aside' | 'section';
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setupMotion();
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const ctx = gsap.context(() => {
      if (mode === 'develop') {
        gsap.fromTo(el, { clipPath: 'inset(46% 0% 46% 0%)', filter: 'brightness(1.8) saturate(0)' }, { clipPath: 'inset(0% 0% 0% 0%)', filter: 'brightness(1) saturate(1)', duration: 2, ease: 'expo.out', delay: 0.15 });
        gsap.to(el.querySelector('img'), { scale: 1.12, yPercent: 6, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
      } else {
        gsap.fromTo(el, { opacity: 0.001, y: 40 }, { opacity: 1, y: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
      }
    }, el);
    const t = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, [mode]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Any = Tag as any;
  return (
    <Any ref={ref} className={className} aria-label={label}>
      {children}
    </Any>
  );
}
