import type { Metadata } from 'next';
import EndCard from '@/components/EndCard';
import InquiryForm from '@/components/InquiryForm';
import { CALENDLY, EMAIL, PHONE, PHONE_HREF } from '@/lib/content';

export const metadata: Metadata = { title: 'Plan your trip — Mera Journey', description: 'Book a free 30-minute discovery call or send Kai an inquiry about Nepal or Bhutan.' };

export default async function Page({ searchParams }: { searchParams: Promise<{ destination?: string }> }) {
  const { destination = '' } = await searchParams;
  const valid = ['Nepal', 'Bhutan', 'Nepal + Bhutan'].includes(destination) ? destination : '';
  return (
    <div className="plan">
      <section className="start start--page" data-chapter="Pre-production · Plan your trip" aria-labelledby="plan-h">
        <div className="start__intro">
          <h1 id="plan-h" className="start__h">Plan your trip</h1>
          <p>Start with a free discovery call. I’ll ask where you want to go, when, and what kind of journey fits you. Custom itineraries for 1 to 12 people.</p>
          <a className="btn btn--light btn--big" href={CALENDLY} target="_blank" rel="noopener">
            Book a free 30-min discovery call
          </a>
          <ul className="start__contact">
            <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            <li><a href={PHONE_HREF}>{PHONE}</a></li>
          </ul>
        </div>
        <div className="start__form">
          <h2 className="start__formh">Send an inquiry</h2>
          <InquiryForm defaultDestination={valid} />
        </div>
      </section>
      <EndCard />
    </div>
  );
}
