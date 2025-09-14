# Guide de Déploiement - Voltura Code

## 🚀 Déploiement sur Vercel

### 1. Prérequis
- Compte [Vercel](https://vercel.com)
- Projet Supabase configuré
- Code source sur GitHub/GitLab

### 2. Configuration des Variables d'Environnement

Dans le dashboard Vercel, ajoutez ces variables :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anonyme_supabase
NEXT_PUBLIC_SITE_URL=https://votre-domaine.vercel.app
```

### 3. Déploiement Automatique

1. Connectez votre repository GitHub à Vercel
2. Les variables d'environnement seront automatiquement appliquées
3. Vercel détectera Next.js et utilisera la configuration appropriée

### 4. Configuration du Domaine Personnalisé

1. Dans Vercel Dashboard > Settings > Domains
2. Ajoutez votre domaine personnalisé
3. Configurez les enregistrements DNS selon les instructions Vercel

## 🗄️ Configuration Supabase

### 1. Créer le Projet Supabase

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez l'URL et la clé API anonyme

### 2. Configuration de la Base de Données

Exécutez le script SQL dans l'éditeur SQL de Supabase :

```sql
-- Voir le fichier supabase/migrations/001_initial_schema.sql
```

### 3. Configuration de l'Authentification

1. Dans Authentication > Settings
2. Configurez l'URL du site : `https://votre-domaine.com`
3. Ajoutez les URLs de redirection autorisées

### 4. Row Level Security (RLS)

Les politiques RLS sont déjà configurées dans le script de migration pour :
- Accès sécurisé aux profils
- Gestion des messages
- Contrôle des services
- Gestion des commandes

## 🔧 Développement Local

### 1. Installation
```bash
npm install
```

### 2. Configuration Locale
```bash
cp .env.example .env.local
# Remplir les variables d'environnement
```

### 3. Lancement
```bash
npm run dev
```

## 📊 Surveillance et Maintenance

### Analytics Vercel
- Activez Vercel Analytics dans le dashboard
- Suivez les performances et l'utilisation

### Monitoring Supabase
- Surveillez l'utilisation de la base de données
- Configurez des alertes pour les limites

### Sauvegardes
- Supabase effectue des sauvegardes automatiques
- Configurez des sauvegardes supplémentaires si nécessaire

## 🛡️ Sécurité

### Variables d'Environnement
- Ne jamais commiter de clés secrètes
- Utiliser des variables d'environnement pour toutes les configurations

### Supabase RLS
- Les politiques RLS protègent automatiquement les données
- Tester régulièrement les permissions

### HTTPS
- Vercel active automatiquement HTTPS
- Configurer la redirection HTTP vers HTTPS

## 🔄 Mises à Jour

### Déploiement Continu
- Chaque push sur la branche main déclenche un déploiement
- Utilisez des branches de feature pour les développements

### Base de Données
- Utilisez les migrations SQL pour les modifications de schéma
- Testez toujours en local avant la production

## ❗ Dépannage

### Erreurs de Build
- Vérifiez les versions Node.js compatibles
- Contrôlez les imports/exports TypeScript

### Erreurs Supabase
- Vérifiez les variables d'environnement
- Contrôlez les politiques RLS
- Vérifiez les permissions de la base de données

### Performance
- Utilisez l'optimiseur d'images Next.js
- Configurez le cache approprié
- Surveillez les Core Web Vitals

## 📧 Support

Pour toute question technique :
- Email : support@voltura-code.com
- Documentation officielle : [Next.js](https://nextjs.org/docs), [Supabase](https://supabase.com/docs)