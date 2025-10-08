# ⚠️ IMPORTANT : CONFIGURATION REQUISE

## 🚨 La page `/clients` ne fonctionnera PAS tant que vous n'aurez pas créé les tables dans Supabase

### 📋 Étapes OBLIGATOIRES

#### 1️⃣ Aller sur Supabase

1. Ouvrez [https://supabase.com](https://supabase.com)
2. Connectez-vous à votre projet
3. Cliquez sur **SQL Editor** dans le menu de gauche

#### 2️⃣ Exécuter le script SQL

1. Cliquez sur **New Query**
2. Copiez-collez le contenu du fichier `supabase_projects_setup.sql`
3. Cliquez sur **Run** (en bas à droite)

#### 3️⃣ Vérifier que les tables sont créées

1. Allez dans **Table Editor**
2. Vous devriez voir 2 nouvelles tables :
   - ✅ `projects`
   - ✅ `project_updates`

#### 4️⃣ Tester avec un projet de démonstration

Dans **SQL Editor**, créez un projet de test :

```sql
-- 1. Récupérer votre ID utilisateur (remplacez l'email)
SELECT id, email FROM auth.users WHERE email = 'tristan.bras5962@gmail.com';

-- 2. Copier l'ID et créer un projet (remplacez 'VOTRE_ID_ICI')
INSERT INTO projects (
  client_id, 
  title, 
  description, 
  status, 
  budget, 
  deadline, 
  progress, 
  demo_url, 
  notes
)
VALUES (
  'VOTRE_ID_ICI',  -- ⬅️ REMPLACER PAR VOTRE ID
  'Site vitrine Voltura Code',
  'Création d''un site professionnel moderne avec React et Next.js, incluant authentification, messagerie et dashboard admin.',
  'en_cours',
  2500.00,
  '2025-11-30',
  75,
  'https://voltura-code-site-u1zs.vercel.app',
  'Projet en bonne voie ! Reste à finaliser l''éditeur de contenu et la gestion des projets clients.'
);

-- 3. Ajouter un message de l'équipe
-- Récupérer l'ID du projet créé
SELECT id FROM projects WHERE title = 'Site vitrine Voltura Code';

-- Récupérer votre ID admin
SELECT id FROM profiles WHERE role = 'admin' LIMIT 1;

-- Créer un message (remplacez les IDs)
INSERT INTO project_updates (project_id, author_id, content, is_admin)
VALUES (
  'ID_DU_PROJET',  -- ⬅️ REMPLACER
  'ID_DE_ADMIN',   -- ⬅️ REMPLACER
  'Bonjour ! Votre projet avance bien. Le système de messagerie est terminé, et nous sommes en train de finaliser l''éditeur de contenu. Avez-vous des questions ?',
  true
);
```

#### 5️⃣ Tester la page

1. Rechargez votre site : [https://voltura-code-site-u1zs.vercel.app/clients](https://voltura-code-site-u1zs.vercel.app/clients)
2. Connectez-vous avec votre compte
3. Vous devriez voir votre projet de test !

---

## 🔧 Dépannage

### Erreur "relation 'projects' does not exist"
➡️ **Solution** : Vous n'avez pas exécuté le script SQL. Suivez l'étape 2.

### Je ne vois aucun projet
➡️ **Solution** : Créez un projet de test avec le script de l'étape 4.

### Erreur TypeScript dans VS Code
➡️ **Solution** : Normal ! Les erreurs disparaîtront une fois que vous aurez créé les tables dans Supabase.

---

## ✅ Une fois configuré

Une fois les tables créées, la page `/clients` affichera :
- 📦 Liste de tous vos projets
- 📊 Barre de progression
- 💬 Discussion avec l'équipe
- 🔗 Liens vers la démo et le code
- 📅 Échéances et budget

---

**⏰ Temps estimé : 5 minutes**

Suivez les étapes dans l'ordre et tout fonctionnera parfaitement !
