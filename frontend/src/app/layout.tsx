import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';

import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/common/header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <title>AI旅行計画プランナー</title>
      <body>
        <ClerkProvider>
          <Header />
          <main>{children}</main>
        </ClerkProvider>
        <Toaster />
      </body>
    </html>
  );
}
