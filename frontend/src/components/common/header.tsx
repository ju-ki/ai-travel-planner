'use client';
import { SignInButton, SignOutButton, SignedIn, SignedOut, useAuth, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { MenuIcon } from 'lucide-react';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import Notification from '../Notification';
import useSWR from 'swr';

const Header = () => {
  const { getToken } = useAuth();

  const fetcher = async (url: string) => {
    const token = await getToken();

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    });
    return response.json();
  };

  useSWR('http://localhost:8787/api/auth', fetcher);
  return (
    <header className="flex h-16 w-full items-center justify-between px-4 md:px-6 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center space-x-3">
        <Link href="/" className="mr-6 flex items-center" prefetch={false}>
          <TravelExploreIcon className="text-3xl" />
          <span className="lg:text-2xl md font-semibold text-gray-800">AI旅行計画プランナー</span>{' '}
        </Link>
      </div>

      <div className="hidden lg:flex items-center space-x-6">
        <SignedIn>
          <Link href="/plan/create" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            プラン作成
          </Link>
          <Link href="/plan/list" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            プラン一覧
          </Link>
          <Notification />
          <SignOutButton>
            <Button>ログアウト</Button>
          </SignOutButton>
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <Button>ログイン</Button>
          </SignInButton>
        </SignedOut>
      </div>

      <div className="ml-auto flex items-center space-x-4 lg:hidden">
        <SignedIn>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <SheetTitle className="sr-only">ハンバーガーメニュー</SheetTitle>
                <SheetDescription className="sr-only">ハンバーガーメニュー</SheetDescription>
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-6 p-6">
                <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                  トップへ
                </Link>
                <Link
                  href="/plan/create"
                  className="text-sm font-medium hover:underline underline-offset-4"
                  prefetch={false}
                >
                  プラン作成
                </Link>
                <Link
                  href="/plan/list"
                  className="text-sm font-medium hover:underline underline-offset-4"
                  prefetch={false}
                >
                  プラン一覧
                </Link>
                <SignedIn>
                  <SignOutButton>
                    <div className="text-sm font-medium hover:underline underline-offset-4">ログアウト</div>
                  </SignOutButton>
                </SignedIn>
              </div>
            </SheetContent>
          </Sheet>
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <Button>ログイン</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
};

export default Header;
