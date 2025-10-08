import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * API Route pour mettre à jour le contenu du site
 * POST /api/admin/update-content
 * Body: { content: {...}, password: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, password } = body;

    // 🔒 Vérification du mot de passe admin
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Validation du contenu
    if (!content) {
      return NextResponse.json(
        { error: 'Contenu manquant' },
        { status: 400 }
      );
    }

    // Chemin vers le fichier data.json
    const dataPath = path.join(process.cwd(), 'src', 'data', 'site-content.json');

    // 💾 Sauvegarde du fichier
    fs.writeFileSync(dataPath, JSON.stringify(content, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Contenu sauvegardé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la sauvegarde' },
      { status: 500 }
    );
  }
}
