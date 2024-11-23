import { ClerkProvider } from '@clerk/nextjs';

import './globals.css';
import Header from '@/components/common/header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <ClerkProvider>
          <Header />
          <main>{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}
