import type { Metadata } from 'next';
import Destination from '@/components/Destination';
import { destinations } from '@/lib/content';

export const metadata: Metadata = { title: 'Nepal — Mera Journey', description: 'Private treks, climbs, safaris and culture journeys in Nepal, designed by Kai Mai.' };

export default function Page() {
  return <Destination d={destinations.nepal} other={destinations.bhutan} />;
}
