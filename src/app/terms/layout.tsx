import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | CV Chap Chap',
  description: 'Read the terms and conditions for using CV Chap Chap. Our policies on CV creation, payment, and use of our platform in Tanzania and East Africa.',
  alternates: {
    canonical: 'https://www.cvchapchap.com/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
