export const navLinks = [
  { href: '/exams', label: 'All Exams' },
  { href: '/categories', label: 'Categories' },
  { href: '/materials', label: 'Study Materials' },
  { href: '/pdf-library', label: 'PDF Library' },
  { href: '/mock-tests', label: 'Mock Tests' },
  { href: '/test-series', label: 'Test Series' },
];

export const resourceLinks = [
  { href: '/ai-importer', label: 'AI Question Importer' },
  { href: '/for-teachers', label: 'For Teachers' },
  { href: '/for-institutes', label: 'For Coaching Institutes' },
  { href: '/pricing', label: 'SaaS Pricing' },
];

export const companyLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
];

export const legalLinks = [
  { href: '/terms', label: 'Terms of Service' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/refund', label: 'Refund Policy' },
  { href: '/copyright', label: 'Copyright Policy' },
];

export const examCategorySlugs = [
  'icds-anganwadi',
  'panchayat',
  'clerkship',
  'state-psc',
  'ssc',
  'railway',
  'banking',
  'police-constable',
  'group-c-d',
];

export const examCategoryInfo: Record<string, { name: string; description: string }> = {
  'icds-anganwadi': {
    name: 'ICDS & Anganwadi',
    description: 'ICDS and Anganwadi recruitment examinations',
  },
  panchayat: {
    name: 'Panchayat',
    description: 'Panchayat and rural development recruitment examinations',
  },
  clerkship: {
    name: 'Clerkship',
    description: 'Clerk-grade and clerical recruitment examinations',
  },
  'state-psc': {
    name: 'State PSC',
    description: 'State Public Service Commission examinations including WBCS',
  },
  ssc: {
    name: 'SSC',
    description: 'SSC CGL, CHSL, MTS, GD and other SSC examinations',
  },
  railway: {
    name: 'Railway',
    description: 'Railway recruitment examinations (RRB, RRC)',
  },
  banking: {
    name: 'Banking',
    description: 'Banking examinations (IBPS, SBI, RBI)',
  },
  'police-constable': {
    name: 'Police & Constable',
    description: 'Police and constable recruitment examinations',
  },
  'group-c-d': {
    name: 'Group C & D',
    description: 'Group C and Group D government recruitment examinations',
  },
};
