import React from 'react'
import Link from 'next/link'
import { Github, Linkedin, MessageSquare, Mail, Phone, MapPin } from 'lucide-react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/XiVolt', // À remplacer par votre lien GitHub
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/tristan-bras-3434a82a6', // À remplacer par votre lien LinkedIn
    },
    {
      name: 'Discord',
      icon: MessageSquare,
      href: 'https://discord.gg/nucT9x5Q', // À remplacer par votre lien Discord
    },
  ]

  const quickLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Prestations', href: '/prestations' },
    { name: 'Contact', href: '/contact' },
    { name: 'CGV', href: '/cgv' },
    { name: 'Mentions légales', href: '/mentions-legales' },
  ]

  return (
    <footer className="bg-anthracite text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-electric-blue to-volt-yellow rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="text-xl font-bold">Voltura Code</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Solutions de développement web modernes et innovantes. 
              Transformons vos idées en applications performantes et élégantes.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-700 hover:bg-electric-blue rounded-lg flex items-center justify-center transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-volt-yellow transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-electric-blue" />
                <span className="text-gray-300">volturacode@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-electric-blue" />
                <span className="text-gray-300">+33 (0)7 85 40 82 49</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-electric-blue" />
                <span className="text-gray-300">France</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ligne de séparation et copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Voltura Code. Tous droits réservés.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Développé avec ❤️ et Next.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer