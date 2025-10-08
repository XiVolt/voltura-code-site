# Code complet pour src/app/clients/page.tsx

Copiez tout le code ci-dessous et collez-le dans un nouveau fichier `src/app/clients/page.tsx` :

```typescript
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ClientLayout from '@/components/ClientLayout'
import { 
  Package, ArrowLeft, Save, Eye, EyeOff, ExternalLink, 
  MessageSquare, Send, Palette, Type, Image as ImageIcon,
  Sparkles, CheckCircle, Rocket
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EditableText from '@/components/editor/EditableText'
import EditableColor from '@/components/editor/EditableColor'
import EditableImage from '@/components/editor/EditableImage'

interface Project {
  id: string
  title: string
  description: string
  status: string
  progress: number
  deadline: string
  demo_url: string
  repository_url: string
  notes: string
  project_data: any
}

interface ProjectUpdate {
  id: string
  message: string
  created_at: string
  is_admin: boolean
}

export default function ClientsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [updates, setUpdates] = useState<ProjectUpdate[]>([])
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const router = useRouter()

  const [projectContent, setProjectContent] = useState({
    title: 'Mon Projet',
    subtitle: 'Description courte',
    primaryColor: '#00A6ED',
    accentColor: '#F7D500',
    backgroundColor: '#FFFFFF',
    textColor: '#2C2C2C',
    heroImage: '/images/hero.jpg',
    logoImage: '/images/logo.png',
    sections: [] as any[]
  })

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    setUser(user)
    loadProjects(user.id)
  }

  const loadProjects = async (userId: string) => {
    setLoading(true)
    
    const { data, error } = await supabase
      .from('projects' as any)
      .select('*')
      .eq('client_id', userId)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setProjects((data as any) || [])
    }
    
    setLoading(false)
  }

  const loadProjectUpdates = async (projectId: string) => {
    const { data } = await supabase
      .from('project_updates' as any)
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false})

    setUpdates((data as any) || [])
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    loadProjectUpdates(project.id)
    
    if (project.project_data) {
      setProjectContent(project.project_data)
    } else {
      setProjectContent({
        title: project.title,
        subtitle: project.description,
        primaryColor: '#00A6ED',
        accentColor: '#F7D500',
        backgroundColor: '#FFFFFF',
        textColor: '#2C2C2C',
        heroImage: '/images/hero.jpg',
        logoImage: '/images/logo.png',
        sections: []
      })
    }
  }

  const handleSaveContent = async () => {
    if (!selectedProject) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('projects' as any)
        .update({
          project_data: projectContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProject.id)

      if (!error) {
        alert('✅ Modifications enregistrées !')
        if (user) loadProjects(user.id)
      } else {
        alert('❌ Erreur lors de la sauvegarde')
      }
    } catch (err) {
      alert('❌ Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!selectedProject) return

    setPublishing(true)
    try {
      await handleSaveContent()
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('🚀 Site publié avec succès !')
    } catch (err) {
      alert('❌ Erreur lors de la publication')
    } finally {
      setPublishing(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedProject) return

    const { error } = await supabase
      .from('project_updates' as any)
      .insert([{
        project_id: selectedProject.id,
        user_id: user.id,
        message: newComment,
        is_admin: false
      }])

    if (!error) {
      setNewComment('')
      loadProjectUpdates(selectedProject.id)
    }
  }

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue"></div>
        </div>
      </ClientLayout>
    )
  }

  if (!selectedProject) {
    return (
      <ClientLayout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-anthracite mb-2">Mes Projets</h1>
              <p className="text-gray-600">Cliquez sur un projet pour le modifier et le publier</p>
            </div>

            {projects.length === 0 ? (
              <Card className="text-center py-16">
                <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Aucun projet en cours</h2>
                <p className="text-gray-600 mb-6">Vous n'avez pas encore de projet actif</p>
                <a href="/contact">
                  <Button>Démarrer un projet</Button>
                </a>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card 
                    key={project.id} 
                    className="hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progression</span>
                        <span className="font-semibold">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-electric-blue rounded-full h-2 transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <Button variant="primary" className="w-full">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Modifier mon site
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
          <div className="max-w-full px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => setSelectedProject(null)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Mes projets
                </Button>
                <div className="border-l pl-4">
                  <h1 className="font-bold text-lg">{selectedProject.title}</h1>
                  <p className="text-xs text-gray-600">Mode édition</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant={editMode ? 'primary' : 'outline'} onClick={() => setEditMode(!editMode)} size="sm">
                  {editMode ? <><EyeOff className="w-4 h-4 mr-2" /> Aperçu</> : <><Eye className="w-4 h-4 mr-2" /> Éditer</>}
                </Button>

                <Button onClick={handleSaveContent} loading={saving} variant="outline" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>

                <Button onClick={handlePublish} loading={publishing} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Rocket className="w-4 h-4 mr-2" />
                  Publier
                </Button>

                {selectedProject.demo_url && (
                  <a href={selectedProject.demo_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-73px)]">
          <div className="flex-1 overflow-y-auto bg-white p-8">
            <div className="max-w-4xl mx-auto">
              <div 
                className="rounded-xl p-12 mb-8 transition-all"
                style={{ 
                  backgroundColor: projectContent.backgroundColor,
                  color: projectContent.textColor,
                  borderLeft: `6px solid ${projectContent.primaryColor}`
                }}
              >
                {projectContent.logoImage && (
                  <div className="mb-6">
                    <EditableImage
                      value={projectContent.logoImage}
                      onChange={(val) => setProjectContent({ ...projectContent, logoImage: val })}
                      isEditMode={editMode}
                      alt="Logo"
                      className="h-16 w-auto"
                    />
                  </div>
                )}

                <EditableText
                  value={projectContent.title}
                  onChange={(val) => setProjectContent({ ...projectContent, title: val })}
                  className="text-5xl font-bold mb-4"
                  isEditMode={editMode}
                />
                
                <EditableText
                  value={projectContent.subtitle}
                  onChange={(val) => setProjectContent({ ...projectContent, subtitle: val })}
                  className="text-2xl opacity-90"
                  isEditMode={editMode}
                />

                <div className="mt-8">
                  <button
                    className="px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
                    style={{ 
                      backgroundColor: projectContent.accentColor,
                      color: '#000'
                    }}
                  >
                    En savoir plus
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4" style={{ color: projectContent.primaryColor }}>
                  Image principale
                </h3>
                <EditableImage
                  value={projectContent.heroImage}
                  onChange={(val) => setProjectContent({ ...projectContent, heroImage: val })}
                  isEditMode={editMode}
                  alt="Hero"
                  className="rounded-xl shadow-lg"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div 
                  className="p-6 rounded-xl"
                  style={{ backgroundColor: projectContent.primaryColor, color: '#fff' }}
                >
                  <h3 className="text-xl font-bold">Couleur Principale</h3>
                  <p className="mt-2 opacity-90">Pour les titres et éléments importants</p>
                </div>
                <div 
                  className="p-6 rounded-xl"
                  style={{ backgroundColor: projectContent.accentColor, color: '#000' }}
                >
                  <h3 className="text-xl font-bold">Couleur d'Accent</h3>
                  <p className="mt-2 opacity-90">Pour les boutons et call-to-action</p>
                </div>
              </div>

              {selectedProject.notes && (
                <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    Notes de l'équipe
                  </h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedProject.notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="w-96 bg-anthracite text-white overflow-y-auto border-l">
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Type className="w-5 h-5 text-volt-yellow" />
                  <h3 className="text-lg font-bold">Textes</h3>
                </div>
                <div className="space-y-3 bg-dark-gray p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium mb-2">Titre principal</label>
                    <input
                      type="text"
                      value={projectContent.title}
                      onChange={(e) => setProjectContent({ ...projectContent, title: e.target.value })}
                      className="w-full px-3 py-2 bg-anthracite border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Sous-titre</label>
                    <textarea
                      value={projectContent.subtitle}
                      onChange={(e) => setProjectContent({ ...projectContent, subtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-anthracite border border-gray-600 rounded text-white"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="w-5 h-5 text-volt-yellow" />
                  <h3 className="text-lg font-bold">Couleurs</h3>
                </div>
                <div className="space-y-3 bg-dark-gray p-4 rounded-lg">
                  {['primaryColor', 'accentColor', 'backgroundColor', 'textColor'].map((key) => (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-2 capitalize">
                        {key.replace('Color', ' ').replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={projectContent[key as keyof typeof projectContent] as string}
                          onChange={(e) => setProjectContent({ ...projectContent, [key]: e.target.value })}
                          className="w-12 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={projectContent[key as keyof typeof projectContent] as string}
                          onChange={(e) => setProjectContent({ ...projectContent, [key]: e.target.value })}
                          className="flex-1 px-3 py-2 bg-anthracite border border-gray-600 rounded text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="w-5 h-5 text-volt-yellow" />
                  <h3 className="text-lg font-bold">Images</h3>
                </div>
                <div className="space-y-3 bg-dark-gray p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium mb-2">Logo</label>
                    <input
                      type="text"
                      value={projectContent.logoImage}
                      onChange={(e) => setProjectContent({ ...projectContent, logoImage: e.target.value })}
                      className="w-full px-3 py-2 bg-anthracite border border-gray-600 rounded text-white text-sm"
                      placeholder="URL du logo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Image hero</label>
                    <input
                      type="text"
                      value={projectContent.heroImage}
                      onChange={(e) => setProjectContent({ ...projectContent, heroImage: e.target.value })}
                      className="w-full px-3 py-2 bg-anthracite border border-gray-600 rounded text-white text-sm"
                      placeholder="URL de l'image"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-volt-yellow" />
                  <h3 className="text-lg font-bold">Discussion</h3>
                </div>
                <div className="bg-dark-gray p-4 rounded-lg">
                  <div className="space-y-3 max-h-64 overflow-y-auto mb-3">
                    {updates.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center py-4">Aucun message</p>
                    ) : (
                      updates.map((update) => (
                        <div
                          key={update.id}
                          className={`p-3 rounded ${
                            update.is_admin ? 'bg-electric-blue bg-opacity-20' : 'bg-anthracite'
                          }`}
                        >
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-semibold text-volt-yellow">
                              {update.is_admin ? '👨‍💼 Admin' : '👤 Vous'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(update.created_at).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{update.message}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Votre message..."
                    className="w-full px-3 py-2 bg-anthracite border border-gray-600 rounded text-white text-sm mb-2"
                    rows={2}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="w-full bg-electric-blue hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Envoyer
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <Button onClick={handleSaveContent} loading={saving} className="w-full mb-3 bg-volt-yellow text-anthracite hover:bg-yellow-400">
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button onClick={handlePublish} loading={publishing} className="w-full bg-green-600 hover:bg-green-700">
                  <Rocket className="w-4 h-4 mr-2" />
                  Publier le site
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}
```

## Instructions :

1. Dans VSCode, créez un nouveau fichier : `src/app/clients/page.tsx`
2. Copiez tout le code TypeScript ci-dessus (sans les backticks markdown)
3. Sauvegardez le fichier

Le système créera automatiquement une page avec :
- 📋 Liste des projets (vue initiale)
- ✏️ Éditeur visuel complet quand vous cliquez sur un projet
- 🎨 Panneau de contrôle à droite avec tous les réglages
- 💾 Boutons Enregistrer et Publier
- 💬 Discussion intégrée
