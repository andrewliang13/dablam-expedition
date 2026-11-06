import Image from 'next/image';
import Link from 'next/link';
import EndCard from './EndCard';
import Reveal from './Reveal';
import { CALENDLY, destinations } from '@/lib/content';

type D = (typeof destinations)[keyof typeof destinations];

export default function Destination({ d, other }: { d: D; other: D }) {
  return (
    <div className="dest">
      <section className="dest__hero" data-chapter={`Feature · ${d.name}`} aria-labelledby="dest-h">
        <Reveal className="dest__img grade" mode="develop">
          <Image src={d.image} alt={d.alt} fill priority sizes="100vw" />
        </Reveal>
        <div className="dest__title">
          <h1 id="dest-h" className="dest__name">{d.name}</h1>
          <p className="dest__tagline">{d.tagline}</p>
          <p className="sub sub--static">{d.lede}</p>
        </div>
      </section>

      <section className="dest__body" data-chapter={`${d.name} · The cut`}>
        <Reveal className="dest__col">
          <h2 className="h2">What we can shoot here</h2>
          <ul className="dest__list">
            {d.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <p className="dest__best"><strong>Best for:</strong> {d.bestFor}</p>
          {'note' in d && d.note ? <p className="dest__note">{d.note}</p> : null}
        </Reveal>
        <Reveal className="dest__slate" as="aside" label={`${d.name} quick facts`}>
          <dl>
            {d.facts.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <a className="btn btn--light" href={CALENDLY} target="_blank" rel="noopener">Book a discovery call</a>
          <Link className="btn btn--ghost" href={`/plan-your-trip?destination=${encodeURIComponent(d.name)}`}>Send an inquiry</Link>
        </Reveal>
      </section>

      <section className="dest__next" data-chapter="Next feature">
        <Link href={`/${other.slug}`} className="dest__nextlink" aria-label={`Next feature: ${other.name}, ${other.tagline}`}>
          <strong>{other.name}</strong>
          <em>{other.tagline}</em>
        </Link>
      </section>
      <EndCard />
    </div>
  );
}
