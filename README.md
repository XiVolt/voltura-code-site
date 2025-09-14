# Voltura Code - Site Web Professionnel

Site web professionnel pour Voltura Code construit avec Next.js, TypeScript, Tailwind CSS et Supabase.

## 🚀 Fonctionnalités

- **Page d'accueil moderne** avec présentation de l'entreprise
- **Système d'authentification** avec Supabase Auth  
- **Pages dédiées** : Prestations, Clients/Commandes, Contact
- **Messagerie intégrée** avec stockage Supabase
- **Tableaux de bord** utilisateur et administrateur
- **Design responsive** avec Tailwind CSS
- **Architecture scalable** avec composants réutilisables

## 🎨 Design

- **Couleurs principales** : Bleu électrique (#0066FF), Jaune volt (#FFFF00), Gris anthracite (#2C2C2C)
- **Style** : Moderne, minimaliste, professionnel
- **Responsive** : Optimisé mobile et desktop

## 🛠️ Technologies

- **Framework** : Next.js 15 avec App Router
- **Langage** : TypeScript
- **Style** : Tailwind CSS
- **Base de données** : Supabase
- **Authentification** : Supabase Auth
- **Déploiement** : Vercel (prévu)

## 📦 Installation

1. Installer les dépendances :
\`\`\`bash
npm install
\`\`\`

2. Configurer les variables d'environnement :
\`\`\`bash
cp .env.example .env.local
\`\`\`

3. Configurer Supabase (voir section Configuration)

4. Lancer le serveur de développement :
\`\`\`bash
npm run dev
\`\`\`

## ⚙️ Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Ajouter les variables d'environnement dans `.env.local` :
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anonyme_supabase
\`\`\`

3. Exécuter les migrations SQL (voir `/supabase/migrations/`)

## 📁 Structure du projet

\`\`\`
src/
├── app/                    # Pages Next.js App Router
│   ├── auth/              # Pages d'authentification
│   ├── dashboard/         # Tableaux de bord
│   ├── prestations/       # Page prestations
│   ├── contact/           # Page contact
│   └── layout.tsx         # Layout principal
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI de base
│   ├── auth/             # Composants d'authentification
│   └── dashboard/        # Composants des tableaux de bord
├── lib/                  # Utilitaires et configurations
│   ├── supabase.ts      # Client Supabase
│   ├── auth.ts          # Helpers d'authentification
│   └── utils.ts         # Fonctions utilitaires
└── types/               # Types TypeScript
\`\`\`

## 🗄️ Base de données

Tables Supabase :
- **users** : Profils utilisateurs étendus
- **messages** : Système de messagerie
- **services** : Prestations proposées
- **orders** : Commandes clients

## 🚀 Scripts disponibles

- \`npm run dev\` : Serveur de développement
- \`npm run build\` : Build de production
- \`npm run start\` : Serveur de production
- \`npm run lint\` : Vérification ESLint

## 📧 Contact

Pour toute question concernant ce projet, contactez Voltura Code.

## 📄 Licence

Ce projet est la propriété de Voltura Code.