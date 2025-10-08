import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * API Route pour récupérer le contenu du site
 * GET /api/admin/get-content
 */
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'site-content.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const content = JSON.parse(fileContent);

    return NextResponse.json(content);
  } catch (error) {
    console.error('Erreur de lecture du fichier:', error);
    return NextResponse.json(
      { error: 'Impossible de lire le contenu' },
      { status: 500 }
    );
  }
}
