export type MockQuestion = {
  id: number;
  question: string;
  options: string[];
  correctOption: number; // 0 for A, 1 for B, 2 for C, 3 for D
  explanation: string;
  subject: string;
  topic?: string;
};

export type MockTest = {
  id: string;
  title: string;
  category: string;
  categoryName: string;
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  positiveMarks: number;
  negativeMarks: number;
  language: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  description: string;
  questions: MockQuestion[];
};

export const MOCK_TESTS: MockTest[] = [
  {
    id: 'ssc-cgl-tier1-mini',
    title: 'SSC CGL Tier 1 All-India Mock Test 2026',
    category: 'ssc',
    categoryName: 'SSC',
    durationMinutes: 15,
    totalQuestions: 10,
    totalMarks: 20,
    positiveMarks: 2,
    negativeMarks: 0.5,
    language: 'English & Hindi',
    difficulty: 'Moderate',
    description: 'Comprehensive Tier 1 practice covering Reasoning, Quantitative Aptitude, General Awareness, and English Comprehension with official -0.50 negative marking.',
    questions: [
      {
        id: 1,
        subject: 'General Intelligence & Reasoning',
        question: 'Select the related word from the given alternatives: Ocean : Water :: Glacier : ?',
        options: ['Mountain', 'Ice', 'Cave', 'Refrigeration'],
        correctOption: 1,
        explanation: 'An ocean is composed primarily of water, just as a glacier is composed primarily of ice.',
      },
      {
        id: 2,
        subject: 'General Intelligence & Reasoning',
        question: 'In a certain code language, "SARKARI" is written as "TBTLBSI". How will "EXAM" be written in that code?',
        options: ['FYBN', 'EYBN', 'FYBM', 'FZBN'],
        correctOption: 0,
        explanation: 'Each letter is shifted forward by +1: E(+1)=F, X(+1)=Y, A(+1)=B, M(+1)=N. So "FYBN".',
      },
      {
        id: 3,
        subject: 'Quantitative Aptitude',
        question: 'The ratio of the ages of A and B is 4 : 5. After 5 years, the ratio becomes 5 : 6. What is the present age of A?',
        options: ['15 years', '20 years', '25 years', '30 years'],
        correctOption: 1,
        explanation: 'Let ages be 4x and 5x. After 5 years: (4x+5)/(5x+5) = 5/6. 6(4x+5) = 5(5x+5) => 24x + 30 = 25x + 25 => x = 5. Present age of A = 4 * 5 = 20 years.',
      },
      {
        id: 4,
        subject: 'Quantitative Aptitude',
        question: 'A shopkeeper marks an article 25% above cost price and allows a discount of 10%. What is his profit percentage?',
        options: ['12.5%', '15%', '10%', '14%'],
        correctOption: 0,
        explanation: 'Let CP = 100. MP = 125. SP = 125 - 10% of 125 = 125 - 12.5 = 112.5. Profit = 12.5%.',
      },
      {
        id: 5,
        subject: 'General Awareness',
        question: 'Which Article of the Indian Constitution provides for the "Right to Constitutional Remedies"?',
        options: ['Article 19', 'Article 21', 'Article 32', 'Article 44'],
        correctOption: 2,
        explanation: 'Article 32 gives the right to individuals to move to the Supreme Court to seek justice when they feel their fundamental right has been ' +
          'unduly deprived. Dr. B.R. Ambedkar called it the "heart and soul of the Constitution".',
      },
      {
        id: 6,
        subject: 'General Awareness',
        question: 'Who is known as the "Father of the Green Revolution in India"?',
        options: ['Dr. Verghese Kurien', 'M. S. Swaminathan', 'Norman Borlaug', 'Homi Bhabha'],
        correctOption: 1,
        explanation: 'Dr. M. S. Swaminathan was the father of the Green Revolution in India, introducing high-yielding varieties of wheat and rice.',
      },
      {
        id: 7,
        subject: 'English Comprehension',
        question: 'Select the most appropriate synonym of the word "DILIGENT":',
        options: ['Industrious', 'Lethargic', 'Ignorant', 'Hasty'],
        correctOption: 0,
        explanation: '"Diligent" means having or showing care and conscientiousness in one\'s work. "Industrious" is the nearest synonym.',
      },
      {
        id: 8,
        subject: 'English Comprehension',
        question: 'Identify the segment with a grammatical error: "Neither the teacher nor the students was present in the auditorium."',
        options: ['Neither the teacher', 'nor the students', 'was present', 'in the auditorium'],
        correctOption: 2,
        explanation: 'When subjects are connected by "neither... nor", the verb agrees with the closer subject ("students", plural). Therefore, it should be "were present".',
      },
      {
        id: 9,
        subject: 'General Intelligence & Reasoning',
        question: 'Find the missing number in the series: 3, 7, 15, 31, 63, ?',
        options: ['125', '126', '127', '129'],
        correctOption: 2,
        explanation: 'Pattern: (x * 2) + 1. 3*2+1=7; 7*2+1=15; 15*2+1=31; 31*2+1=63; 63*2+1 = 127.',
      },
      {
        id: 10,
        subject: 'Quantitative Aptitude',
        question: 'A train 180 metres long is running at a speed of 54 km/h. How many seconds will it take to cross a pole?',
        options: ['10 seconds', '12 seconds', '15 seconds', '18 seconds'],
        correctOption: 1,
        explanation: 'Speed in m/s = 54 * (5/18) = 15 m/s. Time to cross pole = Distance / Speed = 180 / 15 = 12 seconds.',
      },
    ],
  },
  {
    id: 'wbcs-prelims-mini',
    title: 'WBCS (West Bengal Civil Service) Prelims Practice Set',
    category: 'state-psc',
    categoryName: 'State PSC',
    durationMinutes: 15,
    totalQuestions: 8,
    totalMarks: 8,
    positiveMarks: 1,
    negativeMarks: 0.33,
    language: 'English & Bengali',
    difficulty: 'Moderate',
    description: 'Model questions based on WBCS Preliminary General Studies syllabus: Indian National Movement, History of Bengal, Geography of West Bengal, and Polity.',
    questions: [
      {
        id: 1,
        subject: 'History of India & Indian National Movement',
        question: 'Who founded the "Amrita Bazar Patrika" in 1868?',
        options: ['Sisir Kumar Ghosh & Motilal Ghosh', 'Surendranath Banerjee', 'Bipin Chandra Pal', 'Barindra Kumar Ghosh'],
        correctOption: 0,
        explanation: 'Amrita Bazar Patrika was started in 1868 by two brothers, Sisir Kumar Ghosh and Moti Lal Ghosh, in Jessore (now Bangladesh) before shifting to Kolkata.',
      },
      {
        id: 2,
        subject: 'Geography of West Bengal',
        question: 'Which district of West Bengal has the lowest literacy rate according to Census 2011?',
        options: ['Purulia', 'Uttar Dinajpur', 'Maldah', 'Bankura'],
        correctOption: 1,
        explanation: 'According to Census 2011, Uttar Dinajpur district recorded the lowest literacy rate (59.07%) in West Bengal.',
      },
      {
        id: 3,
        subject: 'Indian National Movement',
        question: 'In which year did the historic Partition of Bengal take effect under Lord Curzon?',
        options: ['1904', '1905', '1906', '1911'],
        correctOption: 1,
        explanation: 'The Partition of Bengal took effect on 16th October 1905, which was observed as "Raksha Bandhan Day" led by Rabindranath Tagore.',
      },
      {
        id: 4,
        subject: 'Indian Polity & Economy',
        question: 'Under which Article of the Constitution can a High Court issue writs for the enforcement of fundamental rights?',
        options: ['Article 32', 'Article 131', 'Article 226', 'Article 243'],
        correctOption: 2,
        explanation: 'Article 226 empowers High Courts to issue writs including habeas corpus, mandamus, prohibition, quo warranto, and certiorari.',
      },
      {
        id: 5,
        subject: 'General Science',
        question: 'Which gas is predominantly released during anaerobic decomposition in wetlands and paddy fields?',
        options: ['Carbon dioxide', 'Methane (CH4)', 'Nitrous oxide', 'Sulphur dioxide'],
        correctOption: 1,
        explanation: 'Methane (marsh gas) is produced by methanogenic bacteria in anaerobic environments such as flooded rice paddies and wetlands.',
      },
      {
        id: 6,
        subject: 'English Composition',
        question: 'Fill in the blank: The manager was not satisfied ______ the employee’s explanation.',
        options: ['with', 'by', 'at', 'about'],
        correctOption: 0,
        explanation: 'The preposition "with" is correctly used with the adjective "satisfied" when referring to a thing or performance: satisfied with.',
      },
      {
        id: 7,
        subject: 'Geography of West Bengal',
        question: 'Which is the highest peak in West Bengal?',
        options: ['Sandakphu', 'Falut', 'Sabargram', 'Tonglu'],
        correctOption: 0,
        explanation: 'Sandakphu (3,636 metres / 11,930 ft) on the Singalila Ridge is the highest point in the state of West Bengal.',
      },
      {
        id: 8,
        subject: 'Indian History',
        question: 'Who was the Viceroy of India when the capital of British India was shifted from Calcutta to Delhi in 1911?',
        options: ['Lord Minto', 'Lord Hardinge II', 'Lord Chelmsford', 'Lord Curzon'],
        correctOption: 1,
        explanation: 'Lord Hardinge II was the Viceroy during the Delhi Durbar of 1911 when King George V announced the transfer of the capital to Delhi.',
      },
    ],
  },
  {
    id: 'railway-ntpc-mini',
    title: 'Railway RRB NTPC Stage-1 CBT Speed Mock',
    category: 'railway',
    categoryName: 'Railway',
    durationMinutes: 10,
    totalQuestions: 6,
    totalMarks: 6,
    positiveMarks: 1,
    negativeMarks: 0.33,
    language: 'English & Hindi',
    difficulty: 'Easy',
    description: 'Fast-paced mock test mirroring Railway Recruitment Board (RRB) computer based test (CBT) pattern with -0.33 negative marking.',
    questions: [
      {
        id: 1,
        subject: 'General Awareness',
        question: 'Where is the headquarters of the Eastern Railway Zone located?',
        options: ['Gorakhpur', 'Kolkata (Fairlie Place)', 'Bhubaneswar', 'Hajipur'],
        correctOption: 1,
        explanation: 'The headquarters of Eastern Railway is located at Fairlie Place, Kolkata.',
      },
      {
        id: 2,
        subject: 'General Science',
        question: 'What is the SI unit of electric resistance?',
        options: ['Ampere', 'Volt', 'Ohm', 'Joule'],
        correctOption: 2,
        explanation: 'The SI unit of electric resistance is Ohm (represented by the Greek letter Omega).',
      },
      {
        id: 3,
        subject: 'Mathematics',
        question: 'Find the Least Common Multiple (LCM) of 12, 18, and 24.',
        options: ['36', '48', '72', '96'],
        correctOption: 2,
        explanation: '12 = 2^2 * 3, 18 = 2 * 3^2, 24 = 2^3 * 3. LCM = 2^3 * 3^2 = 8 * 9 = 72.',
      },
      {
        id: 4,
        subject: 'Reasoning',
        question: 'Complete the analogy: Doctor : Hospital :: Teacher : ?',
        options: ['Book', 'School', 'Student', 'Chalk'],
        correctOption: 1,
        explanation: 'A doctor works in a hospital; similarly, a teacher works in a school.',
      },
      {
        id: 5,
        subject: 'General Awareness',
        question: 'Which Indian train was formerly known as "Train 18"?',
        options: ['Gatimaan Express', 'Vande Bharat Express', 'Tejas Express', 'Duronto Express'],
        correctOption: 1,
        explanation: 'Vande Bharat Express was conceived and manufactured by Integral Coach Factory (ICF) Chennai under the project name "Train 18".',
      },
      {
        id: 6,
        subject: 'Mathematics',
        question: 'If the simple interest on ₹2,000 for 3 years at 5% per annum is calculated, what is the interest amount?',
        options: ['₹300', '₹350', '₹400', '₹250'],
        correctOption: 0,
        explanation: 'SI = (P * R * T) / 100 = (2000 * 5 * 3) / 100 = ₹300.',
      },
    ],
  },
  {
    id: 'icds-supervisor-mini',
    title: 'ICDS & Anganwadi Supervisor Model Test',
    category: 'icds-anganwadi',
    categoryName: 'ICDS & Anganwadi',
    durationMinutes: 10,
    totalQuestions: 6,
    totalMarks: 6,
    positiveMarks: 1,
    negativeMarks: 0.25,
    language: 'English & Bengali',
    difficulty: 'Moderate',
    description: 'Designed specifically for Anganwadi Worker and Supervisor recruitment covering Public Health, Child Nutrition, and Arithmetic.',
    questions: [
      {
        id: 1,
        subject: 'Nutrition & Public Health',
        question: 'Deficiency of Vitamin A in children primarily causes which disorder?',
        options: ['Rickets', 'Night Blindness (Nyctalopia)', 'Scurvy', 'Goitre'],
        correctOption: 1,
        explanation: 'Vitamin A deficiency leads to xerophthalmia and night blindness in young children.',
      },
      {
        id: 2,
        subject: 'Child Development & ICDS Scheme',
        question: 'In which year was the Integrated Child Development Services (ICDS) scheme launched in India?',
        options: ['1971', '1975', '1985', '1992'],
        correctOption: 1,
        explanation: 'ICDS was launched on 2nd October 1975 (on the 106th birth anniversary of Mahatma Gandhi).',
      },
      {
        id: 3,
        subject: 'Nutrition & Health',
        question: 'Colostrum, the first breast milk produced after childbirth, is exceptionally rich in:',
        options: ['Antibodies (IgA) and protein', 'Pure fat only', 'Sucrose', 'Starch'],
        correctOption: 0,
        explanation: 'Colostrum is yellow fluid rich in immunoglobulins (especially secretory IgA) that provide critical passive immunity to newborns.',
      },
      {
        id: 4,
        subject: 'Arithmetic',
        question: 'A mother buys 2.5 kg of pulses at ₹84 per kg and 5 kg of rice at ₹42 per kg. What is the total bill amount?',
        options: ['₹410', '₹420', '₹430', '₹440'],
        correctOption: 1,
        explanation: 'Pulses = 2.5 * 84 = ₹210. Rice = 5 * 42 = ₹210. Total = 210 + 210 = ₹420.',
      },
      {
        id: 5,
        subject: 'General Awareness',
        question: 'Which mineral is fortified in common salt to prevent thyroid gland enlargement (Goitre)?',
        options: ['Iron', 'Iodine', 'Calcium', 'Zinc'],
        correctOption: 1,
        explanation: 'Iodine deficiency causes hypothyroidism and goitre. Universal iodisation of edible salt prevents this deficiency.',
      },
      {
        id: 6,
        subject: 'Women Empowerment & Schemes',
        question: 'What is the national toll-free Women Helpline number in India?',
        options: ['100', '108', '181', '1098'],
        correctOption: 2,
        explanation: '181 is the universal Women Helpline number in India. 1098 is the Childline emergency service.',
      },
    ],
  },
];
