import { LegalLayout } from '@/components/site/legal-layout';

export const metadata = { title: 'Refund Policy' };

export default function RefundPage() {
  return (
    <LegalLayout title="Refund Policy" description="Our policy for refunds on student purchases and SaaS subscriptions.">
      <p className="font-semibold text-primary">1. Student Purchases</p>
      <p>
        Refund eligibility for PDFs, courses, and test series is determined by the selling
        teacher or organization. SarkariExamHub facilitates the transaction but does not set
        individual refund terms for marketplace purchases.
      </p>
      <p className="font-semibold text-primary">2. SaaS Subscriptions</p>
      <p>
        SaaS subscription payments (for teachers and institutes) are eligible for a full refund
        within 7 days of payment, provided the subscription is canceled and no significant usage
        has occurred. After 7 days, refunds are pro-rated based on usage.
      </p>
      <p className="font-semibold text-primary">3. Refund Process</p>
      <p>
        To request a refund, contact support with your order reference number. Refunds are
        processed through the original payment method and may take 5-10 business days to appear.
      </p>
      <p className="font-semibold text-primary">4. Access Revocation</p>
      <p>
        When a refund is issued, access to the purchased content or SaaS features is revoked.
        Watermarked documents that were accessed may be logged for audit purposes.
      </p>
      <p className="font-semibold text-primary">5. Non-Refundable Items</p>
      <p>
        Completed mock test attempts and accessed downloadable content may not be eligible for
        refund, depending on the organization&apos;s policy. Free plan usage is not refundable as
        no payment is collected.
      </p>
      <p className="font-semibold text-primary">6. Payment Failures</p>
      <p>
        If a payment fails, no access is granted. Failed transactions do not incur charges. We
        use idempotent processing to prevent duplicate charges.
      </p>
      <p className="font-semibold text-primary">7. Disputes</p>
      <p>
        For payment disputes, please contact us before initiating a chargeback. We aim to
        resolve issues within 48 hours.
      </p>
    </LegalLayout>
  );
}