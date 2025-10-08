import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route pour déclencher un déploiement Vercel
 * POST /api/admin/deploy
 * Body: { password: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    // 🔒 Vérification du mot de passe admin
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }

    // 🚀 Deploy Hook Vercel
    const VERCEL_DEPLOY_HOOK = process.env.VERCEL_DEPLOY_HOOK;
    
    if (!VERCEL_DEPLOY_HOOK) {
      return NextResponse.json(
        { error: 'Deploy Hook non configuré. Ajoutez VERCEL_DEPLOY_HOOK dans vos variables d\'environnement.' },
        { status: 500 }
      );
    }

    // Appel du webhook Vercel
    const response = await fetch(VERCEL_DEPLOY_HOOK, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Erreur lors du déclenchement du déploiement');
    }

    return NextResponse.json({
      success: true,
      message: 'Déploiement en cours... Votre site sera mis à jour dans quelques minutes.'
    });

  } catch (error) {
    console.error('Erreur lors du déploiement:', error);
    return NextResponse.json(
      { error: 'Erreur lors du déclenchement du déploiement' },
      { status: 500 }
    );
  }
}
