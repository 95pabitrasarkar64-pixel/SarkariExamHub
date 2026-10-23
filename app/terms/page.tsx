import { LegalLayout } from '@/components/site/legal-layout';

export const metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" description="The terms and conditions for using SarkariExamHub.">
      <p className="font-semibold text-primary">1. Acceptance of Terms</p>
      <p>
        By accessing or using SarkariExamHub (&quot;the Platform&quot;), you agree to be bound by
        these Terms of Service. If you do not agree to these terms, please do not use the Platform.
      </p>
      <p className="font-semibold text-primary">2. Platform Description</p>
      <p>
        SarkariExamHub is an independent educational platform that provides study materials,
        AI-assisted question banks, mock tests, and related tools for government exam preparation.
        The Platform is not affiliated with any government body.
      </p>
      <p className="font-semibold text-primary">3. User Accounts</p>
      <p>
        You must provide accurate information when creating an account. You are responsible for
        maintaining the security of your credentials and for all activities under your account.
      </p>
      <p className="font-semibold text-primary">4. User Roles</p>
      <p>
        The Platform supports four roles: Super Admin, Organization Owner, Teacher, and Student.
        Each role has specific permissions enforced server-side. Users must not attempt to
        access data or features outside their authorized role.
      </p>
      <p className="font-semibold text-primary">5. Content &amp; Intellectual Property</p>
      <p>
        Teachers and organizations retain ownership of content they upload. Students purchase
        access to content and must not redistribute, copy, or share materials beyond personal
        use. Watermarks and access controls are applied to protect content.
      </p>
      <p className="font-semibold text-primary">6. Payments</p>
      <p>
        Student purchases and teacher SaaS subscriptions are separate billing systems. Payments
        are processed through Razorpay. Access is granted only after payment verification.
      </p>
      <p className="font-semibold text-primary">7. Prohibited Conduct</p>
      <p>
        Users must not attempt to circumvent security controls, share access credentials, scrape
        content, reverse-engineer the Platform, or misuse AI extraction features to violate
        copyright.
      </p>
      <p className="font-semibold text-primary">8. Limitation of Liability</p>
      <p>
        SarkariExamHub is provided &quot;as is&quot; without warranties of any kind. We are not
        liable for indirect, incidental, or consequential damages arising from use of the Platform.
      </p>
      <p className="font-semibold text-primary">9. Termination</p>
      <p>
        We may suspend or terminate accounts that violate these Terms. Organizations may lose
        access to content if their subscription expires or is canceled.
      </p>
      <p className="font-semibold text-primary">10. Changes to Terms</p>
      <p>
        We may update these Terms from time to time. Continued use of the Platform after changes
        constitutes acceptance of the updated Terms.
      </p>
    </LegalLayout>
  );
}