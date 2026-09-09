import React from 'react';
import { Link } from 'react-router-dom';
import LegalPage, { type LegalSection } from '@/components/legal/LegalPage';
import { CONTACT_EMAIL } from '@/components/landing/CTASection';

const FEEDBACK_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('QueueFlow accessibility')}`;

const sections: LegalSection[] = [
  {
    id: 'commitment',
    title: 'Our commitment',
    body: (
      <>
        <p>
          A queue only works if everyone can join it. We want customers who use a screen reader, navigate by
          keyboard, magnify the screen or need more time to be able to book, check in and follow their place
          in line without asking for help.
        </p>
        <p>
          QueueFlow aims to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA. That is a
          target we build against, not a certification we hold.
        </p>
      </>
    ),
  },
  {
    id: 'current-status',
    title: 'Where we are today',
    body: (
      <>
        <p>On the customer-facing pages we have checked and confirmed:</p>
        <ul>
          <li>everything can be operated from the keyboard alone;</li>
          <li>buttons and links are at least 44 by 44 pixels, so they are easy to hit on a phone;</li>
          <li>a visible focus outline shows where you are;</li>
          <li>text on the landing page has a contrast ratio of at least 4.5:1 against its background;</li>
          <li>animation is switched off when your device asks for reduced motion;</li>
          <li>the page language follows the language switcher, so screen readers pronounce it correctly;</li>
          <li>customer pages are available in four languages: English, Spanish, Portuguese and Haitian Creole.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'known-gaps',
    title: 'Known gaps',
    body: (
      <>
        <p>We would rather be honest about what is not done yet:</p>
        <ul>
          <li>we have not yet had a formal accessibility audit by an outside specialist;</li>
          <li>the staff and administrator tools are in English only;</li>
          <li>we do not yet publish a VPAT (Voluntary Product Accessibility Template).</li>
        </ul>
        <p>We will update this page as each of these changes.</p>
      </>
    ),
  },
  {
    id: 'feedback',
    title: 'Tell us what is not working',
    body: (
      <>
        <p>
          If you hit something you cannot use, we want to know. Email{' '}
          <a href={FEEDBACK_MAILTO}>{CONTACT_EMAIL}</a> with &ldquo;accessibility&rdquo; in the subject and,
          if you can, tell us which page it was, what you were trying to do and which browser or assistive
          technology you use. We read every message during support hours, Monday to Friday, 8am to 6pm
          Eastern Time, and we will get back to you.
        </p>
        <p>
          You can also ask the business you are visiting to help you book or check in another way; they
          are not required to use the website to serve you.
        </p>
        <p>
          See also our <Link to="/privacy">Privacy Policy</Link> and <Link to="/terms">Terms of Service</Link>.
        </p>
      </>
    ),
  },
];

const AccessibilityPage: React.FC = () => (
  <LegalPage
    title="Accessibility Statement"
    eyebrow="QueueFlow policies"
    intro={
      <p>
        What we have done to make QueueFlow usable by everyone, what we have not done yet, and how to tell
        us when something gets in your way.
      </p>
    }
    sections={sections}
  />
);

export default AccessibilityPage;
