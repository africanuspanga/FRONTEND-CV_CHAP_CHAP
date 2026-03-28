import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | CV Chap Chap',
  description: 'Read the CV Chap Chap privacy policy. Learn how we collect, use, and protect your personal data on our CV builder platform.',
  alternates: {
    canonical: 'https://www.cvchapchap.com/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
