'use client'

import React, { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/supabase'
import Link from 'next/link'
import { Code2, Database, Shield, Smartphone, Zap, Settings, Clock, Users, Check } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ClientLayout from '@/components/ClientLayout'

const PrestationsPage = () => {
  const services = [
    {
      id: 'web-development',
      icon: Code2,
      title: 'Développement Web',
      description: 'Applications web modernes et performantes avec les dernières technologies',
      features: [
        'React & Next.js',
        'TypeScript',
        'Responsive Design',
        'SEO Optimisé',
        'Performance élevée'
      ],
      price: 'À partir de 900€',
      popular: true
    },
    {
      id: 'business-apps',
      icon: Database,
      title: 'Applications Métier',
      description: 'Solutions sur-mesure pour optimiser vos processus business',
      features: [
        'Tableaux de bord',
        'Gestion des utilisateurs',
        'API sécurisées',
        'Base de données',
        'Authentification'
      ],
      price: 'Sur devis',
      popular: false
    },
    {
      id: 'ecommerce',
      icon: Smartphone,
      title: 'E-commerce',
      description: 'Boutiques en ligne complètes avec paiement sécurisé',
      features: [
        'Catalogue produits',
        'Panier & commandes',
        'Paiement sécurisé',
        'Gestion stock',
        'Dashboard admin'
      ],
      price: 'À partir de 700€',
      popular: false
    },
    {
      id: 'maintenance',
      icon: Settings,
      title: 'Maintenance & Support',
      description: 'Maintenance continue et support technique de vos applications',
      features: [
        'Mises à jour sécurité',
        'Monitoring 24/7',
        'Sauvegardes',
        'Support technique',
        'Rapports mensuels'
      ],
      price: 'À partir de 80€/mois',
      popular: false
    },
    {
      id: 'lua-fivem',
      icon: Zap,
      title: 'Développement Lua pour FiveM GTA',
      description: 'Scripts personnalisés et systèmes avancés pour serveurs FiveM GTA. Optimisé pour la performance et la stabilité.',
      features: [
        'Scripts sur-mesure',
        'Systèmes de gestion',
        'Optimisation serveur',
        'Sécurité anti-cheat',
        'Support & évolutivité'
      ],
      price: 'Sur devis',
      popular: false
    },
    {
      id: 'site-vitrine',
      icon: Shield,
      title: 'Développement de site vitrine',
      description: 'Site web simple, professionnel et responsive pour présenter votre activité ou projet.',
      features: [
        'Design personnalisé',
        '1 à 5 pages',
        'Formulaire de contact',
        'Optimisation SEO',
        'Livraison rapide'
      ],
      price: '400€',
      popular: false
    }
  ]

  const additionalServices = [
    'Hébergement et déploiement',
    'Configuration des domaines',
    'Certificats SSL',
    'Optimisation des performances',
    'Formation utilisateurs',
    'Documentation technique'
  ]

  const [user, setUser] = useState<any>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const u = await getCurrentUser()
      setUser(u)
      setCheckingAuth(false)
    }
    fetchUser()
  }, [])

  if (checkingAuth) {
    return null // ou un loader si tu veux
  }

  const renderDevisButton = () => {
    if (!user) {
      return (
        <Link href="/auth/login">
          <Button variant="outline" className="w-full">Connectez-vous pour demander un devis</Button>
        </Link>
      )
    }
    return (
      <Link href="/contact">
        <Button variant="primary" className="w-full hover:scale-105">Demander un devis</Button>
      </Link>
    )
  }

  return (
    <ClientLayout>
      {/* Hero Section modernisée avec SVG dynamique */}
      <section className="relative overflow-hidden py-28 bg-gradient-to-br from-anthracite to-dark-gray text-white">
        <svg className="absolute left-1/2 top-0 -translate-x-1/2 -z-10 opacity-40" width="900" height="400" viewBox="0 0 900 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="450" cy="200" rx="400" ry="120" fill="#3B82F6" fillOpacity="0.25"/>
          <ellipse cx="600" cy="100" rx="180" ry="60" fill="#FACC15" fillOpacity="0.18"/>
        </svg>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
              Nos Prestations
            </h1>
            <p className="text-2xl text-gray-200 max-w-2xl mx-auto font-light">
              Des solutions complètes pour donner vie à vos projets web.<br />
              De la conception au déploiement, on vous accompagne à chaque étape.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid modernisé */}
      <section className="relative py-24 bg-light-gray overflow-hidden">
        <svg className="absolute -top-24 -left-32 w-96 h-96 opacity-30 -z-10" viewBox="0 0 400 400" fill="none"><ellipse cx="200" cy="200" rx="200" ry="120" fill="#FACC15"/></svg>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-12 justify-center">
            {services.map((service, i) => {
              const Icon = service.icon
              return (
                <Card key={service.id} className={`relative hover:scale-105 hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-md border-2 ${service.popular ? 'border-electric-blue -rotate-2' : 'border-volt-yellow rotate-2'} ${i%2===0 ? '-translate-y-4' : 'translate-y-4'}`}>
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-electric-blue text-white px-4 py-1 rounded-full text-sm font-medium">
                        Populaire
                      </div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-electric-blue to-volt-yellow rounded-xl flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-anthracite mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    <div className="space-y-3 mb-6 text-left">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <Check className="w-5 h-5 text-electric-blue mr-3 flex-shrink-0 animate-pulse" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-6">
                      <div className="text-2xl font-bold text-anthracite mb-4">{service.price}</div>
                      {renderDevisButton()}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-anthracite mb-4">
              Services Additionnels
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des services complémentaires pour une solution complète
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <div key={index} className="flex items-center p-4 bg-light-gray rounded-lg">
                <Check className="w-5 h-5 text-electric-blue mr-3 flex-shrink-0" />
                <span className="text-gray-700">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-anthracite mb-4">
              Notre Processus
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une méthodologie éprouvée pour garantir le succès de votre projet
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Analyse', description: 'Étude de vos besoins et définition du cahier des charges' },
              { step: '2', title: 'Conception', description: 'Design et architecture de la solution technique' },
              { step: '3', title: 'Développement', description: 'Codage avec les meilleures pratiques et tests' },
              { step: '4', title: 'Déploiement', description: 'Mise en ligne et formation utilisateur' }
            ].map((phase, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-electric-blue to-volt-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{phase.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-anthracite mb-2">{phase.title}</h3>
                <p className="text-gray-600">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-electric-blue to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Clock className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Contactez-nous pour discuter de vos besoins et recevoir un devis personnalisé sous 24h.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="secondary" size="lg">
                Demander un devis gratuit
              </Button>
            </Link>
            <Link href="/#testimonials">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-electric-blue">
                Voir les témoignages
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </ClientLayout>
  )
}

export default PrestationsPage