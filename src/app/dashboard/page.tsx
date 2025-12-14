'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Mail, Settings, MessageSquare, Package, Users, BarChart3, Shield, Edit, Save, X, ExternalLink, Code, DollarSign } from 'lucide-react'
import { supabase, getCurrentUser } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import ClientLayout from '@/components/ClientLayout'
import type { Profile, Message } from '@/types/supabase'

interface Project {
  id: string
  title: string
  description: string
  status: string
  progress: number
  deadline: string
  demo_url: string
}

const DashboardPage = () => {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: ''
  })
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const initialize = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/auth/login')
          return
        }
        
        const currentUser = session.user
        setUser(currentUser)
        
        // Get user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()
        
        if (profileData) {
          setProfile(profileData)
          setFormData({
            full_name: profileData.full_name || '',
            email: profileData.email || ''
          })
        }
        
        // Get user messages
        const { data: messagesData } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`)
          .order('created_at', { ascending: false })
          .limit(5)
        
        if (messagesData) {
          setMessages(messagesData)
        }

        // Get user projects
        if (profileData?.role !== 'admin') {
          const { data: projectsData } = await supabase
            .from('projects' as any)
            .select('*')
            .eq('client_id', currentUser.id)
            .order('created_at', { ascending: false })
          
          setProjects((projectsData as any) || [])

          // Get user invoices
          const { data: invoicesData } = await supabase
            .from('invoices' as any)
            .select('*')
            .eq('client_id', currentUser.id)
            .order('created_at', { ascending: false })

          setInvoices((invoicesData as any) || [])
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error)
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [router])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          email: formData.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id)
      
      if (!error) {
        setProfile(prev => prev ? {
          ...prev,
          full_name: formData.full_name,
          email: formData.email,
          updated_at: new Date().toISOString()
        } : null)
        setEditMode(false)
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    } finally {
      setSaving(false)
    }
  }

  const stats = [
    {
      name: 'Messages',
      value: messages.length,
      icon: MessageSquare,
      color: 'text-electric-blue',
      bgColor: 'bg-electric-blue/10',
      link: '/dashboard/messages'
    },
    {
      name: 'Projets',
      value: projects.length,
      icon: Package,
      color: 'text-volt-yellow',
      bgColor: 'bg-yellow-100',
      link: profile?.role === 'admin' ? '/dashboard/admin/projects' : null
    },
    {
      name: profile?.role === 'admin' ? 'Utilisateurs' : 'Factures',
      value: profile?.role === 'admin' ? 0 : invoices.length,
      icon: profile?.role === 'admin' ? Users : DollarSign,
      color: profile?.role === 'admin' ? 'text-green-600' : 'text-green-600',
      bgColor: profile?.role === 'admin' ? 'bg-green-100' : 'bg-green-100',
      link: profile?.role === 'admin' ? '/dashboard/admin/users' : '/dashboard/clients/invoices'
    },
  ]

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      en_attente: 'En attente',
      en_cours: 'En cours',
      en_revision: 'En révision',
      termine: 'Terminé',
      annule: 'Annulé'
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      en_attente: 'bg-gray-100 text-gray-800',
      en_cours: 'bg-blue-100 text-blue-800',
      en_revision: 'bg-yellow-100 text-yellow-800',
      termine: 'bg-green-100 text-green-800',
      annule: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <ClientLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-electric-blue"></div>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      <div className="min-h-screen bg-light-gray">
        {/* Header */}
        <div className="bg-gradient-to-r from-anthracite to-dark-gray text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-electric-blue to-volt-yellow rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">
                  Bonjour, {profile?.full_name || user?.email}
                </h1>
                <p className="text-gray-300">
                  Bienvenue dans votre espace personnel Voltura Code
                </p>
              </div>
              {profile?.role === 'admin' && (
                <div className="ml-auto">
                  <div className="flex items-center space-x-2 bg-volt-yellow text-anthracite px-3 py-1 rounded-full text-sm font-medium">
                    <Shield className="w-4 h-4" />
                    <span>Administrateur</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Stats & Projects */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                {stats.map((stat) => {
                  const Icon = stat.icon
                  const StatCard = (
                    <Card key={stat.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                          <p className="text-2xl font-semibold text-anthracite">{stat.value}</p>
                        </div>
                      </div>
                    </Card>
                  )

                  return stat.link ? (
                    <Link key={stat.name} href={stat.link}>
                      {StatCard}
                    </Link>
                  ) : (
                    StatCard
                  )
                })}
              </div>

              {/* Projects Section - Only for Clients */}
              {profile?.role !== 'admin' && (
                <Card>
                  <h2 className="text-xl font-semibold text-anthracite mb-6">Mes Projets</h2>
                  {projects.length > 0 ? (
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{project.title}</h3>
                              <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                              {getStatusLabel(project.status)}
                            </span>
                          </div>

                          <div className="mb-3">
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
                            <p className="text-sm text-gray-600 mb-3">
                              📅 Échéance: {new Date(project.deadline).toLocaleDateString('fr-FR')}
                            </p>
                          )}

                          <div className="flex gap-2">
                            <Link href={`/dashboard/project/${project.id}`} className="flex-1">
                              <Button variant="primary" className="w-full justify-center">
                                <Code className="w-4 h-4 mr-2" />
                                Éditer mon projet
                              </Button>
                            </Link>
                            {project.demo_url && (
                              <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline">
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-16 h-16 mx-auto mb-3 text-gray-400" />
                      <p>Aucun projet en cours</p>
                      <p className="text-sm mt-2">Contactez-nous pour démarrer un projet</p>
                    </div>
                  )}
                </Card>
              )}

              {/* Profile Section */}
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-anthracite">Profil</h2>
                  {!editMode ? (
                    <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditMode(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                      <Button size="sm" loading={saving} onClick={handleSaveProfile}>
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </Button>
                    </div>
                  )}
                </div>

                {editMode ? (
                  <div className="space-y-4">
                    <Input
                      label="Nom complet"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Nom complet</label>
                      <p className="text-anthracite">{profile?.full_name || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                      <p className="text-anthracite">{profile?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Rôle</label>
                      <p className="text-anthracite capitalize">{profile?.role}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Membre depuis</label>
                      <p className="text-anthracite">
                        {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                      </p>
                    </div>
                  </div>
                )}
              </Card>

              {/* Admin Panel */}
              {profile?.role === 'admin' && (
                <Card>
                  <h2 className="text-xl font-semibold text-anthracite mb-4">Administration</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Link href="/dashboard/admin/users">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Gestion utilisateurs
                      </Button>
                    </Link>
                    <Link href="/dashboard/admin/projects">
                      <Button variant="outline" className="w-full justify-start">
                        <Package className="w-4 h-4 mr-2" />
                        Gestion projets
                      </Button>
                    </Link>
                    <Link href="/dashboard/admin/messages">
                      <Button variant="outline" className="w-full justify-start">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Messages
                      </Button>
                    </Link>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Quick Actions & Messages */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <Card>
                <h2 className="text-xl font-semibold text-anthracite mb-4">Actions rapides</h2>
                <div className="space-y-3">
                  <Link href="/contact">
                    <Button variant="primary" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Nouveau message
                    </Button>
                  </Link>
                  <Link href="/prestations">
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="w-4 h-4 mr-2" />
                      Voir les services
                    </Button>
                  </Link>
                  <Link href="/dashboard/messages">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Mes messages
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Recent Messages */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-anthracite">Messages récents</h2>
                  <Link href="/dashboard/messages" className="text-electric-blue hover:text-blue-700 text-sm">
                    Voir tous
                  </Link>
                </div>
                {messages.length > 0 ? (
                  <div className="space-y-3">
                    {messages.slice(0, 3).map((message) => (
                      <div key={message.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-sm text-anthracite mb-1">{message.subject}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(message.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Aucun message</p>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}

export default DashboardPage