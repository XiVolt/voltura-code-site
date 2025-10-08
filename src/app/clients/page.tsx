'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ClientLayout from '@/components/ClientLayout'
import { Package, Clock, CheckCircle, AlertCircle, ExternalLink, Code, MessageSquare, Send } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Link from 'next/link'

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
}

interface ProjectUpdate {
  id: string
  message: string
  created_at: string
  is_admin: boolean
}

export default function ClientsPage() {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [updates, setUpdates] = useState<ProjectUpdate[]>([])
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState<any>(null)
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
      .order('created_at', { ascending: false })

    setUpdates((data as any) || [])
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    loadProjectUpdates(project.id)
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

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string; icon: any }> = {
      en_attente: { label: 'En attente', className: 'bg-gray-100 text-gray-800', icon: Clock },
      en_cours: { label: 'En cours', className: 'bg-blue-100 text-blue-800', icon: Package },
      en_revision: { label: 'En révision', className: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      termine: { label: 'Terminé', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      annule: { label: 'Annulé', className: 'bg-red-100 text-red-800', icon: AlertCircle }
    }

    const badge = badges[status] || badges.en_attente
    const Icon = badge.icon

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.className}`}>
        <Icon size={14} />
        {badge.label}
      </span>
    )
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

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-anthracite mb-2">Mes Projets</h1>
            <p className="text-gray-600">Suivez l'avancement de vos projets et communiquez avec l'équipe</p>
          </div>

          {projects.length === 0 ? (
            <Card className="text-center py-16">
              <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Aucun projet en cours</h2>
              <p className="text-gray-600 mb-6">Vous n'avez pas encore de projet actif</p>
              <Link href="/contact">
                <Button>Démarrer un projet</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      {getStatusBadge(project.status)}
                    </div>
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

                  {project.deadline && (
                    <p className="text-sm text-gray-600 mb-4">
                       Échéance: {new Date(project.deadline).toLocaleDateString('fr-FR')}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/dashboard/project/${project.id}`} className="w-full">
                      <Button variant="primary" size="sm" className="w-full justify-center">
                        <Code size={16} className="mr-1" />
                        Éditer
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleProjectClick(project)}
                      className="w-full justify-center"
                    >
                      <MessageSquare size={16} className="mr-1" />
                      Détails
                    </Button>
                  </div>

                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2"
                    >
                      <Button variant="ghost" size="sm" className="w-full justify-center">
                        <ExternalLink size={16} className="mr-1" />
                        Voir le site
                      </Button>
                    </a>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  )
}
