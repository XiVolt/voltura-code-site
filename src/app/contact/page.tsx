



'use client'

import React, { useState, useEffect } from 'react'
import { Mail, Phone, Clock, Send, CheckCircle } from 'lucide-react'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { validateEmail } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Card from '@/components/ui/Card'
import ClientLayout from '@/components/ClientLayout'



const ContactPage = () => {
  const [user, setUser] = useState<any>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    projectType: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const u = await getCurrentUser()
      setUser(u)
      setCheckingAuth(false)
    }
    fetchUser()
  }, [])

  const projectTypes = [
    { value: '', label: 'Sélectionnez un type de projet' },
    { value: 'web-app', label: 'Application Web' },
    { value: 'vitrine', label: 'Site Vitrine' },
    { value: 'lua-fivem', label: 'Développement Lua FiveM' },
    { value: 'maintenance', label: 'Maintenance / Support' },
    { value: 'other', label: 'Autre' }
  ]

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis'
    if (!formData.email) newErrors.email = "L'email est requis"
    else if (!validateEmail(formData.email)) newErrors.email = "Format d'email invalide"
    if (!formData.subject.trim()) newErrors.subject = 'Le sujet est requis'
    if (!formData.message.trim()) newErrors.message = 'Le message est requis'
    else if (formData.message.trim().length < 20) newErrors.message = 'Le message doit contenir au moins 20 caractères'
    return newErrors
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    setErrors({})
    try {
      // Récupérer l'ID de l'admin
      const { data: adminProfiles, error: adminError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin')
      // DEBUG : Affiche le résultat brut dans le bloc debug

      if (adminError || !adminProfiles || adminProfiles.length === 0) {
        setErrors({ general: "Impossible de trouver l'admin pour l'envoi du message." })
        setLoading(false)
        return
      }
      const adminId = String(adminProfiles[0].id)
      const payload = {
        sender_id: String(user?.id),
        receiver_id: adminId,
        subject: `[Contact] ${formData.subject}`,
        content: [
          `Nom: ${formData.name}`,
          `Email: ${formData.email}`,
          formData.company ? `Entreprise: ${formData.company}` : '',
          formData.projectType ? `Type de projet: ${projectTypes.find(t => t.value === formData.projectType)?.label}` : '',
          '',
          'Message:',
          formData.message
        ].filter(Boolean).join('\n').trim()
      }
      const { error } = await supabase
        .from('messages')
        .insert([payload])
      if (error) {
        setErrors({ general: "Erreur lors de l'envoi du message" })
      } else {
        setSuccess(true)
        setFormData({
          name: '',
          email: '',
          company: '',
          subject: '',
          message: '',
          projectType: ''
        })
      }
    } catch (error) {
      setErrors({ general: "Une erreur inattendue s'est produite" })
    } finally {
      setLoading(false)
    }
  }

  // ---

  // (rien ici)

  // ---

  // Affichage debug des profils admins trouvés (à retirer après debug)
  // À placer juste avant le return principal

// Fonction de debug à placer hors de handleSubmit
function AdminDebugBlock({ adminDebug }: { adminDebug: any[] }) {
  return (
    <div style={{ background: '#f0f0f0', color: '#333', padding: 12, margin: 12, border: '1px solid #ccc', borderRadius: 8 }}>
      <b>DEBUG profils admin trouvés :</b>
      <pre style={{ fontSize: 12, overflowX: 'auto' }}>{JSON.stringify(adminDebug, null, 2)}</pre>
    </div>
  )
}

  if (success) {
    return (
      <ClientLayout>
        <div className="min-h-screen bg-light-gray flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <Card className="max-w-md w-full text-center">
            <CheckCircle className="w-16 h-16 text-electric-blue mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-anthracite mb-4">Message envoyé !</h2>
            <p className="text-gray-600 mb-6">
              Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
            </p>
            <Button onClick={() => setSuccess(false)} className="w-full">
              Envoyer un autre message
            </Button>
          </Card>
        </div>
      </ClientLayout>
    )
  }

  if (checkingAuth) {
    return null // ou un loader si tu veux
  }

  if (!user) {
    return (
      <ClientLayout>
        <section className="min-h-screen flex items-center justify-center bg-light-gray px-4">
          <Card className="max-w-md w-full text-center py-16">
            <h2 className="text-2xl font-bold text-anthracite mb-4">Connectez-vous pour envoyer un message</h2>
            <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder au formulaire de contact.</p>
            <a href="/auth/login">
              <Button className="w-full">Se connecter</Button>
            </a>
          </Card>
        </section>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>

      {/* Hero Section modernisée avec SVG dynamique */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-br from-anthracite to-dark-gray text-white">
        <svg className="absolute left-1/2 top-0 -translate-x-1/2 -z-10 opacity-40" width="900" height="400" viewBox="0 0 900 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="450" cy="200" rx="400" ry="120" fill="#3B82F6" fillOpacity="0.25"/>
          <ellipse cx="600" cy="100" rx="180" ry="60" fill="#FACC15" fillOpacity="0.18"/>
        </svg>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
              Contactez-nous
            </h1>
            <p className="text-2xl text-gray-200 max-w-2xl mx-auto font-light">
              Un projet, une idée, une question&nbsp;?<br />
              On vous répond avec le sourire et un brin de fun&nbsp;!
            </p>
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-light-gray">
        {/* Blob décoratif */}
        <svg className="absolute -top-24 -left-32 w-96 h-96 opacity-30 -z-10" viewBox="0 0 400 400" fill="none"><ellipse cx="200" cy="200" rx="200" ry="120" fill="#FACC15"/></svg>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 items-stretch">
          {/* Contact Info modernisée, cards décalées */}
          <div className="flex flex-col gap-10 lg:w-1/2">
            <Card className="shadow-xl hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-md border-2 border-electric-blue -rotate-2">
              <div className="flex items-center gap-5">
                <Mail className="w-8 h-8 text-electric-blue animate-bounce" />
                <div>
                  <h3 className="font-bold text-anthracite text-lg">Email</h3>
                  <p className="text-gray-700 text-base">voltura<strong>code</strong>@gmail.com</p>
                  <p className="text-xs text-gray-500 mt-1">Réponse sous 24h</p>
                </div>
              </div>
            </Card>
            <Card className="shadow-xl hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-md border-2 border-volt-yellow rotate-2">
              <div className="flex items-center gap-5">
                <Phone className="w-8 h-8 text-volt-yellow animate-pulse" />
                <div>
                  <h3 className="font-bold text-anthracite text-lg">Téléphone</h3>
                  <p className="text-gray-700 text-base">+33 7 85 40 82 49</p>
                  <p className="text-xs text-gray-500 mt-1">Disponible 7j/7 (pas d'appel la semaine entre 8h et 18h)</p>
                </div>
              </div>
            </Card>
            <Card className="shadow-xl hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-md border-2 border-electric-blue -rotate-3">
              <div className="flex items-center gap-5">
                <Clock className="w-8 h-8 text-electric-blue animate-spin-slow" />
                <div>
                  <h3 className="font-bold text-anthracite text-lg">Disponibilité</h3>
                  <p className="text-gray-700 text-base">Toute la semaine (7j/7)</p>
                  <p className="text-xs text-gray-500 mt-1">Pas d'appel la semaine entre 8h et 18h</p>
                </div>
              </div>
            </Card>
          </div>
          {/* Contact Form modernisé */}
          <div className="flex-1 flex items-center">
            <Card className="w-full shadow-2xl border-2 border-anthracite bg-white/90 backdrop-blur-lg hover:shadow-electric-blue/30 transition-all duration-300">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold text-anthracite mb-2 tracking-tight">Décrivez votre projet ou besoin</h2>
                <p className="text-gray-600 text-base">
                  Voltura Code propose : <span className="font-semibold text-electric-blue">développement web</span>, <span className="font-semibold text-volt-yellow">site vitrine</span>, <span className="font-semibold text-electric-blue">scripts Lua FiveM</span>, <span className="font-semibold text-volt-yellow">maintenance/support</span>.<br />
                  Précisez votre demande pour une réponse rapide et adaptée !
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {errors.general}
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Nom complet *"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    error={errors.name}
                    placeholder="Votre nom"
                    required
                  />
                  <Input
                    label="Adresse email *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={errors.email}
                    placeholder="votre@email.com"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Entreprise"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder="Nom de votre entreprise"
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-anthracite">
                      Type de projet
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => handleChange('projectType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-electric-blue outline-none transition-colors"
                    >
                      {projectTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Input
                  label="Sujet *"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  error={errors.subject}
                  placeholder="Résumé de votre demande"
                  required
                />
                <Textarea
                  label="Message *"
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  error={errors.message}
                  placeholder="Décrivez votre projet, vos besoins, votre budget prévisionnel, vos délais..."
                  rows={6}
                  required
                />
                <Button
                  type="submit"
                  loading={loading}
                  size="lg"
                  className="w-full hover:scale-105 transition-transform duration-200"
                >
                  <Send className="w-5 h-5 mr-2 animate-bounce" />
                  Envoyer le message
                </Button>
              </form>
              <div className="mt-6 p-4 bg-electric-blue/10 rounded-lg">
                <p className="text-sm text-anthracite">
                  <strong>Réponse garantie sous 24h</strong> - On revient vers vous vite, promis&nbsp;!
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </ClientLayout>
  )
}

export default ContactPage
