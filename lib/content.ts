export const CALENDLY = 'https://calendly.com/kaimaifoto/30min';
export const EMAIL = 'kaimaifoto@gmail.com';
export const PHONE = '+1 215 681 9267';
export const PHONE_HREF = 'tel:+12156819267';
export const INSTAGRAM = 'https://www.instagram.com/kai.mai12/';
export const LINKEDIN = 'https://www.linkedin.com/in/kaimai122/';

export const NAV = [
  { href: '/#credits', label: 'Journeys' },
  { href: '/nepal', label: 'Nepal' },
  { href: '/bhutan', label: 'Bhutan' },
  { href: '/#directors-note', label: 'About' },
];

export const reel = [
  {
    src: '/photos/nepal-bhutan-guesthouse-solu-khumbu.jpg',
    alt: 'Stone guesthouse with laundry drying under fresh snow in the Solu Khumbu',
    place: 'Solu Khumbu',
    line: 'Guesthouses run by families I know by name.',
  },
  {
    src: '/photos/nepal-bhutan-thangnak.jpg',
    alt: 'Trekking group resting on a snow slope beneath rock walls near Thangnak',
    place: 'Thangnak',
    line: 'Rest days are part of the route, not lost time.',
  },
  {
    src: '/photos/nepal-bhutan-poon-hill-sunrise-4633.jpg',
    alt: 'Crowd watching sunrise over the Annapurna range from Poon Hill',
    place: 'Poon Hill, Annapurna',
    line: 'Sunrise treks for the first-timer.',
  },
  {
    src: '/photos/nepal-bhutan-wild-rhinos-chitwan.jpg',
    alt: 'Wild rhinos in the grasslands of Chitwan',
    place: 'Chitwan',
    line: 'Jungle safaris in the lowlands.',
  },
  {
    src: '/photos/nepal-bhutan-poon-hill-sunrise-4531.jpg',
    alt: 'A guide raises both arms in joy at sunrise on Poon Hill',
    place: 'Poon Hill',
    line: 'Guides who become friends.',
  },
  {
    src: '/photos/nepal-bhutan-luxury-villa-chitwan.jpg',
    alt: 'A luxury villa in Chitwan',
    place: 'Chitwan',
    line: 'Comfort when the trip calls for it.',
  },
  {
    src: '/photos/nepal-bhutan-mera-peak.jpg',
    alt: 'Climbing team roped together on the snow of Mera Peak',
    place: 'Mera Peak',
    line: 'Expedition-style climbing, properly prepared.',
  },
];

export const credits = [
  {
    heading: 'Planning & on-the-ground support',
    rows: [
      ['Trip design', 'Your route, your pace, your party'],
      ['Lodging', 'Hotel booking & coordination'],
      ['Trek permits', 'TIMS, conservation areas, restricted regions'],
      ['Bhutan', 'Visa & permit arrangements'],
      ['Guides', 'Matched to your trip, vetted by me'],
      ['During your stay', 'WhatsApp support, 24/7'],
    ],
  },
  {
    heading: 'Expedition & trekking advisory',
    rows: [
      ['Route planning', 'Treks & climbs'],
      ['Team building', 'Guides, porters, logistics'],
      ['Insurance', 'Helicopter evacuation guidance'],
      ['Preparation', 'Training & fitness for altitude'],
    ],
  },
  {
    heading: 'Cut for',
    rows: [
      ['Party size', '1 to 12 people'],
      ['Trekkers', 'Everest, Annapurna, Langtang, remote valleys'],
      ['Climbers', 'Mera Peak & expedition-style routes'],
      ['Wildlife', 'Chitwan & Bardia'],
      ['Culture', 'Kathmandu Valley, village homestays'],
      ['The curious', 'Mad honey hunting in the Annapurna foothills'],
    ],
  },
];

export const steps = [
  {
    shot: 'Discovery call',
    still: '/photos/nepal-bhutan-poon-hill-sunrise-4531.jpg',
    body: 'Thirty minutes, free. I ask where you want to go, when, and what kind of journey fits you.',
  },
  {
    shot: 'Custom plan',
    still: '/photos/nepal-bhutan-thangnak.jpg',
    body: 'I draft an itinerary for your party, your pace and your interests, matched to operators I have worked with personally.',
  },
  {
    shot: 'Refine together',
    still: '/photos/nepal-bhutan-guesthouse-solu-khumbu.jpg',
    body: 'We work through routes, permits, guides and logistics until it is right.',
  },
  {
    shot: 'Go',
    still: '/photos/nepal-bhutan-mera-peak.jpg',
    body: "You travel with vetted locals and my support before and during the trip, including WhatsApp while you're there.",
  },
];

export const faqs = [
  {
    q: 'How does the consulting process work?',
    a: 'It starts with a free 30-minute discovery call. I draft a custom plan, we refine routes, permits, guides and logistics together, then you go, with my support before and during the trip.',
  },
  {
    q: 'Are you a travel agent or a tour operator?',
    a: "Neither, in the mass-market sense. I'm a personal travel advisor. I design your trip and work directly with local operators I know, with no middlemen.",
  },
  {
    q: 'Do you handle visas and permits?',
    a: 'Yes. I arrange trek permits (TIMS, conservation areas, restricted regions) and Bhutan visa and permit arrangements as part of planning.',
  },
];

export const destinations = {
  nepal: {
    slug: 'nepal',
    name: 'Nepal',
    tagline: 'The Roof of the World',
    image: '/photos/destinations-nepal.jpg',
    alt: 'Snow-dusted Himalayan ridges under cloud above golden alpine grass in Nepal',
    lede: "Home to eight of the world's fourteen 8,000-metre peaks.",
    highlights: [
      'Everest, Annapurna, Langtang and remote valley treks',
      'Mera Peak and expedition-style climbing',
      'Chitwan and Bardia wildlife',
      'Kathmandu Valley heritage and village culture',
      'Mad honey hunting',
    ],
    bestFor: 'Trekkers, climbers, culture seekers, wildlife lovers.',
    facts: [
      ['Capital', 'Kathmandu'],
      ['Currency', 'Nepalese Rupee (NPR)'],
      ['Language', 'Nepali'],
      ['Best months', 'Mar–May, Sep–Nov'],
    ],
  },
  bhutan: {
    slug: 'bhutan',
    name: 'Bhutan',
    tagline: 'The Last Shangri-La',
    image: '/photos/bhutan-taktshang.jpg',
    alt: "Paro Taktsang, the Tiger's Nest monastery, on a cliff above the Paro valley",
    lede: 'Cliff monasteries, dzongs and festival valleys, with fewer crowds than Nepal’s main trails.',
    highlights: [
      "Tiger's Nest and central Bhutan circuits",
      'Druk Path and Jomolhari treks',
      'Festival timing and dzong visits',
      'Comfort-paced cultural programs',
      'Combined Nepal + Bhutan routing',
    ],
    bestFor: "Couples, culture-first travelers, trekkers wanting fewer crowds than Nepal's main trails.",
    facts: [
      ['Capital', 'Thimphu'],
      ['Currency', 'Ngultrum (BTN), pegged to INR'],
      ['Language', 'Dzongkha'],
      ['Best months', 'Mar–May, Sep–Nov'],
    ],
    note: 'Bhutan charges visitors a Sustainable Development Fee.',
  },
} as const;
