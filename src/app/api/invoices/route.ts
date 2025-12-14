import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { createPaymentLink } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const body = await req.json();
    const { projectId, amount, type = 'deposit', dueDate, notes } = body;

    if (!projectId || !amount) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select(`
        *,
        client:profiles!projects_client_id_fkey (
          id,
          email,
          full_name
        )
      `)
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
    }

    // Générer un numéro de facture unique
    const invoiceNumber = `VOLT-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        project_id: projectId,
        client_id: project.client_id,
        invoice_number: invoiceNumber,
        amount: amount,
        status: 'draft',
        payment_status: 'pending',
        due_date: dueDate,
        notes: notes,
      })
      .select()
      .single();

    if (invoiceError || !invoice) {
      console.error('Erreur création facture:', invoiceError);
      return NextResponse.json({ error: 'Erreur création facture' }, { status: 500 });
    }

    const description = type === 'deposit'
      ? `Acompte - ${project.title}`
      : type === 'final'
      ? `Solde final - ${project.title}`
      : `Facture - ${project.title}`;

    const paymentLink = await createPaymentLink({
      amount: amount,
      invoiceId: invoice.id,
      invoiceNumber: invoiceNumber,
      clientEmail: project.client.email,
      clientName: project.client.full_name || undefined,
      description: description,
      projectTitle: project.title,
    });

    const { error: updateError } = await supabase
      .from('invoices')
      .update({
        stripe_payment_link: paymentLink.url,
        status: 'sent',
      })
      .eq('id', invoice.id);

    if (updateError) {
      console.error('Erreur mise à jour facture:', updateError);
    }

    if (type === 'deposit') {
      await supabase
        .from('projects')
        .update({ deposit_amount: amount })
        .eq('id', projectId);
    } else if (type === 'final') {
      await supabase
        .from('projects')
        .update({ final_payment_amount: amount })
        .eq('id', projectId);
    }

    return NextResponse.json({
      success: true,
      invoice: {
        ...invoice,
        stripe_payment_link: paymentLink.url,
      },
      paymentLink: paymentLink.url,
    });

  } catch (error: any) {
    console.error('Erreur création facture:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    let query = supabase
      .from('invoices')
      .select(`
        *,
        project:projects (
          id,
          title,
          description
        ),
        client:profiles!invoices_client_id_fkey (
          id,
          email,
          full_name
        )
      `)
      .order('created_at', { ascending: false });

    if (profile?.role !== 'admin') {
      query = query.eq('client_id', user.id);
    }

    const { data: invoices, error } = await query;

    if (error) {
      console.error('Erreur récupération factures:', error);
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    return NextResponse.json({ invoices: invoices || [] });

  } catch (error: any) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

