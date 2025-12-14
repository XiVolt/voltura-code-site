'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import AdminLayout from '@/components/AdminLayout';
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
  project: {
    id: string;
    title: string;
  };
  client: {
    id: string;
    email: string;
    full_name: string | null;
  };
}

interface Project {
  id: string;
  title: string;
  client_id: string;
  client: {
    email: string;
    full_name: string | null;
  };
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    amount: '',
    type: 'deposit',
    dueDate: '',
    notes: '',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const supabase = createClient();

      // Vérifier l'authentification
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Non authentifié');
        return;
      }

      // Charger les factures avec jointures
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select(`
          *,
          project:projects (
            id,
            title
          ),
          client:profiles!invoices_client_id_fkey (
            id,
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (invoicesError) {
        console.error('Erreur chargement factures:', invoicesError);
      } else if (invoicesData) {
        setInvoices(invoicesData as any);
      }

      // Charger tous les projets
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, title, client_id')
        .order('created_at', { ascending: false });

      if (projectsError) {
        console.error('Erreur chargement projets:', projectsError);
      } else if (projectsData) {
        // Charger les informations des clients pour chaque projet
        const projectsWithClients = await Promise.all(
          projectsData.map(async (project) => {
            const { data: client } = await supabase
              .from('profiles')
              .select('email, full_name')
              .eq('id', project.client_id)
              .single();

            return {
              ...project,
              client: client || { email: 'Inconnu', full_name: null }
            };
          })
        );

        setProjects(projectsWithClients as any);
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateInvoice(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.projectId || !formData.amount) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setCreating(true);
      const supabase = createClient();

      // Vérifier l'authentification
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        alert('❌ Erreur: Non authentifié. Veuillez vous reconnecter.');
        return;
      }

      console.log('📋 Création facture pour projet ID:', formData.projectId);

      // Récupérer les infos du projet
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', formData.projectId)
        .single();

      if (projectError) {
        console.error('❌ Erreur récupération projet:', projectError);
        alert(`❌ Erreur: Projet non trouvé (${projectError.message})`);
        return;
      }

      if (!project) {
        alert('❌ Erreur: Projet non trouvé');
        return;
      }

      console.log('✅ Projet trouvé:', project);

      // Récupérer les infos du client
      const { data: client, error: clientError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('id', project.client_id)
        .single();

      if (clientError) {
        console.error('⚠️ Erreur récupération client:', clientError);
      }

      console.log('✅ Client trouvé:', client);

      // Générer un numéro de facture unique
      const invoiceNumber = `VOLT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

      // Créer la facture dans Supabase
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          project_id: formData.projectId,
          client_id: project.client_id,
          invoice_number: invoiceNumber,
          amount: parseFloat(formData.amount),
          status: 'draft',
          payment_status: 'pending',
          due_date: formData.dueDate || null,
          notes: formData.notes,
        })
        .select()
        .single();

      if (invoiceError || !invoice) {
        console.error('Erreur création facture:', invoiceError);
        alert('❌ Erreur lors de la création de la facture');
        return;
      }

      // Appeler l'API pour créer le lien Stripe
      const stripeResponse = await fetch('/api/invoices/create-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice.id,
          invoiceNumber: invoiceNumber,
          amount: parseFloat(formData.amount),
          projectTitle: project.title,
          clientEmail: client?.email || 'inconnu@email.com',
          clientName: client?.full_name || null,
          description: formData.type === 'deposit'
            ? `Acompte - ${project.title}`
            : formData.type === 'final'
            ? `Solde final - ${project.title}`
            : `Facture - ${project.title}`,
        }),
      });

      const stripeData = await stripeResponse.json();

      if (!stripeResponse.ok || !stripeData.paymentLink) {
        console.error('Erreur Stripe:', stripeData);
        alert('⚠️ Facture créée mais erreur lors de la génération du lien de paiement.');
        loadData();
        return;
      }

      // Mettre à jour la facture avec le lien Stripe
      await supabase
        .from('invoices')
        .update({
          stripe_payment_link: stripeData.paymentLink,
          status: 'sent',
        })
        .eq('id', invoice.id);

      // Mettre à jour le projet si c'est un acompte ou solde final
      if (formData.type === 'deposit') {
        await supabase
          .from('projects')
          .update({ deposit_amount: parseFloat(formData.amount) })
          .eq('id', formData.projectId);
      } else if (formData.type === 'final') {
        await supabase
          .from('projects')
          .update({ final_payment_amount: parseFloat(formData.amount) })
          .eq('id', formData.projectId);
      }

      alert(`✅ Facture créée avec succès!\n\nNuméro: ${invoiceNumber}\n\nLien de paiement:\n${stripeData.paymentLink}\n\nCopiez ce lien et envoyez-le au client.`);

      setShowCreateForm(false);
      setFormData({
        projectId: '',
        amount: '',
        type: 'deposit',
        dueDate: '',
        notes: '',
      });

      loadData();
    } catch (error) {
      console.error('Erreur création facture:', error);
      alert('❌ Erreur lors de la création de la facture');
    } finally {
      setCreating(false);
    }
  }

  function copyPaymentLink(link: string) {
    navigator.clipboard.writeText(link);
    alert('✅ Lien de paiement copié!');
  }

  function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
      draft: 'bg-gray-200 text-gray-800',
      sent: 'bg-blue-200 text-blue-800',
      paid: 'bg-green-200 text-green-800',
      cancelled: 'bg-red-200 text-red-800',
      refunded: 'bg-orange-200 text-orange-800',
    };

    const labels: Record<string, string> = {
      draft: 'Brouillon',
      sent: 'Envoyée',
      paid: 'Payée',
      cancelled: 'Annulée',
      refunded: 'Remboursée',
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status] || 'bg-gray-200'}`}>
        {labels[status] || status}
      </span>
    );
  }

  function getPaymentStatusBadge(status: string) {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-200 text-yellow-800',
      processing: 'bg-blue-200 text-blue-800',
      succeeded: 'bg-green-200 text-green-800',
      failed: 'bg-red-200 text-red-800',
      refunded: 'bg-orange-200 text-orange-800',
    };

    const labels: Record<string, string> = {
      pending: 'En attente',
      processing: 'En cours',
      succeeded: 'Réussi',
      failed: 'Échoué',
      refunded: 'Remboursé',
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status] || 'bg-gray-200'}`}>
        {labels[status] || status}
      </span>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500">Chargement...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-anthracite">Factures & Paiements</h1>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Annuler' : '+ Nouvelle Facture'}
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-6">
            <h2 className="text-xl font-bold mb-4">Créer une facture</h2>
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Projet *</label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Sélectionner un projet</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title} - {project.client?.full_name || project.client?.email || 'Client inconnu'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Montant (€) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="1000.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="deposit">Acompte (30-50%)</option>
                    <option value="final">Solde final</option>
                    <option value="full">Paiement complet</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date d&apos;échéance</label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border rounded px-3 py-2 min-h-[80px]"
                  placeholder="Notes internes..."
                />
              </div>

              <Button type="submit" disabled={creating}>
                {creating ? 'Création...' : 'Créer la facture et générer le lien'}
              </Button>
            </form>
          </Card>
        )}

        <div className="space-y-4">
          {invoices.length === 0 ? (
            <Card>
              <p className="text-center text-gray-500">Aucune facture pour le moment.</p>
            </Card>
          ) : (
            invoices.map((invoice) => (
              <Card key={invoice.id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{invoice.invoice_number}</h3>
                      {getStatusBadge(invoice.status)}
                      {getPaymentStatusBadge(invoice.payment_status)}
                    </div>

                    <p className="text-gray-600 mb-2">
                      <strong>Projet:</strong> {invoice.project.title}
                    </p>

                    <p className="text-gray-600 mb-2">
                      <strong>Client:</strong> {invoice.client.full_name || invoice.client.email}
                    </p>

                    <p className="text-2xl font-bold text-electric-blue mb-2">
                      {invoice.amount.toFixed(2)} €
                    </p>

                    {invoice.paid_at && (
                      <p className="text-sm text-green-600">
                        ✅ Payée le {new Date(invoice.paid_at).toLocaleDateString('fr-FR')}
                      </p>
                    )}

                    {invoice.due_date && !invoice.paid_at && (
                      <p className="text-sm text-gray-500">
                        📅 Échéance: {new Date(invoice.due_date).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {invoice.stripe_payment_link && invoice.payment_status !== 'succeeded' && (
                      <>
                        <Button
                          onClick={() => copyPaymentLink(invoice.stripe_payment_link!)}
                          variant="secondary"
                        >
                          📋 Copier le lien
                        </Button>
                        <a
                          href={invoice.stripe_payment_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="secondary">
                            🔗 Voir le lien
                          </Button>
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

