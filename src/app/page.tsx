'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Code2, Zap, Shield, Users, Star, ChevronRight, Github, Linkedin, MessageSquare } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ClientLayout from '@/components/ClientLayout'
import siteContent from '@/data/site-content.json'

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
      {/* Hero Section modernisée avec SVG dynamique */}
      <section className="relative overflow-hidden py-28 bg-gradient-to-br from-anthracite via-dark-gray to-anthracite text-white">
        <svg className="absolute left-1/2 top-0 -translate-x-1/2 -z-10 opacity-40" width="900" height="400" viewBox="0 0 900 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="450" cy="200" rx="400" ry="120" fill="#3B82F6" fillOpacity="0.25"/>
          <ellipse cx="600" cy="100" rx="180" ry="60" fill="#FACC15" fillOpacity="0.18"/>
        </svg>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center justify-between">
            <div className="flex-1 space-y-10">
              <div className="inline-flex items-center px-5 py-2 bg-electric-blue/20 rounded-full text-base font-medium animate-pulse">
                <Zap className="w-5 h-5 mr-2 text-volt-yellow animate-bounce" />
                Solutions de développement innovantes
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight drop-shadow-lg">
                {siteContent.hero.title}
              </h1>
              <p className="text-2xl text-gray-200 max-w-2xl font-light">
                {siteContent.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg" className="w-full sm:w-auto hover:scale-105 transition-transform">
                    {siteContent.hero.ctaText}
                    <ArrowRight className="w-5 h-5 ml-2 animate-bounce" />
                  </Button>
                </Link>
                <Link href="/prestations">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-anthracite">
                    Voir nos services
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-6 pt-4">
                <span className="text-base text-gray-300">Retrouvez-nous sur :</span>
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-gray-400 ${social.color} transition-colors p-2 hover:scale-125`}
                      aria-label={social.name}
                    >
                      <Icon className="w-6 h-6" />
                    </a>
                  )
                })}
              </div>
            </div>
            {/* Bloc code stylisé modernisé */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-r from-electric-blue to-volt-yellow rounded-2xl blur opacity-30"></div>
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-10 shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-volt-yellow rounded-full"></div>
                      <div className="w-3 h-3 bg-electric-blue rounded-full"></div>
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    </div>
                    <div className="bg-anthracite/80 rounded-lg p-4 font-mono text-base">
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
              {siteContent.services.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des solutions complètes pour tous vos besoins de développement web
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {siteContent.services.items.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <div className="h-2 bg-gradient-to-r from-electric-blue to-volt-yellow rounded-t-lg -mx-6 -mt-6 mb-6"></div>
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-anthracite mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <Link href="/prestations">
                  <Button variant="outline" className="w-full">
                    En savoir plus <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials section supprimée (aucun client pour l'instant) */}

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