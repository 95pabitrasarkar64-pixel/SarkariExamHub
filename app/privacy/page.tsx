import { LegalLayout } from '@/components/site/legal-layout';

export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" description="How SarkariExamHub collects, uses, and protects your data.">
      <p className="font-semibold text-primary">1. Information We Collect</p>
      <p>
        We collect your name, email, phone number (optional), and account activity data. When you
        make purchases, we store order and payment transaction records (no raw card details).
      </p>
      <p className="font-semibold text-primary">2. How We Use Your Information</p>
      <p>
        We use your information to provide and improve the Platform, process transactions,
        communicate with you, enforce security, and comply with legal obligations.
      </p>
      <p className="font-semibold text-primary">3. Data Storage &amp; Security</p>
      <p>
        Data is stored in PostgreSQL with Row Level Security. Authentication is handled by Supabase
        Auth. Privileged operations are enforced server-side. Content access is verified at the
        database level before delivery.
      </p>
      <p className="font-semibold text-primary">4. Multi-Tenant Data Isolation</p>
      <p>
        Organization data is isolated using database-level policies. One organization cannot
        access another organization&apos;s students, content, transactions, or exam results.
      </p>
      <p className="font-semibold text-primary">5. AI Processing</p>
      <p>
        When you use the AI Question Importer, PDF content is sent to a configured AI provider for
        question extraction. We do not store the AI provider&apos;s responses beyond the extracted
        question data in your organization&apos;s question bank.
      </p>
      <p className="font-semibold text-primary">6. Cookies &amp; Sessions</p>
      <p>
        We use authentication session tokens to keep you logged in. We do not use third-party
        tracking cookies.
      </p>
      <p className="font-semibold text-primary">7. Data Retention</p>
      <p>
        Your data is retained while your account is active. Exam attempts, responses, and results
        are retained per organization settings. Account deletion requests are handled within
        applicable legal requirements.
      </p>
      <p className="font-semibold text-primary">8. Your Rights</p>
      <p>
        You may update your profile information at any time. Contact us to request access to,
        correction of, or deletion of your personal data.
      </p>
      <p className="font-semibold text-primary">9. Third-Party Services</p>
      <p>
        We use Supabase (database and authentication), Razorpay (payments), and a configurable
        AI provider (question extraction). Each has its own privacy practices.
      </p>
      <p className="font-semibold text-primary">10. Children&apos;s Privacy</p>
      <p>
        The Platform is intended for users preparing for government recruitment examinations. We
        do not knowingly collect data from children under 13.
      </p>
    </LegalLayout>
  );
}