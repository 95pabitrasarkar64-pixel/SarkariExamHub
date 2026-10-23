import { LegalLayout } from '@/components/site/legal-layout';

export const metadata = { title: 'Copyright & Content Policy' };

export default function CopyrightPage() {
  return (
    <LegalLayout title="Copyright & Content Policy" description="Our policy on intellectual property, content ownership, and takedown procedures.">
      <p className="font-semibold text-primary">1. Content Ownership</p>
      <p>
        Teachers and organizations retain full ownership of content they upload to
        SarkariExamHub, including PDFs, question banks, courses, and mock tests. The Platform
        does not claim ownership of user-uploaded content.
      </p>
      <p className="font-semibold text-primary">2. License to Use</p>
      <p>
        By uploading content, you grant SarkariExamHub a limited license to host, display, and
        deliver your content to authorized students through the Platform&apos;s protected viewer.
      </p>
      <p className="font-semibold text-primary">3. Content Protection</p>
      <p>
        The Platform applies server-side authentication, short-lived access URLs, personalized
        watermarks, and restricted in-browser viewing to protect content. However, no web-based
        system can fully prevent screenshots, screen recording, or external photography.
      </p>
      <p className="font-semibold text-primary">4. Copyright Infringement</p>
      <p>
        If you believe content on SarkariExamHub infringes your copyright, contact us with:
        (a) identification of the copyrighted work, (b) the specific URL or content reference,
        (c) your contact information, and (d) a good-faith statement that the use is unauthorized.
      </p>
      <p className="font-semibold text-primary">5. AI-Extracted Content</p>
      <p>
        Content extracted by the AI Question Importer is derived from the source PDF uploaded by
        the teacher. The teacher is responsible for ensuring they have the right to use and
        distribute the source material.
      </p>
      <p className="font-semibold text-primary">6. Acceptable Use</p>
      <p>
        Users must not upload copyrighted material they do not have rights to, plagiarize content,
        or use the AI extraction feature to reproduce copyrighted question banks without
        authorization.
      </p>
      <p className="font-semibold text-primary">7. Takedown Process</p>
      <p>
        Upon receiving a valid copyright notice, we will remove the identified content and
        notify the uploading organization. Repeat infringers may have their accounts terminated.
      </p>
      <p className="font-semibold text-primary">8. Counter-Notice</p>
      <p>
        If your content was removed and you believe it was in error, you may submit a
        counter-notice with evidence of your rights to the content.
      </p>
    </LegalLayout>
  );
}