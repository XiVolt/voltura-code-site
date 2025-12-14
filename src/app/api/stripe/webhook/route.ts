import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Erreur vérification webhook:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Traiter les événements Stripe
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      default:
        console.log(`Type d'événement non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erreur traitement webhook:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const invoiceId = paymentIntent.metadata.invoice_id;

  if (!invoiceId) {
    console.error('invoice_id manquant dans les métadonnées');
    return;
  }

  // Mettre à jour la facture
  const { error: invoiceError } = await supabaseAdmin
    .from('invoices')
    .update({
      payment_status: 'succeeded',
      status: 'paid',
      stripe_payment_intent_id: paymentIntent.id,
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', invoiceId);

  if (invoiceError) {
    console.error('Erreur mise à jour facture:', invoiceError);
    return;
  }

  // Créer un enregistrement de paiement
  const { error: paymentError } = await supabaseAdmin
    .from('payments')
    .insert({
      invoice_id: invoiceId,
      amount: paymentIntent.amount / 100, // Convertir centimes en euros
      stripe_payment_intent_id: paymentIntent.id,
      stripe_charge_id: paymentIntent.latest_charge as string,
      payment_method: paymentIntent.payment_method_types[0],
      status: 'succeeded',
      metadata: paymentIntent.metadata,
    });

  if (paymentError) {
    console.error('Erreur enregistrement paiement:', paymentError);
  }

  console.log(`✅ Paiement réussi pour la facture ${invoiceId}`);
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const invoiceId = paymentIntent.metadata.invoice_id;

  if (!invoiceId) return;

  const { error } = await supabaseAdmin
    .from('invoices')
    .update({
      payment_status: 'failed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', invoiceId);

  if (error) {
    console.error('Erreur mise à jour facture (échec):', error);
  }

  console.log(`❌ Paiement échoué pour la facture ${invoiceId}`);
}

async function handleRefund(charge: Stripe.Charge) {
  const paymentIntentId = charge.payment_intent as string;

  // Trouver la facture concernée
  const { data: invoice } = await supabaseAdmin
    .from('invoices')
    .select('id')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .single();

  if (!invoice) return;

  const { error } = await supabaseAdmin
    .from('invoices')
    .update({
      payment_status: 'refunded',
      status: 'refunded',
      updated_at: new Date().toISOString(),
    })
    .eq('id', invoice.id);

  if (error) {
    console.error('Erreur mise à jour facture (remboursement):', error);
  }

  console.log(`💰 Remboursement effectué pour la facture ${invoice.id}`);
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session complété:', session.id);
  // Gérer si vous utilisez Checkout Session au lieu de Payment Links
}

