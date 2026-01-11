import type { Metadata } from 'next';
import './globals.css';
import { TRPCProvider } from '@/lib/trpc/provider';

export const metadata: Metadata = {
  title: 'Boligbolig - AI-drevet Ejendomsplatform',
  description: 'Anonyme skuffesager med intelligent matching',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da">
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
