'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  FileText,
  Download,
  Eye,
  Shield,
  Lock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PageHeader, PageContainer } from '@/components/site/page-components';
import { examCategoryInfo, examCategorySlugs } from '@/lib/navigation';
import { toast } from 'sonner';

type MaterialItem = {
  id: number;
  title: string;
  type: string;
  category: string;
  language: string;
  pages: number;
  price: string;
  isFree?: boolean;
  sampleContent: string[];
};

const sampleMaterials: MaterialItem[] = [
  {
    id: 1,
    title: 'SSC CGL Quantitative Aptitude — Complete Formula & Shortcut Guide',
    type: 'PDF',
    category: 'ssc',
    language: 'English',
    pages: 120,
    price: 'Free Sample',
    isFree: true,
    sampleContent: [
      'Chapter 1: Number Systems & Divisibility Rules\n• Remainder Theorem: If P(x) is divided by (x - a), the remainder is P(a).\n• Unit digit patterns of powers: 2, 3, 7, 8 follow a cyclicity of 4.',
      'Chapter 2: Percentages & Successive Discounts\n• Equivalent discount for successive discounts a% and b% = [a + b - (ab/100)]%.\n• Net effect when price increases by x% and sales decrease by y%.',
      'Chapter 3: Profit, Loss & Dishonest Dealer Shortcuts\n• When a dealer uses false weight of W2 instead of true weight W1:\n  Gain % = [(True Weight - False Weight) / False Weight] × 100%.',
    ],
  },
  {
    id: 2,
    title: 'Reasoning Ability Practice Set — Banking Exams (Puzzles & Seating)',
    type: 'PDF',
    category: 'banking',
    language: 'English',
    pages: 80,
    price: '₹149',
    sampleContent: [
      'Set 1: Circular Seating Arrangement (Inward & Outward)\nEight persons A, B, C, D, E, F, G, and H sit around a circular table. Three face outside while five face the centre...',
      'Set 2: Floor & Flat Based Puzzle\nTen persons live on five different floors of a building having two flats (Flat A and Flat B). Flat A is to the west of Flat B...',
    ],
  },
  {
    id: 3,
    title: 'WBCS General Studies — Bengal Renaissance & Freedom Movement Notes',
    type: 'Notes',
    category: 'state-psc',
    language: 'English',
    pages: 200,
    price: '₹199',
    sampleContent: [
      'Topic: Raja Ram Mohan Roy & Brahmo Samaj (1828)\n• Social reforms: Abolition of Sati Regulation XVII of 1829 under Lord William Bentinck.\n• Journals: Sambad Kaumudi (Bengali, 1821) and Mirat-ul-Akbar (Persian, 1822).',
      'Topic: The Indigo Revolt of Bengal (Nil Bidroho, 1859-60)\n• Leaders: Bishnucharan Biswas and Digambar Biswas of Nadia district.\n• Literary representation: Dinabandhu Mitra’s play "Nil Darpan" (1860).',
    ],
  },
  {
    id: 4,
    title: 'Railway Reasoning — Previous 10 Years Solved Questions',
    type: 'PDF',
    category: 'railway',
    language: 'Hindi',
    pages: 95,
    price: 'Free Sample',
    isFree: true,
    sampleContent: [
      'अध्याय 1: सादृश्यता परीक्षण (Analogy Tests)\n• संबंध पहचान: जिस प्रकार "थर्मामीटर" का संबंध "तापमान" से है, उसी प्रकार "बैरोमीटर" का संबंध "वायुदाब" से है।',
      'अध्याय 2: रक्त संबंध (Blood Relations)\n• सांकेतिक संबंध विश्लेषण और वंश वृक्ष (Family Tree) निर्माण की त्वरित विधियाँ।',
    ],
  },
  {
    id: 5,
    title: 'ICDS Supervisor Exam — Nutrition & Child Psychology Bundle',
    type: 'Bundle',
    category: 'icds-anganwadi',
    language: 'Bengali',
    pages: 150,
    price: '₹179',
    sampleContent: [
      'অধ্যায় ১: পুষ্টি ও জনস্বাস্থ্য বিজ্ঞান (Nutrition Science)\n• ম্যাক্রো ও মাইক্রো নিউট্রিয়েন্টস: প্রোটিন-ক্যালোরি অপুষ্টি (PEM) - কোয়াশিওরকর ও ম্যারাসমাসের তুলনামূলক পার্থক্য।',
      'অধ্যায় ২: আইসিডিএস প্রকল্প ও প্রসূতি স্বাস্থ্য\n• সম্পূরক পুষ্টিকর খাদ্য (Supplementary Nutrition Programme) এবং টিকাকরণ সময়সূচী (Universal Immunization Programme)।',
    ],
  },
  {
    id: 6,
    title: 'Panchayat Secretary — Gram Panchayat Act & Rural Administration',
    type: 'PDF',
    category: 'panchayat',
    language: 'Hindi',
    pages: 60,
    price: 'Free Sample',
    isFree: true,
    sampleContent: [
      'भाग 1: 73वाँ संविधान संशोधन अधिनियम 1992\n• त्रिस्तरीय पंचायती राज व्यवस्था: ग्राम पंचायत, पंचायत समिति और जिला परिषद।\n• 11वीं अनुसूची के 29 कार्यकारी विषय।',
    ],
  },
  {
    id: 7,
    title: 'Police Constable — Numerical Ability & General Mental Ability',
    type: 'PDF',
    category: 'police-constable',
    language: 'English',
    pages: 110,
    price: '₹129',
    sampleContent: [
      'Section 1: Speed, Distance & Time Shortcuts\n• Relative speed of two trains moving in opposite directions = S1 + S2.\n• Crossing a platform = (Length of Train + Length of Platform) / Speed.',
    ],
  },
  {
    id: 8,
    title: 'Clerkship Exam — General English Idioms, Phrases & Error Spotting',
    type: 'PDF',
    category: 'clerkship',
    language: 'English',
    pages: 75,
    price: 'Free Sample',
    isFree: true,
    sampleContent: [
      'Module 1: Most Frequently Asked Idioms in WBPSC\n• "Burn the midnight oil" - to study or work hard late into the night.\n• "At the eleventh hour" - at the last possible moment.',
    ],
  },
  {
    id: 9,
    title: 'Group D — General Science Practice Bank (Physics, Chem, Bio)',
    type: 'Notes',
    category: 'group-c-d',
    language: 'Hindi',
    pages: 90,
    price: '₹99',
    sampleContent: [
      'सामान्य विज्ञान: भौतिक विज्ञान महत्त्वपूर्ण सूत्र\n• गति के समीकरण: v = u + at, s = ut + 1/2 at², v² = u² + 2as.\n• कार्य = बल × विस्थापन (W = F × s × cosθ).',
    ],
  },
];

export default function StudyMaterialsPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [language, setLanguage] = useState('all');
  const [category, setCategory] = useState('all');

  const [previewItem, setPreviewItem] = useState<MaterialItem | null>(null);
  const [samplePageIndex, setSamplePageIndex] = useState(0);

  const filtered = useMemo(() => {
    return sampleMaterials.filter((m) => {
      const matchesSearch = !search || m.title.toLowerCase().includes(search.toLowerCase());
      const matchesType = type === 'all' || m.type === type;
      const matchesLang = language === 'all' || m.language === language;
      const matchesCat = category === 'all' || m.category === category;
      return matchesSearch && matchesType && matchesLang && matchesCat;
    });
  }, [search, type, language, category]);

  const [watermarkText, setWatermarkText] = useState<string>(
    'SARKARIEXAMHUB • PROTECTED CONTENT • ASPIRANT PREVIEW • NOT FOR REDISTRIBUTION'
  );
  const [checkoutItem, setCheckoutItem] = useState<MaterialItem | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  const handleOpenPreview = async (item: MaterialItem) => {
    setPreviewItem(item);
    setSamplePageIndex(0);

    try {
      const res = await fetch('/api/materials/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialId: item.id }),
      });
      const data = await res.json();
      if (data.watermarkText) {
        setWatermarkText(data.watermarkText);
      }
    } catch {
      // fallback to standard watermark
    }
  };

  const handleGetAccess = async (item: MaterialItem) => {
    if (item.isFree) {
      toast.success(`Access granted! "${item.title}" added to your study library.`);
      return;
    }
    setCheckoutItem(item);
  };

  const handleCompletePayment = async () => {
    if (!checkoutItem) return;
    setIsPaying(true);

    try {
      const rawPrice = parseInt(checkoutItem.price.replace(/[^\d]/g, ''), 10) || 99;

      // 1. Create Order on Server
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: String(checkoutItem.id),
          itemType: 'study_material',
          title: checkoutItem.title,
          amountInr: rawPrice,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to initiate order.');
      }

      // 2. Complete payment & verify on server
      const mockPaymentId = `pay_test_${Date.now()}`;
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: mockPaymentId,
          razorpay_signature: 'test_signature_valid',
          itemId: String(checkoutItem.id),
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        toast.success(`Payment verified! Access unlocked for "${checkoutItem.title}".`);
        setCheckoutItem(null);
      } else {
        toast.error(verifyData.error || 'Payment signature verification failed.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Payment processing error.');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Study Materials & PDF Library"
        description="Curated government examination study guides, previous year question banks, formula sheets, and chapter notes."
      >
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Exam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exams</SelectItem>
              {examCategorySlugs.map((s) => (
                <SelectItem key={s} value={s}>
                  {examCategoryInfo[s]?.name || s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="PDF">PDF</SelectItem>
              <SelectItem value="Notes">Notes</SelectItem>
              <SelectItem value="Bundle">Bundle</SelectItem>
            </SelectContent>
          </Select>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
              <SelectItem value="Bengali">Bengali</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      <PageContainer>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <Card key={m.id} className="group flex flex-col justify-between transition-all hover:border-primary/40 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs">{m.type}</Badge>
                    <Badge variant="outline" className="text-xs">{m.language}</Badge>
                    {m.isFree && (
                      <Badge className="bg-success text-white text-[10px]">Free</Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="mt-2 text-base leading-snug">{m.title}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-1">
                  {examCategoryInfo[m.category]?.name} &middot; {m.pages} pages &middot; <strong className="text-primary">{m.price}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleOpenPreview(m)}
                  >
                    <Eye className="mr-1.5 h-3.5 w-3.5" /> Preview
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={() => handleGetAccess(m)}
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5" /> {m.isFree ? 'Get Access' : `Buy ${m.price}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground rounded-xl border border-dashed border-border p-8">
            No study materials found matching your criteria. Try adjusting your filters.
          </div>
        )}

        {/* In-Browser Protected PDF Viewer Modal */}
        <Dialog open={Boolean(previewItem)} onOpenChange={(open) => !open && setPreviewItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-center justify-between gap-2 pr-6">
                <DialogTitle className="text-base font-bold text-primary truncate">
                  {previewItem?.title}
                </DialogTitle>
                <Badge variant="outline" className="text-xs shrink-0">
                  {previewItem?.language}
                </Badge>
              </div>
              <DialogDescription className="text-xs">
                Protected Document Preview &middot; Total {previewItem?.pages} pages &middot; SarkariExamHub Viewer
              </DialogDescription>
            </DialogHeader>

            {/* Document display viewport with dynamic anti-piracy watermark */}
            <div className="relative rounded-xl border border-border bg-card p-6 shadow-inner overflow-hidden min-h-[260px] flex flex-col justify-between">
              {/* Security Watermark Overlay */}
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center select-none opacity-10 rotate-[-25deg] text-xs sm:text-sm font-mono font-bold text-primary leading-loose text-center p-4"
                aria-hidden="true"
              >
                {watermarkText}
              </div>

              {/* Sample Content */}
              <div className="relative z-10 space-y-3 font-sans text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                <div className="flex items-center justify-between border-b border-border pb-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-primary">Sample Sheet {samplePageIndex + 1}</span>
                  <span className="flex items-center gap-1 text-[11px] text-accent">
                    <Shield className="h-3 w-3" /> Watermarked Preview
                  </span>
                </div>
                <p>
                  {previewItem?.sampleContent[samplePageIndex] ||
                    'Detailed notes and practice solutions are available in the full document.'}
                </p>
              </div>

              {/* Bottom Pagination within preview */}
              <div className="relative z-10 border-t border-border pt-3 mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={samplePageIndex === 0}
                  onClick={() => setSamplePageIndex((p) => Math.max(0, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous Sample
                </Button>
                <span>
                  Sample {samplePageIndex + 1} of {previewItem?.sampleContent.length || 1}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={samplePageIndex >= (previewItem?.sampleContent.length || 1) - 1}
                  onClick={() =>
                    setSamplePageIndex((p) =>
                      Math.min((previewItem?.sampleContent.length || 1) - 1, p + 1)
                    )
                  }
                >
                  Next Sample <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* Modal Footer with Access CTA */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5 text-success" />
                <span>Encrypted delivery</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPreviewItem(null)}>
                  Close
                </Button>
                {previewItem && (
                  <Button
                    size="sm"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={() => {
                      handleGetAccess(previewItem);
                      setPreviewItem(null);
                    }}
                  >
                    {previewItem.isFree ? 'Add to My Library' : `Unlock Full PDF (${previewItem.price})`}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Razorpay Checkout & Signature Verification Dialog */}
        <Dialog open={Boolean(checkoutItem)} onOpenChange={(open) => !open && setCheckoutItem(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-primary">
                Confirm Enrollment & Access
              </DialogTitle>
              <DialogDescription className="text-xs">
                Complete secure payment to instantly unlock this study material.
              </DialogDescription>
            </DialogHeader>

            {checkoutItem && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Material:</span>
                    <span className="font-semibold text-primary text-right max-w-[200px] truncate">
                      {checkoutItem.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-semibold text-primary">{checkoutItem.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Language:</span>
                    <span className="font-semibold text-primary">{checkoutItem.language}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 text-base">
                    <span className="font-bold text-primary">Total Payable:</span>
                    <span className="font-bold text-accent">{checkoutItem.price}</span>
                  </div>
                </div>

                <div className="rounded-lg border border-info/30 bg-info/5 p-3 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5 font-semibold text-info mb-1">
                    <Shield className="h-3.5 w-3.5" /> Razorpay Secured Checkout
                  </p>
                  Server-side signature verification with 256-bit encryption. Safe test sandbox active until live credentials are set.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCheckoutItem(null)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={isPaying}
                    onClick={handleCompletePayment}
                  >
                    {isPaying ? 'Verifying Signature...' : `Pay ${checkoutItem.price}`}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </PageContainer>
    </div>
  );
}