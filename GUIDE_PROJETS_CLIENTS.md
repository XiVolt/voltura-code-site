# 🚀 Guide de Configuration - Gestion de Projets Clients

## 📋 Vue d'ensemble

Ce système permet aux **clients connectés** de :
- ✅ Voir leurs projets en cours
- ✅ Suivre la progression en temps réel
- ✅ Communiquer avec l'équipe Voltura Code
- ✅ Accéder aux liens (démo, repository)
- ✅ Consulter le budget et l'échéance

Les **admins** peuvent :
- ✅ Créer et assigner des projets aux clients
- ✅ Mettre à jour le statut et la progression
- ✅ Ajouter des notes et des liens
- ✅ Communiquer avec les clients

---

## 🗄️ Étape 1 : Configuration Supabase

### Créer les tables dans Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Ouvrez votre projet
3. Allez dans **SQL Editor**
4. Exécutez le script SQL suivant :

```sql
-- Table pour stocker les projets clients
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'en_cours', 'en_revision', 'termine', 'annule')),
  budget DECIMAL(10, 2),
  deadline DATE,
  progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  repository_url TEXT,
  demo_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table pour les commentaires/updates du projet
CREATE TABLE IF NOT EXISTS project_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Index pour améliorer les performances
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_updates_project_id ON project_updates(project_id);

-- RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;

-- Les clients peuvent voir leurs propres projets
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = client_id);

-- Les admins peuvent voir tous les projets
CREATE POLICY "Admins can view all projects" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Les admins peuvent créer/modifier/supprimer des projets
CREATE POLICY "Admins can manage projects" ON projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Les clients peuvent voir les updates de leurs projets
CREATE POLICY "Users can view updates of own projects" ON project_updates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_updates.project_id 
      AND projects.client_id = auth.uid()
    )
  );

-- Les admins peuvent voir tous les updates
CREATE POLICY "Admins can view all updates" ON project_updates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Les clients peuvent créer des updates sur leurs projets
CREATE POLICY "Users can create updates on own projects" ON project_updates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_updates.project_id 
      AND projects.client_id = auth.uid()
    )
  );

-- Les admins peuvent créer des updates sur tous les projets
CREATE POLICY "Admins can create updates" ON project_updates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

---

## 📁 Étape 2 : Créer le fichier `src/app/clients/page.tsx`

Le fichier a été préparé dans `supabase_projects_setup.sql`. 

**Pour l'installer :**

Créez le fichier `src/app/clients/page.tsx` et copiez le code suivant :

👉 **Voir le fichier complet dans le dépôt GitHub ou consultez la documentation.**

---

## 🧪 Étape 3 : Tester le Système

### 1. Créer un projet de test (en tant qu'admin)

Exécutez dans **SQL Editor** de Supabase :

```sql
-- Récupérer l'ID d'un utilisateur client
SELECT id, email FROM auth.users WHERE email = 'client@example.com';

-- Créer un projet de test
INSERT INTO projects (client_id, title, description, status, budget, deadline, progress, demo_url, notes)
VALUES (
  'ID_DU_CLIENT_ICI',
  'Site vitrine pour entreprise',
  'Création d\'un site vitrine moderne avec React et Next.js',
  'en_cours',
  1500.00,
  '2025-11-15',
  45,
  'https://demo.example.com',
  'Le design est validé, en attente des contenus finaux'
);
```

### 2. Ajouter un commentaire de test

```sql
-- Récupérer l'ID du projet créé
SELECT id FROM projects WHERE title = 'Site vitrine pour entreprise';

-- Ajouter un commentaire admin
INSERT INTO project_updates (project_id, author_id, content, is_admin)
VALUES (
  'ID_DU_PROJET_ICI',
  'ID_ADMIN_ICI',
  'Bonjour ! Le design de la page d\'accueil est terminé. Pouvez-vous me confirmer les couleurs choisies ?',
  true
);
```

### 3. Tester l'interface

1. Connectez-vous en tant que **client** : `/auth/login`
2. Accédez à la page **Clients** : `/clients`
3. Vous devriez voir votre projet avec :
   - Titre et description
   - Badge de statut coloré
   - Barre de progression
   - Échéance
4. **Cliquez sur le projet** pour ouvrir le détail
5. **Testez la discussion** en envoyant un message

---

## 🎨 Fonctionnalités Implémentées

### Interface Client (`/clients`)

✅ **Liste des projets**
- Affichage en grille (cards)
- Badge de statut coloré
- Barre de progression visuelle
- Échéance affichée

✅ **Détail du projet (modal)**
- Description complète
- Budget et échéance
- Liens vers démo et repository
- Notes de l'équipe (si disponibles)
- Discussion en temps réel

✅ **Communication**
- Messages différenciés (client vs admin)
- Envoi de commentaires
- Rafraîchissement automatique

### Statuts disponibles

| Statut | Badge | Description |
|--------|-------|-------------|
| `en_attente` | 🟤 Gris | Projet en attente de démarrage |
| `en_cours` | 🔵 Bleu | Projet en développement actif |
| `en_revision` | 🟡 Jaune | En révision / validation client |
| `termine` | 🟢 Vert | Projet terminé et livré |
| `annule` | 🔴 Rouge | Projet annulé |

---

## 🔐 Sécurité (RLS)

- ✅ Les clients ne voient **que leurs propres projets**
- ✅ Les admins voient **tous les projets**
- ✅ Seuls les admins peuvent créer/modifier des projets
- ✅ Les clients peuvent commenter leurs projets
- ✅ Les admins peuvent commenter tous les projets

---

## 📊 Gestion Admin (À créer)

Créez une page `/dashboard/admin/projects` pour gérer les projets :

- Créer un nouveau projet et l'assigner à un client
- Modifier le statut et la progression
- Ajouter des notes internes
- Répondre aux questions des clients

---

## 🚀 Déploiement

1. **Commitez les changements**
```bash
git add .
git commit -m "feat: système de gestion de projets clients"
git push
```

2. **Vérifiez le déploiement sur Vercel**

3. **Testez en production** avec un compte client réel

---

## 💡 Prochaines Améliorations

- [ ] Upload de fichiers (maquettes, documents)
- [ ] Notifications email lors de nouveaux messages
- [ ] Calendrier des échéances
- [ ] Factures et paiements
- [ ] Dashboard admin pour gérer les projets

---

**🎉 Votre système de gestion de projets est prêt !**

Les clients peuvent maintenant suivre leurs projets et communiquer directement avec vous via la plateforme.
