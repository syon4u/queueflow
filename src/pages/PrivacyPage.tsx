import React from 'react';
import { Link } from 'react-router-dom';
import LegalPage, { type LegalSection } from '@/components/legal/LegalPage';
import { CONTACT_EMAIL, CONTACT_MAILTO } from '@/components/landing/CTASection';

const sections: LegalSection[] = [
  {
    id: 'what-we-collect',
    title: 'What we collect',
    body: (
      <>
        <p>
          QueueFlow is used by two kinds of people: customers who book, check in and wait, and the staff of
          the business running the front desk. We collect different things from each.
        </p>
        <h3>If you are a customer</h3>
        <p>When you book or check in, the business you are visiting asks you for:</p>
        <ul>
          <li>your first and last name and a phone number;</li>
          <li>an email address, if you choose to give one;</li>
          <li>the service, location and time you pick;</li>
          <li>the reason for your visit and any notes you type in;</li>
          <li>the time you checked in and where you are in the queue.</li>
        </ul>
        <p>
          Staff at that business may also upload supporting documents for your appointment, such as a scan
          of an ID or an intake form. Those files go into a private storage area tied to your appointment
          and are only visible to staff of that business.
        </p>
        <h3>If you are staff or an administrator</h3>
        <p>
          Your account holds your email address, your name and your role. Sign-in events are written to a
          security audit log with a timestamp and a client identifier, so the business can see who signed in
          and when.
        </p>
        <h3>What we do not collect</h3>
        <ul>
          <li>No payment or card details. QueueFlow does not take payments.</li>
          <li>No advertising trackers and no analytics services.</li>
          <li>Anonymous visitors are not given cookies at all.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'why-we-collect-it',
    title: 'Why we collect it',
    body: (
      <>
        <p>
          We use your details for one purpose: to run the queue. Your name and phone number let staff call
          you when it is your turn and reach you if plans change. The service, location and time you pick
          decide where you wait and for how long. Notes and documents help staff prepare for your visit.
        </p>
        <p>
          When you give us your details to book or check in, we treat that as your consent to use them for
          your visit. The business you are visiting also has a legitimate interest in keeping an orderly,
          fair queue, and that is what account and audit-log data are for. We do not use your information
          for marketing and we do not sell it.
        </p>
      </>
    ),
  },
  {
    id: 'who-processes-it',
    title: 'Who processes it',
    body: (
      <>
        <p>
          QueueFlow is operated by Garrick International. The business you are visiting is the one that
          collects your details and decides how long to keep them; we run the software on their behalf.
        </p>
        <p>Only two outside services ever touch your data:</p>
        <ul>
          <li>
            <strong>Supabase</strong> hosts our database, sign-in and file storage. Its servers are in the
            United States.
          </li>
          <li>
            <strong>Google Fonts</strong> serves the typefaces this site uses. When your browser fetches a
            font file, Google&rsquo;s servers see your IP address, as they would for any web request.
          </li>
        </ul>
        <p>Nobody else receives your data, and there are no advertising or analytics partners.</p>
      </>
    ),
  },
  {
    id: 'how-long-we-keep-it',
    title: 'How long we keep it',
    body: (
      <>
        <p>
          Appointment records, including notes and any uploaded documents, are kept until the business that
          operates the queue deletes them. There is no automatic deletion today. Staff accounts and the
          sign-in audit log are kept for as long as the business uses QueueFlow.
        </p>
        <p>
          If you would like your record removed sooner, ask the business directly or email us at{' '}
          <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a> and we will pass the request on and follow up.
        </p>
      </>
    ),
  },
  {
    id: 'your-choices',
    title: 'Your choices and requests',
    body: (
      <>
        <p>You can:</p>
        <ul>
          <li>book without giving an email address &mdash; only a name and phone number are needed;</li>
          <li>ask to see the details we hold about your appointment;</li>
          <li>ask us to correct or delete them;</li>
          <li>ask which business collected them, if you are not sure.</li>
        </ul>
        <p>
          Send any request to <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>. We answer during support hours,
          Monday to Friday, 8am to 6pm Eastern Time. We may need to confirm you are the person the record
          belongs to before we act on it.
        </p>
      </>
    ),
  },
  {
    id: 'browser-storage',
    title: 'Cookies and browser storage',
    body: (
      <>
        <p>
          Customers browsing or booking get no cookies. Signed-in staff get only the cookies and local
          storage that Supabase needs to keep them signed in.
        </p>
        <p>
          The site can be installed as an app on your phone or desktop. Whether installed or not, it
          remembers two settings in your browser: your language and your light or dark theme. Both stay on
          your device and are never sent to us.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    title: 'How we protect it',
    body: (
      <>
        <ul>
          <li>Every connection to QueueFlow is encrypted in transit with TLS.</li>
          <li>Stored data is encrypted at rest by our hosting provider.</li>
          <li>
            Row-level security rules in the database restrict every staff member to their own
            organisation&rsquo;s records, so one business can never read another&rsquo;s.
          </li>
          <li>Uploaded documents live in a private bucket that is not reachable by URL without authorisation.</li>
          <li>Staff sign-ins are logged so unusual access can be spotted.</li>
        </ul>
        <p>
          No system is perfectly secure. If you believe your data has been exposed, tell us at{' '}
          <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a> and we will investigate.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    title: 'Children',
    body: (
      <p>
        QueueFlow is not directed at children under 13 and we do not knowingly collect their details. A
        parent or guardian can book on a child&rsquo;s behalf using their own name and contact details. If
        you think a child has given us information directly, contact us and we will remove it.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <p>
        When we change this policy we update the date at the top of this page. If a change affects how we
        use data you have already given us, the businesses using QueueFlow will be told so they can inform
        their customers.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    body: (
      <>
        <p>
          Garrick International operates QueueFlow. For anything about this policy or your data, email{' '}
          <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>. Support hours are Monday to Friday, 8am to 6pm
          Eastern Time.
        </p>
        <p>
          See also our <Link to="/terms">Terms of Service</Link> and{' '}
          <Link to="/accessibility">Accessibility Statement</Link>.
        </p>
      </>
    ),
  },
];

const PrivacyPage: React.FC = () => (
  <LegalPage
    title="Privacy Policy"
    eyebrow="QueueFlow policies"
    toc
    intro={
      <p>
        This page explains what QueueFlow collects when you book, check in or sign in, why we need it, who
        handles it and what you can ask us to do with it. It is written for the person waiting in the queue
        as much as for the business running it.
      </p>
    }
    sections={sections}
  />
);

export default PrivacyPage;
