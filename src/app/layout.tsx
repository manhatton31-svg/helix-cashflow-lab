export const metadata = { title: "Helix Cashflow Lab", description: "Free mock cashflow ideas" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0b1020" }}>{children}</body>
    </html>
  );
}
