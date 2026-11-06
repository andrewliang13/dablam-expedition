import Link from 'next/link';
import { CALENDLY, EMAIL, INSTAGRAM, LINKEDIN, NAV, PHONE, PHONE_HREF } from '@/lib/content';

export default function EndCard() {
  return (
    <footer className="end" data-chapter="End card">
      <p className="end__mark">Mera Journey</p>
      <p className="end__line">Personal travel advisory for Nepal &amp; Bhutan</p>
      <div className="end__cols">
        <nav aria-label="Footer">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>{n.label}</Link>
          ))}
          <Link href="/plan-your-trip">Plan your trip</Link>
        </nav>
        <div>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <a href={PHONE_HREF}>{PHONE}</a>
          <a href={CALENDLY} target="_blank" rel="noopener">Discovery call on Calendly</a>
        </div>
        <div>
          <a href={INSTAGRAM} target="_blank" rel="noopener">Instagram</a>
          <a href={LINKEDIN} target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
      <p className="end__legal">© {new Date().getFullYear()} Mera Journey · Meratech LLC · Philadelphia, PA</p>
      <p className="end__credit">Tiger’s Nest photograph: Greenmnm69, CC BY 2.5, via Wikimedia Commons</p>
      <p className="end__credit">3D terrain: real Khumbu elevation from AWS Terrain Tiles (Mapzen; SRTM, NASA)</p>
    </footer>
  );
}
