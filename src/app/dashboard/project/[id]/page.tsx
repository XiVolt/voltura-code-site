'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ClientLayout from '@/components/ClientLayout'
import {
  ArrowLeft, Send, Calendar,
  TrendingUp, ExternalLink, Package
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Link from 'next/link'

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

interface ChatMessage {
  id: string
  project_id: string
  sender_id: string
  message: string
  is_admin: boolean
  is_read: boolean
  created_at: string
  profiles?: {
    full_name: string | null
    email: string
    avatar_url: string | null
  }
}

const STATUS_CONFIG = {
  en_attente: { label: 'En attente', color: 'text-yellow-600 bg-yellow-50' },
  en_cours: { label: 'En cours', color: 'text-blue-600 bg-blue-50' },
  en_revision: { label: 'En révision', color: 'text-purple-600 bg-purple-50' },
  termine: { label: 'Terminé', color: 'text-green-600 bg-green-50' },
  annule: { label: 'Annulé', color: 'text-red-600 bg-red-50' }
}

export default function ProjectChatPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [project, setProject] = useState<Project | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  const loadProject = useCallback(async (userId: string) => {
    setLoading(true)

    const { data: projectData, error } = await supabase
      .from('projects' as any)
      .select('*')
      .eq('id', projectId)
      .single()

    if (error || !projectData) {
      alert('Projet introuvable')
      router.push('/clients')
      return
    }

    const projData = projectData as any

    // Vérifier que l'utilisateur a accès à ce projet
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (projData.client_id !== userId && userProfile?.role !== 'admin') {
      alert('Accès non autorisé')
      router.push('/clients')
      return
    }

    setProject(projData)
    setLoading(false)
  }, [projectId, router])

  const loadMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from('project_chats' as any)
      .select(`
        *,
        profiles:sender_id (
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setMessages((data as any) || [])
    }
  }, [projectId])

  const markMessagesAsRead = useCallback(async (userId: string) => {
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    const isAdmin = userProfile?.role === 'admin'

    // Marquer les messages de l'autre partie comme lus
    await supabase
      .from('project_chats' as any)
      .update({ is_read: true })
      .eq('project_id', projectId)
      .eq('is_admin', !isAdmin)
      .eq('is_read', false)
  }, [projectId])

  const checkUserAndLoadProject = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login')
      return
    }

    setUser(session.user)

    // Charger le profil de l'utilisateur
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    setProfile(profileData)

    await loadProject(session.user.id)
    await loadMessages()
    await markMessagesAsRead(session.user.id)
  }, [projectId, router, loadProject, loadMessages, markMessagesAsRead])

  useEffect(() => {
    checkUserAndLoadProject()
  }, [checkUserAndLoadProject])

  useEffect(() => {
    if (projectId && user) {
      // S'abonner aux nouveaux messages en temps réel
      const channel = supabase
        .channel(`project-chat-${projectId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'project_chats',
            filter: `project_id=eq.${projectId}`
          },
          async (payload) => {
            // Charger le profil de l'expéditeur
            const { data: senderProfile } = await supabase
              .from('profiles')
              .select('full_name, email, avatar_url')
              .eq('id', (payload.new as any).sender_id)
              .single()

            const newMsg = {
              ...(payload.new as any),
              profiles: senderProfile
            }

            setMessages(prev => [...prev, newMsg])
            scrollToBottom()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [projectId, user])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !user || !project) return

    setSending(true)

    const isAdmin = profile?.role === 'admin'

    const { error } = await supabase
      .from('project_chats' as any)
      .insert([{
        project_id: project.id,
        sender_id: user.id,
        message: newMessage.trim(),
        is_admin: isAdmin,
        is_read: false
      }])

    if (!error) {
      setNewMessage('')
      await markMessagesAsRead(user.id)
    } else {
      alert('Erreur lors de l\'envoi du message')
    }

    setSending(false)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return 'Hier ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    } else if (days < 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'short', hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
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

  if (!project) {
    return null
  }

  const statusConfig = STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.en_cours

  return (
    <ClientLayout>
      <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/clients">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Mes projets
                  </Button>
                </Link>
                <div className="border-l pl-4">
                  <h1 className="font-bold text-xl text-anthracite">{project.title}</h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusConfig.color} font-medium`}>
                      {statusConfig.label}
                    </span>
                    <span className="text-sm text-gray-600">
                      Progression : {project.progress}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {project.demo_url && (
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Voir la démo
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 overflow-hidden flex">
          {/* Sidebar - Informations du projet */}
          <div className="hidden lg:block w-80 bg-white border-r overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4 text-anthracite">Informations du projet</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 font-medium">Description</label>
                  <p className="mt-1 text-sm text-anthracite">{project.description || 'Aucune description'}</p>
                </div>

                {project.deadline && (
                  <div>
                    <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Échéance
                    </label>
                    <p className="mt-1 text-sm text-anthracite">
                      {new Date(project.deadline).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Progression
                  </label>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-electric-blue">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-electric-blue to-blue-600 rounded-full h-2 transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {project.notes && (
                  <div>
                    <label className="text-sm text-gray-600 font-medium">Notes</label>
                    <p className="mt-1 text-sm text-anthracite whitespace-pre-wrap">{project.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Zone de chat */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun message pour le moment</p>
                  <p className="text-sm text-gray-500 mt-2">Envoyez un message pour démarrer la conversation</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwnMessage = msg.sender_id === user.id
                  const senderName = msg.profiles?.full_name || msg.profiles?.email || 'Utilisateur'

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                        {!isOwnMessage && (
                          <div className="flex items-center gap-2 mb-1 px-1">
                            <span className="text-xs font-medium text-gray-700">
                              {msg.is_admin ? '👨‍💼 ' : ''}{senderName}
                            </span>
                          </div>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            isOwnMessage
                              ? 'bg-electric-blue text-white'
                              : 'bg-white border border-gray-200 text-anthracite'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                        </div>
                        <div className={`text-xs text-gray-500 mt-1 px-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                          {formatTime(msg.created_at)}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <div className="bg-white border-t p-4">
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Écrivez votre message..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                      rows={3}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage(e)
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    loading={sending}
                    className="h-12 px-6"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Appuyez sur Entrée pour envoyer, Shift + Entrée pour un saut de ligne</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}

