import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY manquante dans les variables d\'environnement');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
  typescript: true,
});

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
  try {
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Facture ${params.invoiceNumber}`,
              description: params.description,
              metadata: {
                invoice_id: params.invoiceId,
                project_title: params.projectTitle || '',
              },
            },
            unit_amount: Math.round(params.amount * 100), // Convertir en centimes
          },
          quantity: 1,
        },
      ],
      metadata: {
        invoice_id: params.invoiceId,
        invoice_number: params.invoiceNumber,
      },
      after_completion: {
        type: 'redirect',
        redirect: {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/clients?payment=success&invoice=${params.invoiceId}`,
        },
      },
      customer_creation: 'if_required',
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: params.description,
          metadata: {
            invoice_id: params.invoiceId,
            invoice_number: params.invoiceNumber,
          },
          footer: 'Merci pour votre confiance - Voltura Code',
        },
      },
    });

    return paymentLink;
  } catch (error) {
    console.error('Erreur création lien de paiement Stripe:', error);
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

