# Voltura Code - Plateforme de Gestion de Projets

Site web moderne avec système de gestion de projets et chat en temps réel.

## 🚀 Technologies

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles
- **Supabase** - Base de données et authentification
- **Realtime** - Chat en temps réel

## 📋 Fonctionnalités

### Pour les Clients
- ✅ Voir leurs projets
- ✅ Chat en temps réel avec l'équipe
- ✅ Suivi de la progression
- ✅ Accès aux démos et repositories
- ✅ Voir et payer leurs factures en ligne (Stripe)

### Pour les Admins
- ✅ Gestion des projets
- ✅ Gestion des utilisateurs
- ✅ Chat avec tous les clients
- ✅ Gestion des messages de contact
- ✅ Éditeur de contenu du site
- ✅ Création de factures avec liens de paiement Stripe
- ✅ Suivi des paiements en temps réel

## 🛠️ Installation

1. **Cloner le projet**
```bash
git clone <url>
cd Site_voltura
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration Supabase**

Créer un fichier `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
```

4. **Exécuter les migrations SQL**

Dans Supabase SQL Editor, exécutez dans l'ordre :
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_project_chat_system.sql`
- `supabase/migrations/003_fix_rls_policies.sql`
- `supabase/migrations/004_invoices_and_payments.sql` *(pour le système de facturation)*

5. **Configuration Stripe (optionnel mais recommandé)**

Pour activer les paiements en ligne, voir le guide détaillé : **[GUIDE_PAIEMENT.md](./GUIDE_PAIEMENT.md)**

En bref :
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

6. **Lancer le serveur**
```bash
npm run dev
```

Le site sera accessible sur http://localhost:3000

## 📁 Structure

```
src/
├── app/                    # Pages Next.js
│   ├── auth/              # Authentification
│   ├── clients/           # Espace client
│   ├── contact/           # Page de contact
│   ├── dashboard/         # Dashboard
│   │   ├── admin/         # Panel admin
│   │   ├── messages/      # Messages
│   │   └── project/[id]/  # Chat projet
│   └── prestations/       # Services
├── components/            # Composants React
│   ├── ui/               # Composants UI
│   └── editor/           # Éditeur de contenu
├── lib/                  # Utilitaires
└── types/                # Types TypeScript
```

## 🔐 Authentification

### Créer un compte admin

1. Créez un compte via `/auth/register`
2. Dans Supabase, Table Editor → `profiles`
3. Changez `role` de `user` à `admin` pour votre compte

### Rôles disponibles
- `user` - Client normal
- `admin` - Administrateur

## 💬 Chat en Temps Réel

Le système de chat utilise Supabase Realtime pour des messages instantanés entre admins et clients.

**Pages de chat :**
- Client : `/dashboard/project/[id]`
- Admin : `/dashboard/admin/chats` puis cliquer sur un projet

## 💰 Système de Paiement (Stripe)

Le site intègre un système complet de facturation et paiement en ligne via Stripe.

### Fonctionnalités
- ✅ Création de factures depuis le dashboard admin
- ✅ Génération automatique de liens de paiement sécurisés
- ✅ Paiement par carte bancaire (via Stripe)
- ✅ Mise à jour automatique des statuts via webhooks
- ✅ Suivi des paiements en temps réel
- ✅ Gestion des acomptes et soldes

### Guide rapide
1. **Admin** : Créer une facture depuis `/dashboard/admin/invoices`
2. **Système** : Un lien de paiement Stripe est généré automatiquement
3. **Admin** : Copier et envoyer le lien au client (email, chat, etc.)
4. **Client** : Payer en ligne de façon sécurisée
5. **Système** : Mise à jour automatique du statut "Payé"

### Configuration
Voir **[GUIDE_PAIEMENT.md](./GUIDE_PAIEMENT.md)** pour la configuration complète de Stripe.

### Pages
- Admin : `/dashboard/admin/invoices` - Gestion des factures
- Client : `/dashboard/clients/invoices` - Consulter et payer ses factures

## 🎨 Personnalisation

### Couleurs (tailwind.config.js)
```javascript
colors: {
  'electric-blue': '#0066FF',
  'anthracite': '#2D2D2D',
  'volt-yellow': '#FFEB3B',
  'light-gray': '#F5F5F5'
}
```

### Contenu du site
Les admins peuvent modifier le contenu via `/dashboard/admin/editor`

## 📊 Base de Données

### Tables principales
- `profiles` - Profils utilisateurs
- `projects` - Projets clients
- `project_chats` - Messages de chat
- `messages` - Messages de contact
- `invoices` - Factures et paiements
- `payments` - Historique des transactions Stripe

### Policies RLS
Les policies Row Level Security sont configurées pour :
- Admins : Accès complet
- Clients : Accès à leurs propres projets et factures uniquement

## 🚀 Déploiement

### Build de production
```bash
npm run build
npm start
```

### Variables d'environnement requises
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 📝 Commandes Utiles

```bash
npm run dev      # Démarrer en développement
npm run build    # Build de production
npm start        # Démarrer en production
npm run lint     # Linter le code
```

## 🐛 Dépannage

### Les projets ne s'affichent pas
1. Vérifiez que RLS est configuré dans Supabase
2. Vérifiez que vous êtes bien connecté
3. Vérifiez les logs de la console (F12)

### Le chat ne fonctionne pas
1. Vérifiez que Realtime est activé dans Supabase
2. Vérifiez les policies sur `project_chats`

### Erreur d'hydratation React
Cette erreur est causée par des extensions de navigateur. Elle est gérée avec `suppressHydrationWarning`.

## 📞 Support

Pour toute question ou problème, consultez la documentation Supabase ou Next.js.

## 📄 Licence

Propriétaire - Voltura Code

---

**Version actuelle :** 2.0  
**Dernière mise à jour :** Décembre 2025

