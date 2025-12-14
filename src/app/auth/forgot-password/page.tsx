'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ClientLayout from '@/components/ClientLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        throw error;
      }

      setSent(true);
    } catch (error: any) {
      console.error('Erreur:', error);
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <ClientLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full">
            <Card>
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-anthracite mb-4">
                  Email Envoyé !
                </h1>
                <p className="text-gray-600 mb-6">
                  Un email de réinitialisation a été envoyé à :
                </p>
                <p className="text-electric-blue font-semibold mb-8">
                  {email}
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Vérifiez votre boîte de réception</strong>
                    <br />
                    Cliquez sur le lien dans l&apos;email pour réinitialiser votre mot de passe.
                  </p>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Vous n&apos;avez pas reçu l&apos;email ? Vérifiez vos spams ou{' '}
                  <button
                    onClick={() => setSent(false)}
                    className="text-electric-blue hover:underline"
                  >
                    réessayez
                  </button>
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/auth/login')}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à la connexion
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-anthracite mb-2">
              Mot de Passe Oublié ?
            </h1>
            <p className="text-gray-600">
              Pas de problème ! Entrez votre email et nous vous enverrons un lien pour le réinitialiser.
            </p>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  label="Adresse Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                Envoyer le Lien de Réinitialisation
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-sm text-gray-600 hover:text-electric-blue flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la connexion
              </Link>
            </div>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Vous n&apos;avez pas de compte ?{' '}
              <Link href="/auth/register" className="text-electric-blue hover:underline font-medium">
                Inscrivez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

