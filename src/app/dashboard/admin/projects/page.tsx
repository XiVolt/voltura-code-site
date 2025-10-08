'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/AdminLayout'
import { Package, Plus, Edit, Trash2, User } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

interface Project {
  id: string
  client_id: string
  title: string
  description: string
  status: string
  budget: number
  deadline: string
  progress: number
  repository_url: string
  demo_url: string
  notes: string
  profiles?: {
    email: string
    full_name: string
  }
}

interface Client {
  id: string
  email: string
  full_name: string | null
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    client_id: '',
    title: '',
    description: '',
    status: 'en_attente',
    budget: 0,
    deadline: '',
    progress: 0,
    repository_url: '',
    demo_url: '',
    notes: ''
  })

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      router.push('/dashboard')
      return
    }

    loadData()
  }

  const loadData = async () => {
    setLoading(true)
    
    // Charger les projets avec les infos clients
    const { data: projectsData } = await supabase
      .from('projects' as any)
      .select(`
        *,
        profiles:client_id (email, full_name)
      `)
      .order('created_at', { ascending: false })

    // Charger les clients (utilisateurs non-admin)
    const { data: clientsData } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('role', 'user')

    setProjects((projectsData as any) || [])
    setClients(clientsData || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingProject) {
      // Modifier
      const { error } = await supabase
        .from('projects' as any)
        .update(formData)
        .eq('id', editingProject.id)

      if (error) {
        alert('Erreur lors de la modification')
        return
      }
    } else {
      // Créer
      const { error } = await supabase
        .from('projects' as any)
        .insert([formData])

      if (error) {
        alert('Erreur lors de la création')
        return
      }
    }

    setShowModal(false)
    setEditingProject(null)
    resetForm()
    loadData()
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      client_id: project.client_id,
      title: project.title,
      description: project.description,
      status: project.status,
      budget: project.budget,
      deadline: project.deadline,
      progress: project.progress,
      repository_url: project.repository_url,
      demo_url: project.demo_url,
      notes: project.notes
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce projet ?')) return

    const { error } = await supabase
      .from('projects' as any)
      .delete()
      .eq('id', id)

    if (error) {
      alert('Erreur lors de la suppression')
    } else {
      loadData()
    }
  }

  const resetForm = () => {
    setFormData({
      client_id: '',
      title: '',
      description: '',
      status: 'en_attente',
      budget: 0,
      deadline: '',
      progress: 0,
      repository_url: '',
      demo_url: '',
      notes: ''
    })
  }

  const openNewModal = () => {
    resetForm()
    setEditingProject(null)
    setShowModal(true)
  }

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
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Projets</h1>
        <Button onClick={openNewModal} className="flex items-center gap-2">
          <Plus size={18} />
          Nouveau Projet
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <User size={14} />
                  {project.profiles?.email || 'Client inconnu'}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(project)} className="text-blue-600 hover:text-blue-800">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(project.id)} className="text-red-600 hover:text-red-800">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <p className="text-gray-700 mb-3 line-clamp-2">{project.description}</p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-semibold">Statut:</span> {project.status}
              </div>
              <div>
                <span className="font-semibold">Progression:</span> {project.progress}%
              </div>
              <div>
                <span className="font-semibold">Budget:</span> {project.budget}€
              </div>
              <div>
                <span className="font-semibold">Échéance:</span> {project.deadline ? new Date(project.deadline).toLocaleDateString('fr-FR') : 'N/A'}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Aucun projet</h2>
          <p className="text-gray-600 mb-4">Créez votre premier projet client</p>
          <Button onClick={openNewModal}>Créer un projet</Button>
        </Card>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">
                {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block font-semibold mb-1">Client *</label>
                <select
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.email} {client.full_name ? `(${client.full_name})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Titre *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="en_attente">En attente</option>
                    <option value="en_cours">En cours</option>
                    <option value="en_revision">En révision</option>
                    <option value="termine">Terminé</option>
                    <option value="annule">Annulé</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Progression (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Budget (€)</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Échéance</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">URL Démo</label>
                <input
                  type="url"
                  value={formData.demo_url}
                  onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="https://"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">URL Repository</label>
                <input
                  type="url"
                  value={formData.repository_url}
                  onChange={(e) => setFormData({ ...formData, repository_url: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="https://"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Notes internes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows={2}
                  placeholder="Notes visibles par le client"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingProject ? 'Modifier' : 'Créer'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false)
                    setEditingProject(null)
                    resetForm()
                  }}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
