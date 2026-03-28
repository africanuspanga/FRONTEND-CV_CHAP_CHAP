import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Program | Earn by Referring CV Chap Chap',
  description: 'Join CV Chap Chap\'s affiliate program. Earn TZS 1,000 per sale by referring job seekers to Tanzania\'s leading CV builder. Withdraw via M-Pesa.',
  alternates: {
    canonical: 'https://www.cvchapchap.com/affiliate',
  },
  openGraph: {
    title: 'Affiliate Program | CV Chap Chap',
    description: 'Earn TZS 1,000 per sale by referring job seekers to CV Chap Chap. Join Tanzania\'s CV builder affiliate program today.',
    url: 'https://www.cvchapchap.com/affiliate',
    type: 'website',
  },
};

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
