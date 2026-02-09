import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cover Letter Builder - CV Chap Chap',
  description: 'Create a professional cover letter in minutes. Free download after signup.',
};

export default function LetterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Load cursive Google Fonts for signature */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Pacifico&family=Sacramento&family=Caveat:wght@400;700&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
