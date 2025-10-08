'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ClientLayout from '@/components/ClientLayout'
import { ArrowLeft, Save, Eye, EyeOff, MessageSquare, Send, ExternalLink, Code2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Link from 'next/link'
import EditableText from '@/components/editor/EditableText'
import EditableColor from '@/components/editor/EditableColor'
import EditableImage from '@/components/editor/EditableImage'

interface Project {
  id: string
  client_id: string
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
  profiles?: {
    full_name: string | null
    email: string
  }
}

export default function ProjectEditorPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [project, setProject] = useState<Project | null>(null)
  const [updates, setUpdates] = useState<ProjectUpdate[]>([])
  const [editMode, setEditMode] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState<any>(null)

  // Données éditables du projet (contenu visuel)
  const [projectContent, setProjectContent] = useState({
    title: 'Mon Projet',
    subtitle: 'Description courte',
    primaryColor: '#00A6ED',
    accentColor: '#F7D500',
    heroImage: '/images/hero.jpg',
    sections: [] as any[]
  })

  useEffect(() => {
    checkUserAndLoadProject()
  }, [projectId])

  const checkUserAndLoadProject = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    setUser(user)
    await loadProject(user.id)
    await loadUpdates()
  }

  const loadProject = async (userId: string) => {
    setLoading(true)
    
    const { data: projectData, error } = await supabase
      .from('projects' as any)
      .select('*')
      .eq('id', projectId)
      .single()

    if (error || !projectData) {
      alert('Projet introuvable')
      router.push('/dashboard')
      return
    }

    const projData = projectData as any

    // Vérifier que l'utilisateur a accès à ce projet
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (projData.client_id !== userId && profile?.role !== 'admin') {
      alert('Accès refusé')
      router.push('/dashboard')
      return
    }

    setProject(projData)

    // Charger le contenu éditable depuis project_data ou utiliser les valeurs par défaut
    if (projData.project_data) {
      setProjectContent(projData.project_data)
    } else {
      setProjectContent({
        title: projData.title,
        subtitle: projData.description,
        primaryColor: '#00A6ED',
        accentColor: '#F7D500',
        heroImage: '/images/hero.jpg',
        sections: []
      })
    }

    setLoading(false)
  }

  const loadUpdates = async () => {
    const { data } = await supabase
      .from('project_updates' as any)
      .select(`
        *,
        profiles:user_id (full_name, email)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    setUpdates((data as any) || [])
  }

  const handleSaveContent = async () => {
    if (!project) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('projects' as any)
        .update({
          project_data: projectContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)

      if (!error) {
        alert('✅ Modifications enregistrées !')
      } else {
        alert('Erreur lors de la sauvegarde')
      }
    } catch (err) {
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    const { error } = await supabase
      .from('project_updates' as any)
      .insert([{
        project_id: projectId,
        user_id: user.id,
        message: newComment,
        is_admin: false
      }])

    if (!error) {
      setNewComment('')
      loadUpdates()
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

  if (!project) return null

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header avec contrôles */}
        <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl font-bold">{project.title}</h1>
                  <p className="text-sm text-gray-600">Éditeur de contenu</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant={editMode ? 'primary' : 'outline'}
                  onClick={() => setEditMode(!editMode)}
                  size="sm"
                >
                  {editMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {editMode ? 'Aperçu' : 'Éditer'}
                </Button>

                {editMode && (
                  <Button
                    onClick={handleSaveContent}
                    loading={saving}
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </Button>
                )}

                {project.demo_url && (
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Voir le site
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Colonne principale - Prévisualisation */}
            <div className="lg:col-span-2">
              <Card>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Code2 className="w-5 h-5 text-electric-blue" />
                    <h2 className="text-2xl font-bold">Contenu du Projet</h2>
                  </div>
                  <p className="text-gray-600">
                    {editMode ? '✏️ Mode édition activé - Cliquez sur les éléments pour les modifier' : '👁️ Mode aperçu'}
                  </p>
                </div>

                {/* Section Hero */}
                <div 
                  className="mb-8 p-8 rounded-lg"
                  style={{ 
                    backgroundColor: projectContent.primaryColor + '10',
                    borderLeft: `4px solid ${projectContent.primaryColor}`
                  }}
                >
                  <EditableText
                    value={projectContent.title}
                    onChange={(val) => setProjectContent({ ...projectContent, title: val })}
                    className="text-4xl font-bold mb-3"
                    isEditMode={editMode}
                  />
                  
                  <EditableText
                    value={projectContent.subtitle}
                    onChange={(val) => setProjectContent({ ...projectContent, subtitle: val })}
                    className="text-xl text-gray-700"
                    isEditMode={editMode}
                  />
                </div>

                {/* Couleurs du thème */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Couleurs du thème</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Couleur principale</label>
                      <EditableColor
                        value={projectContent.primaryColor}
                        onChange={(val) => setProjectContent({ ...projectContent, primaryColor: val })}
                        isEditMode={editMode}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Couleur d'accent</label>
                      <EditableColor
                        value={projectContent.accentColor}
                        onChange={(val) => setProjectContent({ ...projectContent, accentColor: val })}
                        isEditMode={editMode}
                      />
                    </div>
                  </div>
                </div>

                {/* Image principale */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Image hero</h3>
                  <EditableImage
                    value={projectContent.heroImage}
                    onChange={(val) => setProjectContent({ ...projectContent, heroImage: val })}
                    isEditMode={editMode}
                    alt="Hero du projet"
                  />
                </div>

                {/* Informations du projet */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4">Détails du projet</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Statut:</span> {project.status}
                    </div>
                    <div>
                      <span className="font-semibold">Progression:</span> {project.progress}%
                    </div>
                    {project.deadline && (
                      <div>
                        <span className="font-semibold">Échéance:</span>{' '}
                        {new Date(project.deadline).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                    {project.repository_url && (
                      <div>
                        <a
                          href={project.repository_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-electric-blue hover:underline flex items-center gap-1"
                        >
                          <Code2 className="w-4 h-4" />
                          Code source
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {project.notes && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">📝 Notes de l'équipe</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{project.notes}</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Colonne Discussion */}
            <div>
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-electric-blue" />
                  <h3 className="text-xl font-bold">Discussion</h3>
                </div>

                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                  {updates.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 text-sm">
                      Aucun message pour le moment
                    </p>
                  ) : (
                    updates.map((update) => (
                      <div
                        key={update.id}
                        className={`p-3 rounded-lg ${
                          update.is_admin ? 'bg-blue-50 border-l-4 border-electric-blue' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className="font-semibold text-sm">
                            {update.is_admin ? '👨‍💼 Admin' : '👤 Vous'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(update.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{update.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t pt-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="w-full border rounded-lg px-3 py-2 text-sm mb-2"
                    rows={3}
                  />
                  <Button
                    onClick={handleAddComment}
                    size="sm"
                    className="w-full"
                    disabled={!newComment.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}
