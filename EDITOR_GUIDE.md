# Guide de Configuration - Éditeur Visuel

## 🔐 Variables d'Environnement Requises

Pour que l'éditeur visuel fonctionne correctement, vous devez configurer les variables suivantes dans votre fichier `.env.local` :

### 1. ADMIN_PASSWORD
**Description:** Mot de passe pour protéger les API d'administration  
**Utilisation:** Authentification pour les routes `/api/admin/update-content` et `/api/admin/deploy`

```env
ADMIN_PASSWORD=votre_mot_de_passe_securise_ici
```

⚠️ **Important:** Choisissez un mot de passe fort et ne le partagez jamais publiquement.

### 2. VERCEL_DEPLOY_HOOK
**Description:** URL du webhook Vercel pour déclencher les déploiements automatiques  
**Utilisation:** Redéploiement automatique du site après modification du contenu

```env
VERCEL_DEPLOY_HOOK=https://api.vercel.com/v1/integrations/deploy/prj_xxxxx/xxxxxx
```

#### Comment obtenir votre Deploy Hook Vercel :

1. Connectez-vous à [vercel.com](https://vercel.com)
2. Accédez à votre projet **Site_voltura**
3. Allez dans **Settings** > **Git** > **Deploy Hooks**
4. Créez un nouveau Deploy Hook :
   - **Name:** `Content Editor`
   - **Branch:** `main` (ou votre branche principale)
5. Cliquez sur **Create Hook**
6. Copiez l'URL générée et collez-la dans `.env.local`

---

## 📝 Fichier .env.local Complet

Voici un exemple de fichier `.env.local` avec toutes les variables nécessaires :

```env
# Supabase Configuration (existantes)
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase

# Admin Editor Configuration (nouvelles)
ADMIN_PASSWORD=MonMotDePasseSecurise123!
VERCEL_DEPLOY_HOOK=https://api.vercel.com/v1/integrations/deploy/prj_xxxxx/xxxxxx
```

---

## 🚀 Utilisation de l'Éditeur

### Accès à l'éditeur
URL : `/dashboard/admin/editor`

### Workflow d'édition

1. **Connexion**
   - Entrez le mot de passe administrateur (défini dans `ADMIN_PASSWORD`)
   - Cliquez sur "Se connecter"

2. **Activation du mode édition**
   - Cliquez sur le bouton **"Mode Édition"** (en haut à gauche)
   - Les éléments éditables seront surlignés en jaune au survol

3. **Modification du contenu**
   - **Texte:** Cliquez sur n'importe quel texte pour l'éditer
   - **Couleurs:** Cliquez sur les sélecteurs de couleur dans la section "Thème"
   - **Images:** Survolez une image et cliquez sur "Changer l'image"

4. **Sauvegarde**
   - Cliquez sur **"Sauvegarder"** pour enregistrer vos modifications dans `site-content.json`
   - Les changements sont sauvegardés localement

5. **Déploiement**
   - Cliquez sur **"Déployer"** pour déclencher un redéploiement Vercel
   - Le site sera mis à jour automatiquement dans 2-3 minutes

---

## 🛠️ Architecture Technique

### Fichiers Créés

```
src/
├── data/
│   └── site-content.json           # Stockage du contenu éditable
├── app/
│   ├── api/
│   │   └── admin/
│   │       ├── get-content/        # GET: Récupère le contenu
│   │       ├── update-content/     # POST: Sauvegarde le contenu
│   │       └── deploy/             # POST: Déclenche le déploiement
│   └── dashboard/
│       └── admin/
│           └── editor/
│               └── page.tsx        # Interface d'édition
└── components/
    └── editor/
        ├── EditableText.tsx        # Composant texte éditable
        ├── EditableColor.tsx       # Sélecteur de couleur
        └── EditableImage.tsx       # Éditeur d'image
```

### Structure des Données (site-content.json)

```json
{
  "hero": {
    "title": "Titre principal",
    "subtitle": "Sous-titre",
    "ctaText": "Bouton d'action"
  },
  "services": {
    "title": "Titre de la section",
    "items": [
      {
        "title": "Service 1",
        "description": "Description du service",
        "icon": "💻"
      }
    ]
  },
  "about": {
    "title": "À propos",
    "description": "Description",
    "image": "url_image"
  },
  "contact": {
    "title": "Contact",
    "description": "Description",
    "email": "email@exemple.com",
    "phone": "+33 1 23 45 67 89"
  },
  "theme": {
    "primaryColor": "#2D2D2D",
    "secondaryColor": "#FFD700",
    "accentColor": "#FFFFFF"
  }
}
```

---

## 🔒 Sécurité

### Bonnes Pratiques

1. **Ne commitez JAMAIS le fichier `.env.local`**
   - Déjà inclus dans `.gitignore`

2. **Utilisez des mots de passe forts**
   - Minimum 12 caractères
   - Mélange de lettres, chiffres et symboles

3. **Limitez l'accès à l'éditeur**
   - Seuls les administrateurs doivent connaître le mot de passe
   - Changez le mot de passe régulièrement

4. **Deploy Hook Vercel**
   - Ne partagez jamais l'URL du webhook
   - Si compromise, régénérez-la dans les paramètres Vercel

---

## 🐛 Dépannage

### L'éditeur ne charge pas le contenu
- Vérifiez que `site-content.json` existe dans `src/data/`
- Vérifiez les permissions de lecture du fichier

### La sauvegarde échoue
- Vérifiez que `ADMIN_PASSWORD` est défini dans `.env.local`
- Vérifiez les permissions d'écriture sur `site-content.json`

### Le déploiement ne se déclenche pas
- Vérifiez que `VERCEL_DEPLOY_HOOK` est correctement configuré
- Testez l'URL du webhook directement dans Vercel

### Erreur 401 (Non autorisé)
- Le mot de passe dans la requête ne correspond pas à `ADMIN_PASSWORD`
- Redémarrez le serveur Next.js après modification de `.env.local`

---

## 📚 Prochaines Étapes

Pour intégrer l'éditeur dans les vraies pages du site :

1. Remplacer les textes statiques par des composants `EditableText`
2. Charger les données depuis `site-content.json` au lieu de valeurs en dur
3. Appliquer les couleurs du thème dynamiquement via Tailwind CSS

Exemple d'intégration :
```tsx
import siteContent from '@/data/site-content.json';

<h1>{siteContent.hero.title}</h1>
```
