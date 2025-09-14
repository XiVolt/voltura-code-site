'use client'

import React from 'react'
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
      price: 'À partir de 2 500€',
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
      price: 'À partir de 3 500€',
      popular: false
    },
    {
      id: 'api-development',
      icon: Zap,
      title: 'Développement API',
      description: 'APIs REST et GraphQL scalables et sécurisées',
      features: [
        'API REST/GraphQL',
        'Documentation',
        'Authentification JWT',
        'Rate limiting',
        'Monitoring'
      ],
      price: 'À partir de 1 500€',
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
      price: 'À partir de 150€/mois',
      popular: false
    },
    {
      id: 'consulting',
      icon: Users,
      title: 'Conseil & Audit',
      description: 'Audit technique et conseil en architecture logicielle',
      features: [
        'Audit de code',
        'Architecture review',
        'Conseils techniques',
        'Plan d\'amélioration',
        'Formation équipe'
      ],
      price: 'À partir de 800€',
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

  return (
    <ClientLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-anthracite to-dark-gray text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Nos Prestations
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Des solutions complètes pour donner vie à vos projets web. 
              De la conception au déploiement, nous vous accompagnons à chaque étape.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Card key={service.id} className={`relative hover:shadow-xl transition-all ${service.popular ? 'ring-2 ring-electric-blue' : ''}`}>
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-electric-blue text-white px-4 py-1 rounded-full text-sm font-medium">
                        Populaire
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-electric-blue to-volt-yellow rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-anthracite mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    
                    <div className="space-y-3 mb-6 text-left">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <Check className="w-5 h-5 text-electric-blue mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-6">
                      <div className="text-2xl font-bold text-anthracite mb-4">{service.price}</div>
                      <Link href="/contact">
                        <Button 
                          variant={service.popular ? 'primary' : 'outline'} 
                          className="w-full"
                        >
                          Demander un devis
                        </Button>
                      </Link>
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