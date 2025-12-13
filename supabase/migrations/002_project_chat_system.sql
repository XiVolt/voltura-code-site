-- Migration pour le système de chat par projet

-- Table pour les projets (si n'existe pas déjà)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'en_cours' CHECK (status IN ('en_attente', 'en_cours', 'en_revision', 'termine', 'annule')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    deadline TIMESTAMP WITH TIME ZONE,
    demo_url TEXT,
    repository_url TEXT,
    notes TEXT,
    project_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les messages de chat par projet
CREATE TABLE IF NOT EXISTS public.project_chats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_project_chats_project_id ON public.project_chats(project_id);
CREATE INDEX IF NOT EXISTS idx_project_chats_created_at ON public.project_chats(created_at DESC);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_chats ENABLE ROW LEVEL SECURITY;

-- Policies pour projects
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
CREATE POLICY "Users can view own projects" ON public.projects
    FOR SELECT USING (
        auth.uid() = client_id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can manage all projects" ON public.projects;
CREATE POLICY "Admins can manage all projects" ON public.projects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Clients can update own project data" ON public.projects;
CREATE POLICY "Clients can update own project data" ON public.projects
    FOR UPDATE USING (auth.uid() = client_id)
    WITH CHECK (auth.uid() = client_id);

-- Policies pour project_chats
DROP POLICY IF EXISTS "Users can view project chats" ON public.project_chats;
CREATE POLICY "Users can view project chats" ON public.project_chats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id
            AND (client_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.profiles
                WHERE id = auth.uid() AND role = 'admin'
            ))
        )
    );

DROP POLICY IF EXISTS "Users can send messages in their projects" ON public.project_chats;
CREATE POLICY "Users can send messages in their projects" ON public.project_chats
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id
            AND (client_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.profiles
                WHERE id = auth.uid() AND role = 'admin'
            ))
        )
    );

DROP POLICY IF EXISTS "Users can mark messages as read" ON public.project_chats;
CREATE POLICY "Users can mark messages as read" ON public.project_chats
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id
            AND (client_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.profiles
                WHERE id = auth.uid() AND role = 'admin'
            ))
        )
    );

-- Trigger pour updated_at sur projects
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Vue pour afficher les projets avec le nombre de messages non lus
CREATE OR REPLACE VIEW public.projects_with_unread AS
SELECT
    p.*,
    COUNT(CASE WHEN pc.is_read = false AND pc.is_admin = true THEN 1 END) as unread_from_admin,
    COUNT(CASE WHEN pc.is_read = false AND pc.is_admin = false THEN 1 END) as unread_from_client
FROM public.projects p
LEFT JOIN public.project_chats pc ON p.id = pc.project_id
GROUP BY p.id;

-- Fonction pour obtenir le dernier message d'un projet
CREATE OR REPLACE FUNCTION get_last_project_message(project_uuid UUID)
RETURNS TABLE (
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    sender_name TEXT,
    is_admin BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pc.message,
        pc.created_at,
        COALESCE(pr.full_name, pr.email) as sender_name,
        pc.is_admin
    FROM public.project_chats pc
    JOIN public.profiles pr ON pc.sender_id = pr.id
    WHERE pc.project_id = project_uuid
    ORDER BY pc.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

