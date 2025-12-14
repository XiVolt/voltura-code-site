import Stripe from 'stripe';

// Initialisation conditionnelle pour éviter les erreurs lors du build
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-11-17.clover',
      typescript: true,
    })
  : null;

// Fonction pour créer un lien de paiement Stripe
export async function createPaymentLink(params: {
  amount: number; // Montant en euros
  invoiceId: string;
  invoiceNumber: string;
  clientEmail: string;
  clientName?: string;
  description: string;
  projectTitle?: string;
}) {
  if (!stripe) {
    throw new Error('Stripe n\'est pas initialisé. Vérifiez que STRIPE_SECRET_KEY est définie.');
  }

  try {
    // Créer une Checkout Session au lieu d'un Payment Link
    // Car les Payment Links ne supportent pas payment_intent_data
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: params.clientEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Facture ${params.invoiceNumber}`,
              description: params.description,
            },
            unit_amount: Math.round(params.amount * 100), // Convertir en centimes
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          invoice_id: params.invoiceId,
          invoice_number: params.invoiceNumber,
        },
      },
      metadata: {
        invoice_id: params.invoiceId,
        invoice_number: params.invoiceNumber,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?invoice=${params.invoiceId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/clients/invoices`,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Erreur création session de paiement Stripe:', error);
    throw error;
  }
}

// Fonction pour créer un Payment Intent (alternative au payment link)
export async function createPaymentIntent(params: {
  amount: number; // Montant en euros
  invoiceId: string;
  invoiceNumber: string;
  clientEmail: string;
  description: string;
}) {
  if (!stripe) {
    throw new Error('Stripe n\'est pas initialisé. Vérifiez que STRIPE_SECRET_KEY est définie.');
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(params.amount * 100), // Convertir en centimes
      currency: 'eur',
      receipt_email: params.clientEmail,
      description: params.description,
      metadata: {
        invoice_id: params.invoiceId,
        invoice_number: params.invoiceNumber,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Erreur création Payment Intent:', error);
    throw error;
  }
}

// Fonction pour récupérer les informations d'un paiement
export async function getPaymentIntent(paymentIntentId: string) {
  if (!stripe) {
    throw new Error('Stripe n\'est pas initialisé. Vérifiez que STRIPE_SECRET_KEY est définie.');
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Erreur récupération Payment Intent:', error);
    throw error;
  }
}

// Fonction pour rembourser un paiement
export async function refundPayment(paymentIntentId: string, amount?: number) {
  if (!stripe) {
    throw new Error('Stripe n\'est pas initialisé. Vérifiez que STRIPE_SECRET_KEY est définie.');
  }

  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Montant en centimes ou remboursement total
    });
    return refund;
  } catch (error) {
    console.error('Erreur lors du remboursement:', error);
    throw error;
  }
}

