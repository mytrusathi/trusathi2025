import './globals.css'; // Make sure to import your Tailwind directives here

export const metadata = {
  title: 'Trusathi - Trusted Matrimony',
  description: 'Community-led matrimonial platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}