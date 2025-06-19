'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { defaultLanguage } from '@/lib/i18n/config';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to default language
    router.replace(`/${defaultLanguage}`);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}