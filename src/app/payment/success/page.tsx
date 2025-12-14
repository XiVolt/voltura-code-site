'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const invoiceId = searchParams.get('invoice');

  useEffect(() => {
    // Simuler une vérification du paiement
    const timer = setTimeout(() => {
      // Si on a un invoice ID, considérer comme succès
      if (invoiceId) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [invoiceId]);

  if (status === 'loading') {
    return (
      <ClientLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-electric-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Vérification du paiement...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          {status === 'success' ? (
            <Card>
              <div className="text-center py-8">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-anthracite mb-4">
                  Paiement Confirmé !
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Votre paiement a été traité avec succès. Merci pour votre confiance !
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                  <h2 className="font-semibold text-green-800 mb-2">Prochaines étapes</h2>
                  <ul className="text-left text-green-700 space-y-2">
                    <li>✅ Un reçu a été envoyé à votre adresse email</li>
                    <li>✅ Votre facture a été mise à jour</li>
                    <li>✅ Vous pouvez consulter vos factures dans votre espace client</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => router.push('/dashboard/clients/invoices')}
                    className="flex items-center justify-center"
                  >
                    Voir mes factures
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                  >
                    Retour au dashboard
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-8">
                <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-anthracite mb-4">
                  Erreur de Paiement
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Une erreur s'est produite lors du traitement de votre paiement.
                </p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                  <h2 className="font-semibold text-red-800 mb-2">Que faire ?</h2>
                  <ul className="text-left text-red-700 space-y-2">
                    <li>• Vérifiez que votre paiement n'a pas été débité</li>
                    <li>• Contactez-nous si vous avez des questions</li>
                    <li>• Réessayez le paiement</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => router.push('/dashboard/clients/invoices')}
                    className="flex items-center justify-center"
                  >
                    Retour aux factures
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/contact')}
                  >
                    Nous contacter
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <ClientLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-electric-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </ClientLayout>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

