'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import Himalaya from './Himalaya';
import InquiryForm from './InquiryForm';
import EndCard from './EndCard';
import { CALENDLY, EMAIL, INSTAGRAM, LINKEDIN, PHONE, PHONE_HREF, credits, destinations, faqs, reel, steps } from '@/lib/content';
import { film, gsap, reducedMotion, ScrollTrigger, setupMotion } from '@/lib/motion';

const NARRATION =
  'I spent four months in Nepal. I climbed Mera Peak, filmed a documentary on its mad honey hunters, lived in the hill villages, and came back with operators I know by name.';

function Subs({ lines, className = '' }: { lines: string[]; className?: string }) {
  return (
    <div className={`subs ${className}`}>
      {lines.map((l, i) => (
        <p key={i} className="sub" data-sub={i}>
          {l}
        </p>
      ))}
    </div>
  );
}

function Slate({ scene, place, elev }: { scene: string; place: string; elev: string }) {
  return (
    <div className="slate">
      <span>{scene}</span>
      <strong>{place}</strong>
      <span>{elev}</span>
    </div>
  );
}

export default function Home() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setupMotion();
    film.p = 0;
    film.day = 0;
    film.wind = 0;
    film.visible = true;
    const rm = reducedMotion();

    const ctx = gsap.context(() => {
      // which scenes let the mountain through
      const showers = ['#open', '#summit'];
      const active = new Set<string>(['#open']);
      showers.forEach((sel) =>
        ScrollTrigger.create({
          trigger: sel,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (s) => {
            s.isActive ? active.add(sel) : active.delete(sel);
            film.visible = active.size > 0;
          },
        })
      );

      // OPEN: the drone pushes up the valley at dusk
      gsap.timeline({ scrollTrigger: { trigger: '#open', start: 'top top', end: 'bottom bottom', scrub: true } })
        .to(film, { p: 0.3, day: 0.22, ease: 'none' }, 0)
        .to('.open__card', { opacity: 0, y: -30, filter: 'blur(8px)', ease: 'power1.in' }, 0.3)
        .to('.open__quote', { opacity: 0, ease: 'power1.in' }, 0.2);

      if (!rm) {
        // title card settles in on load
        gsap.from('.open__title', { opacity: 0, letterSpacing: '0.06em', duration: 2.2, ease: 'expo.out', delay: 0.3 });
        gsap.from(['.open__sub', '.open__cta', '.open__quote'], { opacity: 0, y: 14, duration: 1.4, ease: 'expo.out', stagger: 0.14, delay: 0.8 });
      }

      // NARRATION: words light up as the voice-over plays
      const words = gsap.utils.toArray<HTMLElement>('.vo__w');
      gsap.fromTo(
        words,
        { opacity: 0.14 },
        { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: '#narration', start: 'top 40%', end: 'bottom 85%', scrub: true } }
      );

      // subtitles: one line at a time, driven by the scene's progress
      const subScenes = gsap.utils.toArray<HTMLElement>('[data-subs-scene]');
      subScenes.forEach((scene) => {
        const subs = Array.from(scene.querySelectorAll<HTMLElement>('.sub'));
        const [from, to] = (scene.dataset.subsRange || '0,1').split(',').map(Number);
        ScrollTrigger.create({
          trigger: scene,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (s) => {
            const t = (s.progress - from) / (to - from);
            const idx = t < 0 || t >= 1 ? -1 : Math.floor(t * subs.length);
            subs.forEach((el, i) => el.classList.toggle('is-on', i === idx));
          },
        });
      });

      // LUKLA: the frame lifts out of the dark and fills the screen
      gsap.timeline({ scrollTrigger: { trigger: '#lukla', start: 'top top', end: 'bottom bottom', scrub: true } })
        .fromTo(
          '.lukla__frame',
          { scale: 0.42, rotateX: 24, rotateZ: -3, yPercent: 8, filter: 'brightness(0.55) saturate(0.7)' },
          { scale: 1, rotateX: 0, rotateZ: 0, yPercent: 0, filter: 'brightness(0.95) saturate(1)', ease: 'power2.inOut', duration: 0.55 }
        )
        .fromTo('.lukla__frame img', { scale: 1.25 }, { scale: 1.02, ease: 'none', duration: 1 }, 0)
        .fromTo('#lukla .slate', { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.12 }, 0.45);

      // REEL: a strip of film turns on a drum
      const n = reel.length;
      const drum = document.querySelector<HTMLElement>('.drum');
      const caps = gsap.utils.toArray<HTMLElement>('.reel__cap');
      if (drum) {
        const st = { r: 0 };
        gsap.to(st, {
          r: -(360 / n) * (n - 1),
          ease: 'none',
          scrollTrigger: { trigger: '#reel', start: 'top top', end: 'bottom bottom', scrub: 0.6 },
          onUpdate: () => {
            drum.style.setProperty('--turn', `${st.r}deg`);
            const idx = Math.round(-st.r / (360 / n)) % n;
            caps.forEach((c, i) => c.classList.toggle('is-on', i === idx));
          },
        });
        gsap.fromTo('.reel__head', { opacity: 0, y: 30 }, { opacity: 1, y: 0, scrollTrigger: { trigger: '#reel', start: 'top 70%', end: 'top 20%', scrub: true } });
      }

      // SUMMIT: night falls on the glacier, dawn on the summit
      gsap.timeline({ scrollTrigger: { trigger: '#summit', start: 'top bottom', end: 'bottom bottom', scrub: true } })
        .fromTo(film, { p: 0.3, day: 0.35, wind: 0.2 }, { p: 1, day: 1, wind: 1, ease: 'none', immediateRender: false });
      const slates = gsap.utils.toArray<HTMLElement>('.summit__slate');
      const summitStick = document.querySelector<HTMLElement>('.summit__stick');
      ScrollTrigger.create({
        trigger: '#summit',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (s) => {
          summitStick?.style.setProperty('--sp', s.progress.toFixed(3));
          const idx = Math.min(slates.length - 1, Math.floor(s.progress * slates.length * 1.0001));
          slates.forEach((el, i) => el.classList.toggle('is-on', i === idx));
        },
      });

      // the frame tightens to 2.39:1 as the summit arrives, and opens again for the director's note
      const matte = (k: number) => {
        if (window.innerWidth <= window.innerHeight) return;
        const bar = document.querySelector<HTMLElement>('.bar--top')?.offsetHeight || 0;
        const h = Math.max(0, (window.innerHeight - window.innerWidth / 2.39) / 2 - bar);
        document.documentElement.style.setProperty('--matte', `${(h * k).toFixed(1)}px`);
      };
      const ramp = (a: number, b: number, x: number) => Math.min(1, Math.max(0, (x - a) / (b - a)));
      ScrollTrigger.create({ trigger: '#summit', start: 'top top', end: 'bottom bottom', onUpdate: (s) => matte(ramp(0.7, 0.86, s.progress)), onLeaveBack: () => matte(0) });
      ScrollTrigger.create({ trigger: '#directors-note', start: 'top bottom', end: 'top 30%', onUpdate: (s) => matte(1 - s.progress), onLeave: () => matte(0) });

      // DIRECTOR'S NOTE: the freeze-frame develops
      gsap.fromTo(
        '.note__still',
        { clipPath: 'inset(48% 0% 48% 0%)', filter: 'brightness(2) saturate(0)' },
        { clipPath: 'inset(0% 0% 0% 0%)', filter: 'brightness(1) saturate(1)', ease: 'expo.out', scrollTrigger: { trigger: '#directors-note', start: 'top 75%', end: 'top 15%', scrub: true } }
      );

      // CREDITS: the roll
      const roll = document.querySelector<HTMLElement>('.credits__roll');
      if (roll && !rm)
        gsap.fromTo(
          roll,
          { y: 0 },
          {
            y: () => -(roll.offsetHeight + window.innerHeight * 0.48),
            ease: 'none',
            scrollTrigger: { trigger: '#credits', start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
          }
        );

      // DOUBLE FEATURE: posters swing in on their hinges
      gsap.utils.toArray<HTMLElement>('.poster').forEach((p, i) => {
        gsap.fromTo(
          p,
          { rotateY: i ? -24 : 24, opacity: 0.55, z: -160 },
          { rotateY: 0, opacity: 1, z: 0, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 100%', end: 'top 60%', scrub: true } }
        );
      });

      // STORYBOARD: panels are dealt onto the table
      gsap.fromTo(
        '.board__panel',
        { rotateX: 70, y: 120, opacity: 0 },
        { rotateX: 0, y: 0, opacity: 1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.board', start: 'top 90%', end: 'top 30%', scrub: true } }
      );
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      document.documentElement.style.removeProperty('--matte');
      ctx.revert();
    };
  }, []);

  // 3D pointer tilt on posters
  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty('--tx', `${y * -6}deg`);
    e.currentTarget.style.setProperty('--ty', `${x * 8}deg`);
  };
  const untilt = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--tx', '0deg');
    e.currentTarget.style.setProperty('--ty', '0deg');
  };

  return (
    <div ref={root} className="film">
      <Himalaya />
      <div className="matte matte--top" aria-hidden="true" />
      <div className="matte matte--bottom" aria-hidden="true" />

      {/* OPEN */}
      <section id="open" className="open" data-chapter="Sc 01 · Ama Dablam, Khumbu" aria-labelledby="title">
        <div className="open__stick">
          <div className="open__card">
            <h1 id="title" className="open__title">
              Go where it’s real.
            </h1>
            <p className="open__sub">Private journeys in Nepal &amp; Bhutan, designed by Kai Mai</p>
            <a className="btn btn--light open__cta" href={CALENDLY} target="_blank" rel="noopener">
              Book a free 30-min discovery call
            </a>
          </div>
          <p className="sub open__quote">“I lived in Nepal for four months, climbed Mera Peak, and made a mad honey documentary.”</p>
        </div>
      </section>

      {/* NARRATION */}
      <section id="narration" className="vo" data-chapter="Voice-over · Kai Mai" aria-label="From Kai">
        <div className="vo__stick">
          <p className="vo__text">
            {NARRATION.split(' ').map((w, i) => (
              <span key={i} className="vo__w">
                {w}{' '}
              </span>
            ))}
          </p>
          <p className="vo__sig">Kai Mai, founder</p>
        </div>
      </section>

      {/* LUKLA */}
      <section id="lukla" className="lukla" data-chapter="Sc 02 · Lukla" data-elev="2860" data-subs-scene data-subs-range="0.42,0.98" aria-label="Flying into Lukla">
        <div className="lukla__stick">
          <figure className="lukla__frame grade">
            <Image src="/photos/nepal-bhutan-helicopter-lukla.jpg" alt="Kai's group in front of a red Fishtail Air helicopter before the flight to Lukla" fill sizes="100vw" priority={false} />
          </figure>
          <Slate scene="Sc 02" place="Lukla" elev="2,860 m" />
          <Subs
            lines={[
              'The flight into Lukla, gateway to the Khumbu.',
              'Hotels, permits, guides: I arrange them directly with local operators.',
              'No middlemen. No mass-market tour.',
            ]}
          />
        </div>
      </section>

      {/* SUMMIT */}
      <section id="summit" className="summit" data-chapter="Sc 03–05 · Mera Peak" data-elev="5045" data-elev-steps="5045,5780,6476" data-subs-scene data-subs-range="0.05,0.92" aria-label="The climb to Mera Peak">
        <div className="summit__stick">
          <div className="summit__slates">
            <div className="summit__slate is-on"><Slate scene="Sc 03" place="Khare" elev="5,045 m" /></div>
            <div className="summit__slate"><Slate scene="Sc 04" place="High Camp" elev="5,780 m" /></div>
            <div className="summit__slate"><Slate scene="Sc 05" place="Mera Peak summit" elev="6,476 m" /></div>
          </div>
          <Subs
            className="subs--low"
            lines={[
              'Mera Peak. This is the climb I made.',
              'Route planning, team building, training for altitude.',
              'Guidance on helicopter evacuation insurance before you go.',
              'And at the top, the light comes up over the Himalaya.',
            ]}
          />
          <p className="summit__big" aria-hidden="true">
            6,476 m
          </p>
        </div>
      </section>

      {/* DIRECTOR'S NOTE */}
      <section id="directors-note" className="note" data-chapter="Director’s note" data-elev="6476" aria-labelledby="note-h">
        <figure className="note__still grade">
          <Image src="/photos/founder-kai-mera-peak.jpg" alt="Kai Mai at dawn on the summit of Mera Peak, headlamp still on" fill loading="eager" sizes="(max-width: 760px) 100vw, 45vw" />
          <figcaption>Kai Mai on Mera Peak</figcaption>
        </figure>
        <div className="note__text">
          <h2 id="note-h" className="h2">Director’s note</h2>
          <p className="note__lede">I’m Kai Mai, an adventure photographer and travel advisor based in Philadelphia.</p>
          <p>
            Before this was a business, I planned expeditions and trips for family, friends and school organizations. Then I spent four months in Nepal: climbing Mera
            Peak, filming the mad honey hunters, living in the hill villages.
          </p>
          <p>
            Mera Journey is what came out of it: private journeys in Nepal and Bhutan, built on those relationships, not a catalog. Whether you’re planning a
            mountaineering expedition, a safari, or a relaxed trip in retirement, I build it for your party and stay with you while you travel.
          </p>
          <p className="note__links">
            <a href={INSTAGRAM} target="_blank" rel="noopener">Instagram @kai.mai12</a>
            <a href={LINKEDIN} target="_blank" rel="noopener">LinkedIn</a>
          </p>
        </div>
      </section>

      {/* REEL */}
      <section id="reel" className="reel" data-chapter="Sc 06 · Other cuts" aria-labelledby="reel-h">
        <div className="reel__stick">
          <div className="reel__head">
            <h2 id="reel-h" className="h2">Not a catalog.</h2>
            <p>Every itinerary is built for your party, your pace and your interests, matched to operators I’ve worked with personally.</p>
          </div>
          <div className="stage">
            <div className="drum" style={{ ['--n' as string]: reel.length }}>
              {reel.map((r, i) => (
                <figure key={r.src} className="cell" style={{ ['--i' as string]: i }}>
                  <div className="cell__img grade">
                    <Image src={r.src} alt={r.alt} fill sizes="(max-width: 760px) 70vw, 32vw" />
                  </div>
                </figure>
              ))}
            </div>
          </div>
          <div className="reel__caps" aria-live="off">
            {reel.map((r, i) => (
              <p key={r.src} className={`reel__cap sub${i === 0 ? ' is-on' : ''}`}>
                <span className="reel__place">{r.place}.</span> {r.line}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* CREDITS */}
      <section id="credits" className="credits" data-chapter="Credits · What I handle" aria-labelledby="credits-h">
        <div className="credits__stick">
          <div className="credits__roll">
            <h2 id="credits-h" className="credits__title">What I handle</h2>
            {credits.map((c) => (
              <div key={c.heading} className="credits__block">
                <h3>{c.heading}</h3>
                <dl>
                  {c.rows.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
            <p className="credits__end">Directed and arranged by Kai Mai</p>
          </div>
        </div>
      </section>

      {/* DOUBLE FEATURE */}
      <section id="double-feature" className="feature" data-chapter="Double feature · Nepal & Bhutan" aria-labelledby="feature-h">
        <h2 id="feature-h" className="h2 feature__h">Now showing: Nepal &amp; Bhutan</h2>
        <div className="feature__pair">
          {[destinations.nepal, destinations.bhutan].map((d) => (
            <Link key={d.slug} href={`/${d.slug}`} className="poster" onPointerMove={tilt} onPointerLeave={untilt}>
              <div className="poster__frame">
              <div className="poster__img grade">
                <Image src={d.image} alt={d.alt} fill sizes="(max-width: 760px) 100vw, 46vw" />
              </div>
              <div className="poster__body">
                <h3 className="poster__name">{d.name}</h3>
                <p className="poster__tag">{d.tagline}</p>
                <dl className="poster__facts">
                  {d.facts.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                <span className="poster__go">See the {d.name} cut</span>
              </div>
              </div>
            </Link>
          ))}
        </div>
        <p className="feature__combo">Can’t choose? I route combined Nepal + Bhutan journeys too.</p>
      </section>

      {/* STORYBOARD */}
      <section id="how" className="how" data-chapter="Storyboard · How it works" aria-labelledby="how-h">
        <h2 id="how-h" className="h2">How it works</h2>
        <ol className="board">
          {steps.map((s, i) => (
            <li key={s.shot} className="board__panel">
              <div className="board__frame">
                <span className="board__shot">Shot {i + 1}</span>
                <Image src={s.still} alt="" fill sizes="(max-width: 760px) 100vw, 25vw" />
                <h3>{s.shot}</h3>
              </div>
              <p>{s.body}</p>
              {i === 0 && (
                <a className="board__link" href={CALENDLY} target="_blank" rel="noopener">
                  Pick a time on Calendly
                </a>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Q&A */}
      <section id="qa" className="qa" data-chapter="Q&A after the screening" aria-labelledby="qa-h">
        <h2 id="qa-h" className="h2">Questions after the screening</h2>
        <div className="qa__list">
          {faqs.map((f) => (
            <details key={f.q} className="qa__item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
        <p className="qa__more">
          Anything else, from cancellations to lead times, ask me on the call or at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      </section>

      {/* FINAL */}
      <section id="start" className="start" data-chapter="Your journey" aria-labelledby="start-h">
        <div className="start__intro">
          <h2 id="start-h" className="start__h">Your film starts here.</h2>
          <p>Start with a free discovery call. I’ll ask where you want to go, when, and what kind of journey fits you.</p>
          <a className="btn btn--light btn--big" href={CALENDLY} target="_blank" rel="noopener">
            Book a free 30-min discovery call
          </a>
          <ul className="start__contact">
            <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            <li><a href={PHONE_HREF}>{PHONE}</a></li>
          </ul>
        </div>
        <div className="start__form">
          <h3 className="start__formh">Or send an inquiry</h3>
          <InquiryForm />
        </div>
      </section>

      <EndCard />
    </div>
  );
}
