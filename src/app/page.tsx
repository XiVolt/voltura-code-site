'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Code2, Zap, Shield, Users, Star, ChevronRight, Github, Linkedin, MessageSquare } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ClientLayout from '@/components/ClientLayout'

const HomePage = () => {
  const features = [
    {
      icon: Code2,
      title: 'Développement Modern',
      description: 'Applications web avec les dernières technologies : React, Next.js, TypeScript'
    },
    {
      icon: Zap,
      title: 'Performance Optimale',
      description: 'Sites rapides et optimisés pour une expérience utilisateur exceptionnelle'
    },
    {
      icon: Shield,
      title: 'Sécurité Avancée',
      description: 'Authentification sécurisée et protection des données utilisateur'
    },
    {
      icon: Users,
      title: 'Support Personnalisé',
      description: 'Accompagnement sur-mesure de la conception au déploiement'
    }
  ]

  const testimonials = [
    {
      name: 'Marie L.',
      role: 'CEO StartupTech',
      content: 'Voltura Code a transformé notre vision en une application web performante. Service exceptionnel !',
      rating: 5
    },
    {
      name: 'Thomas R.',
      role: 'Entrepreneur',
      content: 'Code propre, délais respectés, communication parfaite. Je recommande vivement !',
      rating: 5
    }
  ]

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com', color: 'hover:text-anthracite' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com', color: 'hover:text-blue-600' },
    { name: 'Discord', icon: MessageSquare, href: 'https://discord.com', color: 'hover:text-indigo-600' }
  ]

  return (
    <ClientLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-anthracite via-dark-gray to-anthracite text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/10 to-volt-yellow/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-electric-blue/20 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4 mr-2 text-volt-yellow" />
                Solutions de développement innovantes
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Transformez vos{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-volt-yellow">
                  idées
                </span>{' '}
                en applications performantes
              </h1>
              
              <p className="text-xl text-gray-300 max-w-2xl">
                Voltura Code vous accompagne dans la création d'applications web modernes, 
                sécurisées et optimisées. Du concept au déploiement, nous donnons vie à vos projets.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg" className="w-full sm:w-auto">
                    Commencer un projet
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/prestations">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-anthracite">
                    Voir nos services
                  </Button>
                </Link>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-6 pt-4">
                <span className="text-sm text-gray-400">Retrouvez-nous sur :</span>
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-gray-400 ${social.color} transition-colors p-2`}
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            </div>
            
            <div className="relative lg:ml-8">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-electric-blue to-volt-yellow rounded-2xl blur opacity-20"></div>
                <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-volt-yellow rounded-full"></div>
                      <div className="w-3 h-3 bg-electric-blue rounded-full"></div>
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    </div>
                    <div className="bg-anthracite/80 rounded-lg p-4 font-mono text-sm">
                      <div className="text-volt-yellow">const voltura = {`{`}</div>
                      <div className="text-white ml-4">expertise: <span className="text-electric-blue">'Full-Stack'</span>,</div>
                      <div className="text-white ml-4">technologies: [</div>
                      <div className="text-gray-300 ml-8">'React', 'Next.js',</div>
                      <div className="text-gray-300 ml-8">'TypeScript', 'Supabase'</div>
                      <div className="text-white ml-4">],</div>
                      <div className="text-white ml-4">quality: <span className="text-volt-yellow">100</span></div>
                      <div className="text-volt-yellow">{`}`}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-anthracite mb-4">
              Pourquoi choisir Voltura Code ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une approche moderne et professionnelle pour donner vie à vos projets web
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-r from-electric-blue to-volt-yellow rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-anthracite mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-anthracite mb-4">
              Nos Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des solutions complètes pour tous vos besoins de développement web
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <div className="h-2 bg-gradient-to-r from-electric-blue to-volt-yellow rounded-t-lg -mx-6 -mt-6 mb-6"></div>
              <h3 className="text-xl font-semibold text-anthracite mb-3">Développement Web</h3>
              <p className="text-gray-600 mb-4">
                Applications web modernes avec React, Next.js et les meilleures pratiques du développement.
              </p>
              <div className="text-sm text-gray-500 mb-4">À partir de 2 500€</div>
              <Link href="/prestations">
                <Button variant="outline" className="w-full">
                  En savoir plus <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <div className="h-2 bg-gradient-to-r from-volt-yellow to-electric-blue rounded-t-lg -mx-6 -mt-6 mb-6"></div>
              <h3 className="text-xl font-semibold text-anthracite mb-3">Applications Métier</h3>
              <p className="text-gray-600 mb-4">
                Solutions sur-mesure pour optimiser vos processus business avec tableaux de bord et authentification.
              </p>
              <div className="text-sm text-gray-500 mb-4">Sur devis</div>
              <Link href="/prestations">
                <Button variant="outline" className="w-full">
                  En savoir plus <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <div className="h-2 bg-gradient-to-r from-electric-blue to-volt-yellow rounded-t-lg -mx-6 -mt-6 mb-6"></div>
              <h3 className="text-xl font-semibold text-anthracite mb-3">Maintenance & Support</h3>
              <p className="text-gray-600 mb-4">
                Maintenance continue, mises à jour sécurité et support technique pour vos applications.
              </p>
              <div className="text-sm text-gray-500 mb-4">À partir de 150€/mois</div>
              <Link href="/prestations">
                <Button variant="outline" className="w-full">
                  En savoir plus <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-anthracite mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les témoignages de nos clients satisfaits
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-volt-yellow text-volt-yellow" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-anthracite">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-electric-blue to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Contactez-nous dès aujourd'hui pour discuter de votre projet et obtenir un devis personnalisé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Demander un devis gratuit
              </Button>
            </Link>
            <Link href="/prestations">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-electric-blue">
                Découvrir nos prestations
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </ClientLayout>
  )
}

export default HomePage