import "./globals.css";

export const metadata = {
  title: "TruSathi – Find Your Life Partner",
  description: "Verified, community-driven matrimony platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
