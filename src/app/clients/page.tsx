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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-anthracite to-dark-gray text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Clients & Commandes
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Espace dédié à la gestion des projets clients et au suivi des commandes
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-24 bg-light-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <div className="w-24 h-24 bg-gradient-to-r from-electric-blue to-volt-yellow rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-anthracite mb-4">
              Section en cours de développement
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Cette section sera bientôt disponible pour permettre aux clients de suivre leurs projets 
              et consulter l'historique de leurs commandes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <Users className="w-12 h-12 text-electric-blue mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-anthracite mb-2">Gestion Clients</h3>
              <p className="text-gray-600 text-sm">
                Profils clients, historique des projets et informations de contact
              </p>
            </Card>

            <Card className="text-center">
              <Package className="w-12 h-12 text-volt-yellow mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-anthracite mb-2">Suivi Commandes</h3>
              <p className="text-gray-600 text-sm">
                État d'avancement des projets et notifications en temps réel
              </p>
            </Card>

            <Card className="text-center">
              <ArrowRight className="w-12 h-12 text-electric-blue mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-anthracite mb-2">Prochaines Étapes</h3>
              <p className="text-gray-600 text-sm">
                Planning des livrables et prochaines échéances
              </p>
            </Card>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 justify-center">
            <Link href="/contact">
              <Button size="lg">
                Nous contacter pour un projet
              </Button>
            </Link>
            <Link href="/prestations">
              <Button variant="outline" size="lg">
                Découvrir nos services
              </Button>
            </Link>
          </div>

          <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-anthracite mb-2">
              Vous êtes déjà client ?
            </h3>
            <p className="text-gray-600 mb-4">
              Pour le moment, contactez-nous directement pour obtenir des informations 
              sur l'état d'avancement de votre projet.
            </p>
            <a 
              href="mailto:contact@voltura-code.com" 
              className="text-electric-blue hover:text-blue-700 transition-colors font-medium"
            >
              contact@voltura-code.com
            </a>
          </div>
        </div>
      </section>
    </ClientLayout>
  )
}

export default ClientsPage