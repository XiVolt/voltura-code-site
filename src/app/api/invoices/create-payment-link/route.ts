import { NextRequest, NextResponse } from 'next/server';
import { createPaymentLink } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      invoiceId,
      invoiceNumber,
      amount,
      projectTitle,
      clientEmail,
      clientName,
      description
    } = body;

    if (!invoiceId || !invoiceNumber || !amount || !clientEmail) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    // Créer le lien de paiement Stripe
    const paymentLink = await createPaymentLink({
      amount: amount,
      invoiceId: invoiceId,
      invoiceNumber: invoiceNumber,
      clientEmail: clientEmail,
      clientName: clientName,
      description: description,
      projectTitle: projectTitle,
    });

    return NextResponse.json({
      success: true,
      paymentLink: paymentLink.url,
    });

  } catch (error: any) {
    console.error('Erreur création lien Stripe:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

