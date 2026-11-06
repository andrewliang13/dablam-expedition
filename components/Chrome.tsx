'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CALENDLY, NAV } from '@/lib/content';
import { setupMotion, scrollToHash, ScrollTrigger } from '@/lib/motion';

const FPS = 24;
const RUNTIME_SECONDS = 22 * 60; // the page plays as a 22-minute film

function tc(seconds: number) {
  const f = Math.floor((seconds % 1) * FPS);
  const s = Math.floor(seconds);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`;
}

export default function Chrome() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const tcRef = useRef<HTMLSpanElement>(null);
  const chRef = useRef<HTMLSpanElement>(null);
  const elRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setupMotion();
    setOpen(false);
    window.scrollTo(0, 0);
    const t = setTimeout(() => {
      ScrollTrigger.refresh();
      if (window.location.hash) scrollToHash(window.location.hash);
    }, 120);

    let raf = 0;
    let lastChapter = '';
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const prog = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      if (tcRef.current) tcRef.current.textContent = tc(prog * RUNTIME_SECONDS);
      if (barRef.current) barRef.current.style.transform = `scaleX(${prog})`;

      const mid = window.innerHeight * 0.5;
      const secs = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'));
      let current: HTMLElement | null = null;
      for (const s of secs) if (s.getBoundingClientRect().top <= mid) current = s;
      current = current || secs[0] || null;
      if (current) {
        const name = current.dataset.chapter || '';
        if (name !== lastChapter && chRef.current) {
          chRef.current.textContent = name;
          lastChapter = name;
        }
        // elevation holds at the scene's slate value and only moves across the hand-off to the next scene
        const idx = secs.indexOf(current);
        const r = current.getBoundingClientRect();
        const span = Math.max(1, r.height - window.innerHeight);
        const prog = Math.min(1, Math.max(0, -r.top / span));
        const steps = (current.dataset.elevSteps || current.dataset.elev || '').split(',').filter(Boolean).map(Number);
        let elev = 0;
        if (steps.length) {
          const si = Math.min(steps.length - 1, Math.floor(prog * steps.length * 1.0001));
          elev = steps[si];
          const next = secs[idx + 1];
          const nb = next && next.dataset.elev ? Number((next.dataset.elevSteps || next.dataset.elev).split(',')[0]) : 0;
          const tail = Math.min(1, Math.max(0, (mid - r.bottom + window.innerHeight * 0.5) / (window.innerHeight * 0.5)));
          if (nb && nb !== elev) elev = Math.round(elev + (nb - elev) * tail);
        }
        if (elRef.current) elRef.current.textContent = elev ? `${elev.toLocaleString('en-US')} m` : '';
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
  }, [open]);

  const onNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault();
      scrollToHash(href.slice(1));
      history.replaceState(null, '', href);
    }
  };

  return (
    <>
      <header className="bar bar--top">
        <Link href="/" className="wordmark" aria-label="Mera Journey, home">
          Mera Journey
        </Link>
        <nav className="nav" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={(e) => onNav(e, n.href)} aria-current={pathname === n.href ? 'page' : undefined}>
              {n.label}
            </Link>
          ))}
          <Link href="/plan-your-trip" className="nav__plan" aria-current={pathname === '/plan-your-trip' ? 'page' : undefined}>
            Plan your trip
          </Link>
        </nav>
        <button className="menu-btn" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
          {open ? 'Close' : 'Menu'}
        </button>
      </header>

      <div id="menu" className="menu" hidden={!open}>
        <nav aria-label="Mobile">
          {[...NAV, { href: '/plan-your-trip', label: 'Plan your trip' }].map((n) => (
            <Link key={n.href} href={n.href} onClick={(e) => onNav(e, n.href)}>
              {n.label}
            </Link>
          ))}
        </nav>
        <a className="btn btn--light" href={CALENDLY} target="_blank" rel="noopener">
          Book a free discovery call
        </a>
      </div>

      <footer className="bar bar--bottom" aria-label="Playback">
        <div className="bar__progress" aria-hidden="true">
          <div ref={barRef} />
        </div>
        <span className="tc" aria-hidden="true">
          <span className="tc__rec" />
          <span ref={tcRef}>00:00:00:00</span>
        </span>
        <span className="tc__chapter" ref={chRef} aria-hidden="true" />
        <span className="tc__elev" ref={elRef} aria-hidden="true" />
        <a className="btn btn--light bar__cta" href={CALENDLY} target="_blank" rel="noopener">
          <span className="only-wide">Book a discovery call</span>
          <span className="only-narrow">Book a call</span>
        </a>
      </footer>
    </>
  );
}
