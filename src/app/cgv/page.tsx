'use client'

import React from 'react'
import ClientLayout from '@/components/ClientLayout'
import Card from '@/components/ui/Card'

export default function CGVPage() {
  return (
    <ClientLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-anthracite mb-8">Conditions Générales de Vente</h1>

          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">1. Objet</h2>
              <p className="text-gray-700">
                Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre
                Voltura Code et ses clients dans le cadre de la vente de prestations de services (création de sites web,
                maintenance, optimisations, etc.).
              </p>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">2. Acceptation des CGV</h2>
              <p className="text-gray-700">
                Toute commande implique l&apos;acceptation pleine et entière des présentes CGV.
                L&apos;acceptation se matérialise par la signature d&apos;un devis, la validation d&apos;un bon de commande
                ou tout autre moyen convenu entre les parties.
              </p>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">3. Services proposés</h2>
              <div className="space-y-2 text-gray-700">
                <p>Voltura Code propose les services suivants :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Création de sites web sur mesure</strong> : conception, développement et mise en ligne</li>
                  <li><strong>Maintenance et support</strong> : corrections de bugs, mises à jour, optimisations</li>
                  <li><strong>Améliorations et évolutions</strong> : ajout de fonctionnalités, refonte</li>
                  <li><strong>Hébergement et gestion technique</strong> (selon accord)</li>
                </ul>
                <p className="mt-4 font-semibold">
                  Pour chaque site créé, Voltura Code offre 2 mois de maintenance incluse à compter de la mise en ligne.
                </p>
                <p className="text-sm">
                  Cette maintenance couvre les corrections de bugs, ajustements mineurs et support technique,
                  à l&apos;exclusion de nouvelles fonctionnalités substantielles ou de modifications du cahier des charges initial.
                </p>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">4. Devis et commande</h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  Chaque prestation fait l&apos;objet d&apos;un devis détaillé précisant :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>La nature des prestations</li>
                  <li>Les délais de réalisation</li>
                  <li>Le prix total TTC</li>
                  <li>Les modalités de paiement</li>
                  <li>Les éventuelles options (hébergement, maintenance étendue, etc.)</li>
                </ul>
                <p className="mt-4">
                  Le devis est valable 30 jours. Passé ce délai, Voltura Code se réserve le droit de réviser les tarifs.
                </p>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">5. Tarifs et modalités de paiement</h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  Les tarifs sont indiqués en euros TTC (TVA non applicable - article 293 B du CGI pour les micro-entreprises).
                </p>
                <p className="mt-4"><strong>Modalités de paiement :</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Acompte</strong> : 30% à 50% à la commande (selon devis)</li>
                  <li><strong>Solde</strong> : à la livraison ou selon échéancier défini au devis</li>
                </ul>
                <p className="mt-4"><strong>Moyens de paiement acceptés :</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Carte bancaire via Stripe (sécurisé)</li>
                  <li>Virement bancaire (coordonnées fournies sur facture)</li>
                </ul>
                <p className="mt-4 text-sm text-gray-600">
                  Aucune donnée bancaire n&apos;est stockée par Voltura Code. Tous les paiements par carte sont traités par Stripe.
                </p>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">6. Délais de réalisation</h2>
              <p className="text-gray-700">
                Les délais sont indicatifs et dépendent de la complexité du projet et de la réactivité du client
                (fourniture de contenus, validations, retours, etc.).
                Voltura Code s&apos;engage à respecter au mieux les délais convenus,
                mais ne saurait être tenu responsable de retards dus à des causes externes ou à des modifications
                de cahier des charges en cours de projet.
              </p>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">7. Livraison et validation</h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  La livraison intervient lorsque le site est mis en ligne et accessible sur l&apos;URL convenue,
                  ou lorsque les fichiers/livrables sont transmis au client selon les modalités prévues.
                </p>
                <p className="mt-4">
                  Le client dispose d&apos;un délai de <strong>7 jours</strong> pour faire part de ses éventuelles remarques.
                  Passé ce délai, la prestation est considérée comme validée.
                </p>
                <p className="mt-4">
                  Les modifications substantielles ou hors cahier des charges initial feront l&apos;objet d&apos;un nouveau devis.
                </p>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">8. Droit de rétractation</h2>
              <p className="text-gray-700">
                Conformément à la législation en vigueur, <strong>aucun droit de rétractation</strong> ne peut être exercé
                pour des prestations de services personnalisées et/ou commencées avec l&apos;accord du client avant l&apos;expiration
                du délai de 14 jours.
              </p>
              <p className="mt-4 text-gray-700">
                Une fois la prestation livrée et validée, aucune annulation ou remboursement ne pourra être demandé,
                sauf accord exceptionnel de Voltura Code.
              </p>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">9. Propriété intellectuelle</h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  Sauf disposition contraire au contrat, le code source, les maquettes et autres éléments créés
                  restent la propriété de Voltura Code jusqu&apos;au paiement intégral.
                </p>
                <p className="mt-4">
                  Une fois la prestation payée intégralement, une licence d&apos;utilisation ou une cession de droits
                  (selon ce qui est prévu au devis) est accordée au client pour l&apos;usage convenu.
                </p>
                <p className="mt-4 font-semibold">
                  Le client s&apos;interdit de revendre, redistribuer ou réutiliser les livrables en dehors du cadre prévu au contrat.
                </p>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">10. Garanties et maintenance</h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Maintenance incluse (2 mois) :</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Corrections de bugs</li>
                  <li>Ajustements mineurs de contenu ou de mise en page</li>
                  <li>Support technique par email</li>
                </ul>
                <p className="mt-4">
                  <strong>Exclusions :</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Nouvelles fonctionnalités ou développements hors scope initial</li>
                  <li>Modifications substantielles du design ou de l&apos;architecture</li>
                  <li>Problèmes causés par le client (hébergement externe, modifications non autorisées, etc.)</li>
                </ul>
                <p className="mt-4">
                  Au-delà des 2 mois, le client peut souscrire à un contrat de maintenance optionnel.
                </p>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">11. Responsabilité</h2>
              <p className="text-gray-700">
                Voltura Code s&apos;engage à fournir un travail de qualité conforme aux standards du web.
                Toutefois, Voltura Code ne saurait être tenu responsable :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Des dysfonctionnements dus à l&apos;hébergeur, au fournisseur d&apos;accès ou à des tiers</li>
                <li>Des modifications ou interventions non autorisées par le client ou des tiers</li>
                <li>De la perte de données non sauvegardées par le client</li>
                <li>Des interruptions de service indépendantes de sa volonté</li>
              </ul>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">12. Protection des données</h2>
              <p className="text-gray-700">
                Voltura Code s&apos;engage à respecter la réglementation en vigueur concernant la protection des données
                personnelles (RGPD). Les données collectées sont utilisées uniquement dans le cadre de l&apos;exécution
                des prestations et ne sont jamais vendues à des tiers.
              </p>
              <p className="mt-4 text-gray-700">
                Pour plus d&apos;informations, consultez nos <a href="/mentions-legales" className="text-electric-blue hover:underline">mentions légales</a>.
              </p>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">13. Résiliation</h2>
              <p className="text-gray-700">
                En cas de manquement grave de l&apos;une des parties (non-paiement, non-respect des délais sans justification, etc.),
                le contrat pourra être résilié de plein droit après mise en demeure restée sans effet pendant 15 jours.
              </p>
              <p className="mt-4 text-gray-700">
                Les sommes déjà versées resteront acquises à Voltura Code à titre de dédommagement,
                sauf accord amiable entre les parties.
              </p>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">14. Litiges</h2>
              <p className="text-gray-700">
                En cas de litige, les parties s&apos;engagent à rechercher une solution amiable avant toute action judiciaire.
                À défaut, les tribunaux compétents seront ceux du ressort du siège social de Voltura Code.
              </p>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-anthracite mb-4">15. Contact</h2>
              <p className="text-gray-700">
                Pour toute question relative aux présentes CGV :
              </p>
              <p className="mt-2 text-gray-700">
                <strong>Email :</strong> <a href="mailto:volturacode@gmail.com" className="text-electric-blue hover:underline">volturacode@gmail.com</a>
              </p>
            </Card>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Dernière mise à jour : Décembre 2025</p>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}

