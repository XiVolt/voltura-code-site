'use client'

import React from 'react'
import ClientLayout from '@/components/ClientLayout'
import Card from '@/components/ui/Card'

export default function MentionsLegalesPage() {
  return (
    <ClientLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-anthracite mb-8">Mentions Légales</h1>

          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">1. Éditeur du site</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>Entreprise :</strong> Voltura Code</p>
                <p><strong>Statut juridique :</strong> Auto-entrepreneur → Micro-entreprise</p>
                <p><strong>SIRET :</strong> (à compléter)</p>
                <p><strong>Siège social :</strong> (à compléter)</p>
                <p><strong>Email :</strong> <a href="mailto:volturacode@gmail.com" className="text-electric-blue hover:underline">volturacode@gmail.com</a></p>
                <p><strong>Directeur de la publication :</strong> Tristan Bras</p>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">2. Hébergement</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>Le site est hébergé par :</strong></p>
                <p>Vercel Inc.</p>
                <p>Adresse : 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
                <p>Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline">vercel.com</a></p>
                <p className="mt-4">Certaines données (notamment base de données et authentification) sont hébergées via Supabase.</p>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">3. Services fournis</h2>
              <div className="space-y-2 text-gray-700">
                <p>Le site Voltura Code propose notamment :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Création et vente de sites web sur mesure</li>
                  <li>Prestations de maintenance, corrections, optimisations et améliorations de sites</li>
                  <li>Accès à des espaces et outils de communication dédiés (chats privés avec les clients, canaux dédiés de support, etc.)</li>
                </ul>
                <p className="mt-4">
                  <strong>Pour chaque site conçu, Voltura Code offre une période de 2 mois de maintenance incluse</strong> à compter de la mise en ligne, selon les modalités précisées au contrat ou devis.
                </p>
                <p className="mt-2">
                  Les prestations présentées sur le site sont fournies sous forme de contrats de service ou de ventes dématérialisées.
                </p>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">4. Gestion des données personnelles</h2>
              <div className="space-y-4 text-gray-700">
                <p>La gestion des données est assurée notamment via :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Supabase :</strong> stockage sécurisé des données (comptes, sessions, etc.)</li>
                  <li><strong>Stripe :</strong> traitement des paiements</li>
                  <li><strong>Hébergement via Vercel</strong></li>
                </ul>

                <h3 className="text-xl font-semibold text-anthracite mt-6">4.1. Données collectées</h3>
                <p>En utilisant le site, peuvent être collectées :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Email, nom, informations de compte et de contact</li>
                  <li>Informations nécessaires au traitement des prestations (détails de projet, facturation)</li>
                  <li>Informations de connexion (IP, navigateur, logs techniques)</li>
                  <li>Données de paiement (gérées uniquement par Stripe, jamais stockées sur Voltura Code)</li>
                </ul>

                <h3 className="text-xl font-semibold text-anthracite mt-6">4.2. Finalités</h3>
                <p>Les données servent à :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Créer et gérer les comptes utilisateurs et la relation client</li>
                  <li>Permettre la commande, la facturation et l&apos;exécution des prestations</li>
                  <li>Assurer le support, le suivi des projets et l&apos;accès aux espaces de communication dédiés</li>
                  <li>Améliorer l&apos;expérience utilisateur et assurer la sécurité du site</li>
                </ul>

                <h3 className="text-xl font-semibold text-anthracite mt-6">4.3. Conservation des données</h3>
                <p>
                  Les données sont conservées aussi longtemps que nécessaire pour le fonctionnement des services,
                  le suivi des prestations et le respect des obligations légales (comptabilité, fiscalité, etc.).
                </p>

                <h3 className="text-xl font-semibold text-anthracite mt-6">4.4. Vos droits</h3>
                <p>
                  Conformément au RGPD, vous disposez de droits d&apos;accès, de rectification, de suppression,
                  d&apos;opposition et de portabilité. Pour les exercer, vous pouvez contacter Voltura Code à l&apos;adresse suivante :
                  <a href="mailto:volturacode@gmail.com" className="text-electric-blue hover:underline ml-1">volturacode@gmail.com</a>
                </p>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">5. Paiements</h2>
              <div className="space-y-2 text-gray-700">
                <p>Le site propose des paiements sécurisés via <strong>Stripe</strong> pour les prestations de Voltura Code.</p>
                <p className="mt-4">
                  Toutes les transactions sont chiffrées et traitées par Stripe.
                  <strong> Aucune donnée bancaire n&apos;est stockée sur le serveur de Voltura Code.</strong>
                </p>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">6. Propriété intellectuelle</h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  L&apos;ensemble du contenu du site (textes, images, logos, code, maquettes, livrables, etc.)
                  est protégé par le droit d&apos;auteur. Toute reproduction, modification, distribution ou
                  réutilisation non autorisée est strictement interdite.
                </p>
                <p className="mt-4">
                  Les sites et développements réalisés dans le cadre des prestations sont soumis aux conditions
                  prévues au devis ou contrat (licence, cession de droits éventuelle, etc.). Toute diffusion,
                  revente ou réutilisation non conforme au contrat peut faire l&apos;objet de poursuites.
                </p>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">7. Responsabilité</h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  Voltura Code met tout en œuvre pour assurer l&apos;exactitude et la mise à jour des informations
                  présentes sur le site. Cependant, Voltura Code ne saurait être responsable en cas :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>d&apos;interruption du site</li>
                  <li>d&apos;inexactitudes ou d&apos;omissions</li>
                  <li>de dysfonctionnements techniques externes (hébergement, prestataires de paiement, API externes, etc.)</li>
                </ul>
                <p className="mt-4">
                  L&apos;utilisation des services personnalisés implique une collaboration technique avec le client ;
                  Voltura Code n&apos;est pas responsable d&apos;une mauvaise utilisation, modification ou hébergement
                  par le client si cela sort du cadre de la prestation prévue.
                </p>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">8. Conditions générales de vente (CGV)</h2>
              <div className="space-y-2 text-gray-700">
                <p>Pour les prestations vendues (création de sites web, maintenance, services associés) :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Les tarifs et conditions sont précisés dans un devis ou un contrat accepté avant le début de la prestation</li>
                  <li>Une fois le site livré (ou la phase convenue livrée), aucune annulation n&apos;est possible, sauf accord spécifique ou disposition légale impérative</li>
                  <li>La maintenance offerte de 2 mois couvre les corrections de bugs et ajustements mineurs définis au contrat, à l&apos;exclusion de nouvelles fonctionnalités substantielles</li>
                </ul>
                <p className="mt-4">
                  Les CGV complètes sont accessibles sur la <a href="/cgv" className="text-electric-blue hover:underline">page dédiée</a>.
                </p>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">9. Cookies</h2>
              <div className="space-y-2 text-gray-700">
                <p>Le site peut utiliser des cookies techniques pour :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>gérer les comptes et sessions</li>
                  <li>assurer la sécurité et le fonctionnement du site</li>
                  <li>analyser l&apos;audience et améliorer les services</li>
                  <li>stocker certaines préférences utilisateur</li>
                </ul>
                <p className="mt-4">
                  L&apos;utilisateur peut configurer ses préférences dans son navigateur ou via le bandeau
                  de gestion des cookies, lorsqu&apos;il est disponible.
                </p>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">10. Contact</h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  Pour toute question, demande d&apos;information, devis ou support, vous pouvez contacter Voltura Code :
                </p>
                <p className="mt-2">
                  <strong>Email :</strong> <a href="mailto:volturacode@gmail.com" className="text-electric-blue hover:underline">volturacode@gmail.com</a>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}

