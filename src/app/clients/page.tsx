'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ClientLayout from '@/components/ClientLayout'
import {
  Package, MessageSquare, ExternalLink, Clock, CheckCircle,
  AlertCircle, Loader, Calendar, TrendingUp, ArrowRight
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

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
  created_at: string
}

const STATUS_CONFIG = {
  en_attente: { label: 'En attente', color: 'text-yellow-600 bg-yellow-50', icon: Clock },
  en_cours: { label: 'En cours', color: 'text-blue-600 bg-blue-50', icon: Loader },
  en_revision: { label: 'En révision', color: 'text-purple-600 bg-purple-50', icon: AlertCircle },
  termine: { label: 'Terminé', color: 'text-green-600 bg-green-50', icon: CheckCircle },
  annule: { label: 'Annulé', color: 'text-red-600 bg-red-50', icon: AlertCircle }
}

export default function ClientsPage() {
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      router.push('/auth/login')
      return
    }

    setUser(session.user)
    setAuthChecked(true)
    await loadProjects(session.user.id)
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

      // Charger le nombre de messages non lus pour chaque projet
      for (const project of data as any[]) {
        const { count } = await supabase
          .from('project_chats' as any)
          .select('*', { count: 'exact', head: true })
          .eq('project_id', project.id)
          .eq('is_admin', true)
          .eq('is_read', false)

        setUnreadCounts(prev => ({ ...prev, [project.id]: count || 0 }))
      }
    }

    setLoading(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Afficher le loading pendant la vérification de l'authentification
  if (!authChecked || loading) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue"></div>
        </div>
      </ClientLayout>
    )
  }

  // Si pas d'utilisateur après la vérification, ne rien afficher (redirection en cours)
  if (!user) {
    return null
  }

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-anthracite mb-2">Mes Projets</h1>
            <p className="text-gray-600">Suivez l'avancement de vos projets et communiquez avec notre équipe</p>
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
              {projects.map((project) => {
                const statusConfig = STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.en_cours
                const StatusIcon = statusConfig.icon
                const unreadCount = unreadCounts[project.id] || 0

                return (
                  <Card
                    key={project.id}
                    className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-anthracite flex-1">{project.title}</h3>
                        {unreadCount > 0 && (
                          <span className="bg-electric-blue text-white text-xs font-bold px-2 py-1 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{project.description}</p>

                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig.label}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          Progression
                        </span>
                        <span className="font-semibold text-electric-blue">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-electric-blue to-blue-600 rounded-full h-2.5 transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {project.deadline && (
                      <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Échéance : {formatDate(project.deadline)}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link href={`/dashboard/project/${project.id}`} className="flex-1">
                        <Button variant="primary" className="w-full">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Ouvrir le chat
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>

                      {project.demo_url && (
                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="h-full">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  )
}

