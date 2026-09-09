import React from 'react';
import { Link } from 'react-router-dom';
import LegalPage, { type LegalSection } from '@/components/legal/LegalPage';
import { CONTACT_EMAIL, CONTACT_MAILTO } from '@/components/landing/CTASection';

const sections: LegalSection[] = [
  {
    id: 'the-service',
    title: 'The service',
    body: (
      <>
        <p>
          QueueFlow is queue and appointment management software for front desks: clinics, government
          offices, banks, service centres and similar places. It lets customers book a time or join a queue,
          shows them where they stand, and gives staff the tools to call people up in order.
        </p>
        <p>
          QueueFlow is operated by Garrick International. These terms apply to everyone who uses it: the
          business that signs up (the &ldquo;operating business&rdquo;), its staff, and the customers who
          book or check in through it. By using QueueFlow you agree to them.
        </p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    body: (
      <>
        <p>Use QueueFlow for what it is for. In particular, do not:</p>
        <ul>
          <li>book appointments in someone else&rsquo;s name without their permission, or make bookings you do not intend to keep;</li>
          <li>enter false contact details to hide who you are;</li>
          <li>try to see, change or delete another person&rsquo;s appointment, or another business&rsquo;s data;</li>
          <li>probe, overload or interfere with the service, or bypass its access controls;</li>
          <li>upload anything unlawful, or anything you have no right to share;</li>
          <li>use the service to harass staff or other customers.</li>
        </ul>
        <p>We may remove content or suspend access that breaks these rules.</p>
      </>
    ),
  },
  {
    id: 'staff-accounts',
    title: 'Accounts for staff',
    body: (
      <>
        <p>
          Customers do not need an account. Staff and administrators sign in with an account created for
          them by their organisation. If you have one:
        </p>
        <ul>
          <li>keep your password to yourself and do not share your sign-in;</li>
          <li>you are responsible for what is done under your account;</li>
          <li>tell your administrator straight away if you think someone else has used it;</li>
          <li>your access is limited to your organisation&rsquo;s data and your role, and we may end it when your organisation asks or when you leave.</li>
        </ul>
        <p>Sign-ins are recorded in a security log that your organisation&rsquo;s administrators can see.</p>
      </>
    ),
  },
  {
    id: 'operating-business',
    title: 'The operating business and its customers',
    body: (
      <>
        <p>
          The business that runs a queue on QueueFlow is responsible to its own customers. That business,
          not Garrick International, decides which services to offer, what to ask customers for, how long to
          keep their records and what happens at the counter. It must:
        </p>
        <ul>
          <li>collect only what it needs from customers and tell them why it is collecting it;</li>
          <li>handle their details, notes and uploaded documents with care and according to the law that applies to it;</li>
          <li>respond to customers who ask to see, correct or delete their information;</li>
          <li>make sure its staff use the service properly.</li>
        </ul>
        <p>
          Our <Link to="/privacy">Privacy Policy</Link> explains what QueueFlow itself does with the data it
          holds on the business&rsquo;s behalf.
        </p>
      </>
    ),
  },
  {
    id: 'availability',
    title: 'Availability',
    body: (
      <>
        <p>
          We work to keep QueueFlow running, but we do not promise any particular level of uptime. The
          service may be unavailable for maintenance, because of a fault, or because a provider we depend on
          is down. Front desks should have a way to keep serving customers if the screen goes dark.
        </p>
        <p>We may add, change or retire features. If we retire something that a business relies on, we will give reasonable notice.</p>
      </>
    ),
  },
  {
    id: 'liability',
    title: 'Limitation of liability',
    body: (
      <>
        <p>
          In plain words: QueueFlow is a tool for managing a queue, and we provide it as it is. To the
          fullest extent the law allows, Garrick International is not liable for indirect losses &mdash; for
          example a missed appointment, lost business, lost time, or data a business chose to store &mdash;
          arising from the use of, or the inability to use, the service.
        </p>
        <p>
          Where we are liable, our total liability to an operating business is limited to the amount that
          business paid us for the service in the twelve months before the claim. Nothing in these terms
          limits liability that cannot be limited by law.
        </p>
      </>
    ),
  },
  {
    id: 'termination',
    title: 'Ending the service',
    body: (
      <>
        <p>
          An operating business can stop using QueueFlow at any time by telling us. We can suspend or end
          access if these terms are broken, if an account is being misused, or if we stop offering the
          service; we will give notice where we reasonably can.
        </p>
        <p>
          When a business leaves, its appointment records and uploaded documents are deleted on request.
          Customers who want their own record removed can ask the business or email us.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    body: (
      <p>
        We may update these terms. The date at the top of this page shows when they last changed, and we
        will tell operating businesses about changes that matter. Continuing to use QueueFlow after a
        change means you accept the new terms.
      </p>
    ),
  },
  {
    id: 'governing-law',
    title: 'Governing law',
    body: (
      <p>
        These terms are governed by the laws of{' '}
        <span className="qf-doc-placeholder">[State], United States</span>, and any dispute will be heard
        by the courts there.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    body: (
      <>
        <p>
          Questions about these terms go to Garrick International at{' '}
          <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>. Support hours are Monday to Friday, 8am to 6pm
          Eastern Time.
        </p>
        <p>
          See also our <Link to="/privacy">Privacy Policy</Link> and{' '}
          <Link to="/accessibility">Accessibility Statement</Link>.
        </p>
      </>
    ),
  },
];

const TermsPage: React.FC = () => (
  <LegalPage
    title="Terms of Service"
    eyebrow="QueueFlow policies"
    toc
    intro={
      <p>
        These are the rules for using QueueFlow, whether you are a customer joining a queue or a business
        running one. They are short on purpose. If anything here is unclear, ask us.
      </p>
    }
    sections={sections}
  />
);

export default TermsPage;
