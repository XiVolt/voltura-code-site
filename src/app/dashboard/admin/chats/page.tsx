'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/AdminLayout'
import {
  MessageSquare, Users, Package, Clock, TrendingUp,
  Search, ChevronRight
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

interface ProjectWithChat {
  id: string
  title: string
  description: string
  status: string
  progress: number
  client_id: string
  created_at: string
  profiles?: {
    full_name: string | null
    email: string
  }
  unread_count: number
  last_message?: string
  last_message_time?: string
}

const STATUS_CONFIG = {
  en_attente: { label: 'En attente', color: 'bg-yellow-500' },
  en_cours: { label: 'En cours', color: 'bg-blue-500' },
  en_revision: { label: 'En révision', color: 'bg-purple-500' },
  termine: { label: 'Terminé', color: 'bg-green-500' },
  annule: { label: 'Annulé', color: 'bg-red-500' }
}

export default function AdminChatsPage() {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<ProjectWithChat[]>([])
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithChat[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const router = useRouter()

  const filterProjects = useCallback(() => {
    let filtered = projects

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter)
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, statusFilter])

  const loadProjects = useCallback(async () => {
    setLoading(true)

    console.log('🔍 [CHATS] Chargement des projets...')

    // Charger TOUS les projets (sans jointure)
    const { data: projectsData, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Erreur chargement projets:', error)
      alert(`Erreur: ${error.message}`)
      setLoading(false)
      return
    }

    if (!projectsData || projectsData.length === 0) {
      console.warn('⚠️ Aucun projet retourné')
      setProjects([])
      setLoading(false)
      return
    }

    console.log('✅ Projets chargés:', projectsData.length)

    // Pour chaque projet, charger les infos du client et les messages
    const projectsWithChats = await Promise.all(
      projectsData.map(async (project: any) => {
        // Charger le profil du client
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', project.client_id)
          .single()

        // Compter les messages non lus du client
        const { count: unreadCount } = await supabase
          .from('project_chats')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', project.id)
          .eq('is_admin', false)
          .eq('is_read', false)

        // Récupérer le dernier message
        const { data: lastMessageData } = await supabase
          .from('project_chats')
          .select('message, created_at')
          .eq('project_id', project.id)
          .order('created_at', { ascending: false })
          .limit(1)

        const lastMessage = lastMessageData && lastMessageData.length > 0 ? lastMessageData[0] : null

        return {
          ...project,
          profiles: profile,
          unread_count: unreadCount || 0,
          last_message: lastMessage?.message,
          last_message_time: lastMessage?.created_at
        }
      })
    )

    console.log('✅ Projets avec chats préparés:', projectsWithChats.length)

    // Trier par messages non lus puis par date du dernier message
    projectsWithChats.sort((a, b) => {
      if (a.unread_count !== b.unread_count) {
        return b.unread_count - a.unread_count
      }
      if (a.last_message_time && b.last_message_time) {
        return new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime()
      }
      return 0
    })

    setProjects(projectsWithChats)
    setLoading(false)
  }, [])

  useEffect(() => {
    const checkUserAndLoadProjects = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      await loadProjects()
    }

    checkUserAndLoadProjects()
  }, [router, loadProjects])

  useEffect(() => {
    filterProjects()
  }, [filterProjects])

  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return ''

    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `Il y a ${minutes} min`
    } else if (hours < 24) {
      return `Il y a ${hours}h`
    } else if (days === 1) {
      return 'Hier'
    } else if (days < 7) {
      return `Il y a ${days}j`
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    }
  }

  const totalUnread = projects.reduce((sum, p) => sum + p.unread_count, 0)
  const activeChats = projects.filter(p => p.last_message).length

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-anthracite mb-2">Chats Clients</h1>
            <p className="text-gray-600">Gérez toutes les conversations avec vos clients</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Projets actifs</p>
                  <p className="text-3xl font-bold text-anthracite">{projects.length}</p>
                </div>
                <Package className="w-12 h-12 text-electric-blue opacity-20" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Conversations actives</p>
                  <p className="text-3xl font-bold text-anthracite">{activeChats}</p>
                </div>
                <MessageSquare className="w-12 h-12 text-electric-blue opacity-20" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-electric-blue to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100 mb-1">Messages non lus</p>
                  <p className="text-3xl font-bold">{totalUnread}</p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </div>

          {/* Filtres */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Rechercher par client ou projet..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="md:w-64">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="en_attente">En attente</option>
                  <option value="en_cours">En cours</option>
                  <option value="en_revision">En révision</option>
                  <option value="termine">Terminé</option>
                  <option value="annule">Annulé</option>
                </select>
              </div>
            </div>
          </div>

          {/* Liste des projets/chats */}
          {filteredProjects.length === 0 ? (
            <Card className="text-center py-16">
              <MessageSquare className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Aucune conversation</h2>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all'
                  ? 'Aucun résultat pour ces filtres'
                  : 'Aucune conversation avec les clients'}
              </p>
            </Card>
          ) : (
            <div className="bg-white rounded-lg shadow-sm divide-y">
              {filteredProjects.map((project) => {
                const statusConfig = STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG]
                const clientName = project.profiles?.full_name || project.profiles?.email || 'Client'

                return (
                  <Link
                    key={project.id}
                    href={`/dashboard/project/${project.id}`}
                    className="block hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-4 flex items-center gap-4">
                      {/* Avatar/Icône */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-electric-blue bg-opacity-10 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-electric-blue" />
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-anthracite truncate">{project.title}</h3>
                          <div className={`w-2 h-2 rounded-full ${statusConfig.color}`} title={statusConfig.label}></div>
                          {project.unread_count > 0 && (
                            <span className="bg-electric-blue text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              {project.unread_count}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{clientName}</p>
                        {project.last_message && (
                          <p className="text-sm text-gray-500 truncate">{project.last_message}</p>
                        )}
                      </div>

                      {/* Métadonnées */}
                      <div className="flex-shrink-0 text-right">
                        {project.last_message_time && (
                          <p className="text-xs text-gray-500 mb-2">{formatTime(project.last_message_time)}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <TrendingUp className="w-4 h-4" />
                          <span>{project.progress}%</span>
                        </div>
                      </div>

                      {/* Flèche */}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

