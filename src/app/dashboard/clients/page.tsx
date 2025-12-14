'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function OldPaymentRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const invoice = searchParams.get('invoice');
    const payment = searchParams.get('payment');

    if (payment === 'success' && invoice) {
      // Rediriger vers la nouvelle page de confirmation
      router.replace(`/payment/success?invoice=${invoice}`);
    } else {
      // Rediriger vers le dashboard
      router.replace('/dashboard');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-electric-blue mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection...</p>
      </div>
    </div>
  );
}

export default function OldPaymentRedirect() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-electric-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <OldPaymentRedirectContent />
    </Suspense>
  );
}

