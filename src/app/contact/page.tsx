'use client'

import React, { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { validateEmail } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Card from '@/components/ui/Card'
import ClientLayout from '@/components/ClientLayout'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    projectType: ''
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const projectTypes = [
    { value: '', label: 'Sélectionnez un type de projet' },
    { value: 'web-app', label: 'Application Web' },
    { value: 'business-app', label: 'Application Métier' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'api', label: 'API / Backend' },
    { value: 'maintenance', label: 'Maintenance / Support' },
    { value: 'consulting', label: 'Conseil / Audit' },
    { value: 'other', label: 'Autre' }
  ]

  const validate = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    }
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis'
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Le message doit contenir au moins 20 caractères'
    }
    
    return newErrors
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
      // Insert message into database
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: null, // Anonymous contact
            subject: `[Contact] ${formData.subject}`,
            content: `
Nom: ${formData.name}
Email: ${formData.email}
${formData.company ? `Entreprise: ${formData.company}` : ''}
${formData.projectType ? `Type de projet: ${projectTypes.find(t => t.value === formData.projectType)?.label}` : ''}

Message:
${formData.message}
            `.trim()
          }
        ])
      
      if (error) {
        setErrors({ general: 'Erreur lors de l\'envoi du message' })
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
      setErrors({ general: 'Une erreur inattendue s\'est produite' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
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

  return (
    <ClientLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-anthracite to-dark-gray text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Contactez-nous
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Vous avez un projet ? Une question ? N'hésitez pas à nous contacter. 
              Nous sommes là pour vous accompagner dans la réalisation de vos ambitions digitales.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <Card>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-electric-blue rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-anthracite mb-1">Email</h3>
                    <p className="text-gray-600">contact@voltura-code.com</p>
                    <p className="text-sm text-gray-500 mt-1">Réponse sous 24h</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-volt-yellow rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-anthracite" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-anthracite mb-1">Téléphone</h3>
                    <p className="text-gray-600">+33 (0)1 23 45 67 89</p>
                    <p className="text-sm text-gray-500 mt-1">Lun-Ven 9h-18h</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-electric-blue rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-anthracite mb-1">Localisation</h3>
                    <p className="text-gray-600">France</p>
                    <p className="text-sm text-gray-500 mt-1">Interventions à distance</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-volt-yellow rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-anthracite" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-anthracite mb-1">Disponibilité</h3>
                    <p className="text-gray-600">Lundi - Vendredi</p>
                    <p className="text-sm text-gray-500 mt-1">9h00 - 18h00</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-anthracite mb-2">
                    Décrivez votre projet
                  </h2>
                  <p className="text-gray-600">
                    Plus vous êtes précis, plus nous pourrons vous proposer une solution adaptée.
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
                    className="w-full"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Envoyer le message
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-electric-blue/10 rounded-lg">
                  <p className="text-sm text-anthracite">
                    <strong>Réponse garantie sous 24h</strong> - Nous nous engageons à vous répondre rapidement 
                    avec un premier retour sur votre projet et les prochaines étapes.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </ClientLayout>
  )
}

export default ContactPage