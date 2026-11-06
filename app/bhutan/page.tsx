import type { Metadata } from 'next';
import Destination from '@/components/Destination';
import { destinations } from '@/lib/content';

export const metadata: Metadata = { title: 'Bhutan — Mera Journey', description: "Private Bhutan journeys: Tiger's Nest, Druk Path, festivals and dzongs, designed by Kai Mai." };

export default function Page() {
  return <Destination d={destinations.bhutan} other={destinations.nepal} />;
}
