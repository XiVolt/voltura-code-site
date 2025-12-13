-- Script pour vérifier et corriger les policies RLS
-- Exécutez ce script dans Supabase SQL Editor si la création de projets échoue

-- 1. Vérifier les policies existantes sur projects
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'projects';

-- 2. Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Admins can view all projects" ON projects;
DROP POLICY IF EXISTS "Admins can insert projects" ON projects;
DROP POLICY IF EXISTS "Admins can update projects" ON projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON projects;

-- 3. Créer les nouvelles policies

-- Policy SELECT pour les clients (voir leurs propres projets)
CREATE POLICY "Clients can view their own projects"
ON projects FOR SELECT
TO authenticated
USING (
  client_id = auth.uid()
);

-- Policy SELECT pour les admins (voir tous les projets)
CREATE POLICY "Admins can view all projects"
ON projects FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy INSERT pour les admins
CREATE POLICY "Admins can insert projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy UPDATE pour les admins
CREATE POLICY "Admins can update all projects"
ON projects FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy DELETE pour les admins
CREATE POLICY "Admins can delete all projects"
ON projects FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 4. Vérifier que RLS est activé
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 5. Vérifier les nouvelles policies
SELECT
  policyname,
  cmd,
  qual as using_expression,
  with_check as check_expression
FROM pg_policies
WHERE tablename = 'projects'
ORDER BY cmd, policyname;

-- 6. Faire la même chose pour project_chats
DROP POLICY IF EXISTS "Users can view project chats" ON project_chats;
DROP POLICY IF EXISTS "Admins can view all chats" ON project_chats;
DROP POLICY IF EXISTS "Users can insert chats" ON project_chats;
DROP POLICY IF EXISTS "Admins can insert chats" ON project_chats;

-- Policy SELECT pour project_chats
CREATE POLICY "Users can view their project chats"
ON project_chats FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_chats.project_id
    AND projects.client_id = auth.uid()
  )
  OR
  sender_id = auth.uid()
);

CREATE POLICY "Admins can view all project chats"
ON project_chats FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy INSERT pour project_chats
CREATE POLICY "Users can insert in their project chats"
ON project_chats FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_chats.project_id
    AND projects.client_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy UPDATE pour marquer comme lu
CREATE POLICY "Users can update their project chats read status"
ON project_chats FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_chats.project_id
    AND projects.client_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_chats.project_id
    AND projects.client_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

ALTER TABLE project_chats ENABLE ROW LEVEL SECURITY;

-- 7. Policies pour messages
DROP POLICY IF EXISTS "Users can view their messages" ON messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON messages;
DROP POLICY IF EXISTS "Users can insert messages" ON messages;

CREATE POLICY "Users can view messages they sent or received"
ON messages FOR SELECT
TO authenticated
USING (
  sender_id = auth.uid()
  OR
  recipient_id = auth.uid()
);

CREATE POLICY "Anyone can insert messages"
ON messages FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update their received messages"
ON messages FOR UPDATE
TO authenticated
USING (recipient_id = auth.uid())
WITH CHECK (recipient_id = auth.uid());

CREATE POLICY "Users can delete their messages"
ON messages FOR DELETE
TO authenticated
USING (
  sender_id = auth.uid()
  OR
  recipient_id = auth.uid()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 8. Test rapide (remplacez YOUR_ADMIN_ID par votre UUID admin)
-- SELECT * FROM profiles WHERE email = 'votre@email.com';
-- Puis testez l'insertion:
-- INSERT INTO projects (client_id, title, description, status, progress)
-- VALUES ('YOUR_ADMIN_ID', 'Test Projet', 'Test', 'en_cours', 0);

