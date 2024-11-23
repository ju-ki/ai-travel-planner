import React from 'react';
import { Bell, Cloud, Compass, Edit, Link, PlaneLanding } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Home = () => {
  return (
    <main className="flex-1">
      {/* ヒーローセクション */}
      <section className="w-full py-12 md:py-24 bg-cover bg-center" style={{ backgroundImage: "url('/scene.webp')" }}>
        <div className="container px-4 md:px-6 text-center text-white">
          <h1 className="text-4xl font-bold md:text-6xl">AIで旅行をもっと便利に</h1>
          <p className="mt-4 max-w-xl mx-auto text-lg md:text-xl">
            AIが最適な旅行プランを提案します。あなたの理想の旅を、簡単に。
          </p>
          <div className="mt-6 space-x-4">
            <SignedIn>
              <Button>今すぐ試す</Button>
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button>今すぐ試す</Button>
              </SignInButton>
            </SignedOut>
            <Button variant="white">詳しく見る</Button>
          </div>
        </div>
      </section>

      {/* 機能紹介セクション */}
      <section className="w-full py-12 md:py-24 bg-gray-100">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">主要機能</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <PlaneLanding className="h-6 w-6 mb-2" />
                <CardTitle>AIによる旅行提案</CardTitle>
              </CardHeader>
              <CardContent>
                <p>出発地から観光地やホテルを自動で提案し、予算に最適化します。</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Edit className="h-6 w-6 mb-2" />
                <CardTitle>カスタマイズ機能</CardTitle>
              </CardHeader>
              <CardContent>
                <p>提案されたプランを自由にカスタマイズ可能です。</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Compass className="h-6 w-6 mb-2" />
                <CardTitle>テーマ別プラン提案</CardTitle>
              </CardHeader>
              <CardContent>
                <p>グルメ、リラックスなど旅行目的に応じたプランを提案します。</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Link className="h-6 w-6 mb-2" />
                <CardTitle>外部リンク機能</CardTitle>
              </CardHeader>
              <CardContent>
                <p>交通や宿泊予約のためのリンクを提供します。</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Bell className="h-6 w-6 mb-2" />
                <CardTitle>リマインダー</CardTitle>
              </CardHeader>
              <CardContent>
                <p>予約期限や日程を通知します。</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Cloud className="h-6 w-6 mb-2" />
                <CardTitle>天候に応じた代替案</CardTitle>
              </CardHeader>
              <CardContent>
                <p>天気に基づいて旅行プランを変更します。</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* シェアセクション */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">旅行プランの共有</h2>
          <p className="mb-12 max-w-2xl mx-auto">
            作成した旅行プランをSNSでシェアしたり、他のユーザーのプランを参考にしましょう。
          </p>
        </div>
      </section>
    </main>
  );
};

export default Home;
