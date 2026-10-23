export const navLinks = [
  { href: '/exams', label: 'All Exams' },
  { href: '/categories', label: 'Categories' },
  { href: '/articles', label: 'Daily Articles' },
  { href: '/materials', label: 'Study Materials' },
  { href: '/pdf-library', label: 'PDF Library' },
  { href: '/mock-tests', label: 'Mock Tests' },
  { href: '/test-series', label: 'Test Series' },
];

export const resourceLinks = [
  { href: '/admin', label: 'Admin Portal' },
  { href: '/admin/articles', label: 'Article Publishing Studio' },
  { href: '/teacher/question-studio', label: 'Multilingual Question Studio' },
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

export const examCategoryInfo: Record<string, { name: string; description: string; image?: string }> = {
  'icds-anganwadi': {
    name: 'ICDS & Anganwadi',
    description: 'ICDS and Anganwadi recruitment examinations',
    image: '/assets/aistudio/icds_a53ae331.jpg',
  },
  panchayat: {
    name: 'Panchayat',
    description: 'Panchayat and rural development recruitment examinations',
    image: '/assets/aistudio/panchayet_ea84dc7f.jpg',
  },
  clerkship: {
    name: 'Clerkship',
    description: 'Clerk-grade and clerical recruitment examinations',
    image: '/assets/aistudio/psc-removebg-preview_3e2c49ba.png',
  },
  'state-psc': {
    name: 'State PSC',
    description: 'State Public Service Commission examinations including WBCS',
    image: '/assets/aistudio/psc-removebg-preview_3e2c49ba.png',
  },
  ssc: {
    name: 'SSC',
    description: 'SSC CGL, CHSL, MTS, GD and other SSC examinations',
    image: '/assets/aistudio/ssc_75038755.jpg',
  },
  railway: {
    name: 'Railway',
    description: 'Railway recruitment examinations (RRB, RRC)',
    image: '/assets/aistudio/rail-removebg-preview_562dda19.png',
  },
  banking: {
    name: 'Banking',
    description: 'Banking examinations (IBPS, SBI, RBI)',
    image: '/assets/aistudio/bank-removebg-preview_aec372c3.png',
  },
  'police-constable': {
    name: 'Police & Constable',
    description: 'Police and constable recruitment examinations',
    image: '/assets/aistudio/police_f2b8d5a1.webp',
  },
  'group-c-d': {
    name: 'Group C & D',
    description: 'Group C and Group D government recruitment examinations',
    image: '/assets/aistudio/cd_4f832ae4.jpg',
  },
};
