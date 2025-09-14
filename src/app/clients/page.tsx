'use client'

import React from 'react'
import Link from 'next/link'
import { Users, Package, Clock, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ClientLayout from '@/components/ClientLayout'

const ClientsPage = () => {
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
              Clients & Commandes
            </h1>
            <p className="text-2xl text-gray-200 max-w-2xl mx-auto font-light">
              Espace dédié à la gestion des projets clients et au suivi des commandes
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section modernisée */}
      <section className="relative py-24 bg-light-gray overflow-hidden">
        <svg className="absolute -top-24 -left-32 w-96 h-96 opacity-30 -z-10" viewBox="0 0 400 400" fill="none"><ellipse cx="200" cy="200" rx="200" ry="120" fill="#FACC15"/></svg>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-16">
            <div className="w-28 h-28 bg-gradient-to-r from-electric-blue to-volt-yellow rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
              <Clock className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl font-extrabold text-anthracite mb-4">
              Section en cours de développement
            </h2>
            <p className="text-2xl text-gray-600 mb-8">
              Cette section sera bientôt disponible pour permettre aux clients de suivre leurs projets et consulter l'historique de leurs commandes.
            </p>
          </div>
          <div className="flex flex-wrap gap-10 justify-center mb-12">
            <Card className="text-center bg-white/80 backdrop-blur-md border-2 border-electric-blue -rotate-2 hover:scale-105 transition-transform">
              <Users className="w-14 h-14 text-electric-blue mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-bold text-anthracite mb-2">Gestion Clients</h3>
              <p className="text-gray-600 text-base">
                Profils clients, historique des projets et informations de contact
              </p>
            </Card>
            <Card className="text-center bg-white/80 backdrop-blur-md border-2 border-volt-yellow rotate-2 hover:scale-105 transition-transform">
              <Package className="w-14 h-14 text-volt-yellow mx-auto mb-4 animate-bounce" />
              <h3 className="text-xl font-bold text-anthracite mb-2">Suivi Commandes</h3>
              <p className="text-gray-600 text-base">
                État d'avancement des projets et notifications en temps réel
              </p>
            </Card>
            <Card className="text-center bg-white/80 backdrop-blur-md border-2 border-electric-blue -rotate-3 hover:scale-105 transition-transform">
              <ArrowRight className="w-14 h-14 text-electric-blue mx-auto mb-4 animate-spin-slow" />
              <h3 className="text-xl font-bold text-anthracite mb-2">Prochaines Étapes</h3>
              <p className="text-gray-600 text-base">
                Planning des livrables et prochaines échéances
              </p>
            </Card>
          </div>
          <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="hover:scale-105">
                Nous contacter pour un projet
              </Button>
            </Link>
            <Link href="/prestations">
              <Button variant="outline" size="lg" className="hover:scale-105">
                Découvrir nos services
              </Button>
            </Link>
          </div>
          <div className="mt-16 p-8 bg-white/90 rounded-2xl border-2 border-electric-blue shadow-xl max-w-xl mx-auto">
            <h3 className="text-2xl font-bold text-anthracite mb-2">
              Vous êtes déjà client ?
            </h3>
            <p className="text-gray-600 mb-4 text-lg">
              Pour le moment, contactez-nous directement pour obtenir des informations sur l'état d'avancement de votre projet.
            </p>
            <a 
              href="mailto:voltura<strong>code</strong>@gmail.com" 
              className="text-electric-blue hover:text-blue-700 transition-colors font-semibold text-lg"
            >
              volturacode@gmail.com
            </a>
          </div>
        </div>
      </section>
    </ClientLayout>
  )
}

export default ClientsPage