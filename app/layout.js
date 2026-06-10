import './globals.css';

export const metadata = {
  title: 'PEO Deal-Prep Agent',
  description: 'AI-generated, rep-ready PEO deal briefs in seconds.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
