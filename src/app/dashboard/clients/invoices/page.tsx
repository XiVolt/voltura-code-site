'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ClientLayout from '@/components/ClientLayout';
import { createClient } from '@/lib/supabase';

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  payment_status: string;
  stripe_payment_link: string | null;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
  notes: string | null;
  project: {
    id: string;
    title: string;
    description: string | null;
  };
}

export default function ClientInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    try {
      setLoading(true);
      const supabase = createClient();

      // Vérifier l'authentification
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Non authentifié');
        return;
      }

      // Charger les factures du client connecté
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (invoicesError) {
        console.error('Erreur chargement factures:', invoicesError);
      } else if (invoicesData) {
        // Enrichir les factures avec les infos des projets
        const enrichedInvoices = await Promise.all(
          invoicesData.map(async (invoice) => {
            const { data: project } = await supabase
              .from('projects')
              .select('id, title, description')
              .eq('id', invoice.project_id)
              .single();

            return {
              ...invoice,
              project: project || { id: invoice.project_id, title: 'Projet', description: null }
            };
          })
        );

        console.log(`✅ ${enrichedInvoices.length} facture(s) chargée(s) pour le client`);
        setInvoices(enrichedInvoices as any);
      }
    } catch (error) {
      console.error('Erreur chargement factures:', error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
      draft: 'bg-gray-200 text-gray-800',
      sent: 'bg-blue-200 text-blue-800',
      paid: 'bg-green-200 text-green-800',
      cancelled: 'bg-red-200 text-red-800',
    };

    const labels: Record<string, string> = {
      draft: 'Brouillon',
      sent: 'En attente',
      paid: 'Payée',
      cancelled: 'Annulée',
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status] || 'bg-gray-200'}`}>
        {labels[status] || status}
      </span>
    );
  }

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500">Chargement...</p>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-anthracite mb-6">Mes Factures</h1>

        {invoices.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500">Aucune facture pour le moment.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id}>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">{invoice.invoice_number}</h3>
                      <p className="text-gray-600">{invoice.project.title}</p>
                    </div>
                    {getStatusBadge(invoice.status)}
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-3xl font-bold text-electric-blue">
                      {invoice.amount.toFixed(2)} €
                    </p>
                  </div>

                  {invoice.paid_at ? (
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <p className="text-green-800 font-medium">
                        ✅ Facture payée le {new Date(invoice.paid_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  ) : (
                    <>
                      {invoice.due_date && (
                        <p className="text-sm text-gray-600">
                          📅 Date d&apos;échéance: {new Date(invoice.due_date).toLocaleDateString('fr-FR')}
                        </p>
                      )}

                      {invoice.stripe_payment_link && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-4">
                          <p className="text-sm text-gray-700 mb-3">
                            💳 Vous pouvez payer cette facture en toute sécurité via Stripe
                          </p>
                          <a
                            href={invoice.stripe_payment_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button className="w-full">
                              Payer maintenant ({invoice.amount.toFixed(2)} €)
                            </Button>
                          </a>
                        </div>
                      )}
                    </>
                  )}

                  {invoice.notes && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      <p className="font-medium mb-1">Notes:</p>
                      <p>{invoice.notes}</p>
                    </div>
                  )}

                  <p className="text-xs text-gray-400">
                    Créée le {new Date(invoice.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ClientLayout>
  );
}

