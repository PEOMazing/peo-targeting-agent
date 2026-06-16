import "./globals.css";

export const metadata = {
  title: "Gabriel Revnew × Gusto",
  description: "Head of PEO Sales — candidate package, prepared for the Gusto team.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
