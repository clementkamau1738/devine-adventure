/** Shared membership plan copy — homepage teaser + /membership page */

export type MembershipPlan = {
  type: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  label: string;
  price: number;
  period: string;
  tagline: string;
  color: string;
  featured?: boolean;
  features: string[];
};

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    type: 'MONTHLY',
    label: 'Monthly',
    price: 2500,
    period: '/month',
    tagline: 'Try it out',
    color: 'border-neutral-200',
    features: [
      'Member discounts on all events',
      'Free access to freemium hikes',
      'Priority booking',
      'Adventure newsletter',
    ],
  },
  {
    type: 'QUARTERLY',
    label: 'Quarterly',
    price: 6500,
    period: '/3 months',
    tagline: 'Most popular',
    color: 'border-sun',
    featured: true,
    features: [
      'Everything in Monthly',
      'Save KES 1,000',
      '3-month commitment',
      'Early event access',
    ],
  },
  {
    type: 'ANNUAL',
    label: 'Annual',
    price: 22000,
    period: '/year',
    tagline: 'Best value',
    color: 'border-neutral-200',
    features: [
      'Everything in Quarterly',
      'Save KES 8,000',
      '1 free private hike slot',
      'Devine merch kit',
    ],
  },
];
