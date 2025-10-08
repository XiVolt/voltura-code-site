'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ClientLayout from '@/components/ClientLayout'
import { Package, Clock, CheckCircle, AlertCircle, ExternalLink, MessageSquare, FileText } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

interface Project {
  id: string
  title: string
  description: string
  status: 'en_attente' | 'en_cours' | 'en_revision' | 'termine' | 'annule'
  budget: number
  deadline: string
  progress: number
  repository_url: string
  demo_url: string
  notes: string
  created_at: string
}

interface ProjectUpdate {
  id: string
  content: string
  is_admin: boolean
  created_at: string
}

export default function ClientsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [updates, setUpdates] = useState<ProjectUpdate[]>([])
  const [newComment, setNewComment] = useState('')
  const router = useRouter()

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
      .from('projects')
      .select('*')
      .eq('client_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur:', error)
    } else {
      setProjects(data || [])
    }
    setLoading(false)
  }

  const loadProjectUpdates = async (projectId: string) => {
    const { data, error } = await supabase
      .from('project_updates')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Erreur:', error)
    } else {
      setUpdates(data || [])
    }
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    loadProjectUpdates(project.id)
  }

  const addComment = async () => {
    if (!newComment.trim() || !selectedProject) return

    const { error } = await supabase
      .from('project_updates')
      .insert({
        project_id: selectedProject.id,
        author_id: user.id,
        content: newComment,
        is_admin: false
      })

    if (error) {
      alert('Erreur lors de l envoi')
    } else {
      setNewComment('')
      loadProjectUpdates(selectedProject.id)
    }
  }

  const getStatusBadge = (status: string) => {
    const config: any = {
      en_attente: { label: 'En attente', color: 'bg-gray-500', icon: Clock },
      en_cours: { label: 'En cours', color: 'bg-blue-500', icon: Package },
      en_revision: { label: 'En révision', color: 'bg-yellow-500', icon: AlertCircle },
      termine: { label: 'Terminé', color: 'bg-green-500', icon: CheckCircle },
      annule: { label: 'Annulé', color: 'bg-red-500', icon: AlertCircle }
    }

    const cfg = config[status] || config.en_attente
    const Icon = cfg.icon

    return (
      <span className={`${cfg.color} text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit`}>
        <Icon size={14} />
        {cfg.label}
      </span>
    )
  }

  if (loading) {
    return (
      <ClientLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue"></div>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      <section className="py-20 bg-gradient-to-br from-anthracite to-dark-gray text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Mes Projets</h1>
          <p className="text-xl">Suivez l avancement de vos projets en temps réel</p>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {projects.length === 0 ? (
            <Card className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Aucun projet</h2>
              <p className="text-gray-600 mb-6">Vous n avez pas encore de projet.</p>
              <Button onClick={() => router.push('/contact')}>Démarrer un projet</Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card 
                  key={project.id} 
                  className="cursor-pointer hover:shadow-xl transition"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="mb-4">{getStatusBadge(project.status)}</div>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progression</span>
                      <span className="font-semibold text-electric-blue">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-electric-blue h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {project.deadline && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(project.deadline).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">{selectedProject.title}</h2>
                {getStatusBadge(selectedProject.status)}
              </div>
              <button 
                onClick={() => setSelectedProject(null)}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Description</h3>
                <p>{selectedProject.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {selectedProject.budget && (
                  <div>
                    <h4 className="font-semibold mb-1">Budget</h4>
                    <p className="text-2xl font-bold text-electric-blue">{selectedProject.budget}€</p>
                  </div>
                )}
                {selectedProject.deadline && (
                  <div>
                    <h4 className="font-semibold mb-1">Échéance</h4>
                    <p className="text-lg">{new Date(selectedProject.deadline).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
              </div>

              {(selectedProject.demo_url || selectedProject.repository_url) && (
                <div>
                  <h3 className="font-bold mb-2">Liens</h3>
                  <div className="flex gap-3">
                    {selectedProject.demo_url && (
                      <a href={selectedProject.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-electric-blue hover:underline">
                        <ExternalLink size={16} />
                        Démo
                      </a>
                    )}
                    {selectedProject.repository_url && (
                      <a href={selectedProject.repository_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-electric-blue hover:underline">
                        <FileText size={16} />
                        Repository
                      </a>
                    )}
                  </div>
                </div>
              )}

              {selectedProject.notes && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <h4 className="font-semibold text-yellow-800 mb-1">Notes</h4>
                  <p className="text-yellow-700">{selectedProject.notes}</p>
                </div>
              )}

              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <MessageSquare size={20} />
                  Discussion
                </h3>
                <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                  {updates.map((update) => (
                    <div 
                      key={update.id} 
                      className={`p-4 rounded-lg ${update.is_admin ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50 border-l-4 border-gray-300'}`}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold text-sm">
                          {update.is_admin ? ' Voltura Code' : ' Vous'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(update.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p>{update.content}</p>
                    </div>
                  ))}
                  {updates.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Aucun message</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addComment()}
                    placeholder="Laissez un commentaire..."
                    className="flex-1 border rounded-lg px-4 py-2"
                  />
                  <Button onClick={addComment}>Envoyer</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  )
}
