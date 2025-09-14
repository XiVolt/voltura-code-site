'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from '@/lib/supabase'
import { validateEmail } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import ClientLayout from '@/components/ClientLayout'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const validate = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!email) {
      newErrors.email = 'L\'email est requis'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Format d\'email invalide'
    }
    
    if (!password) {
      newErrors.password = 'Le mot de passe est requis'
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
      const { data, error } = await signIn(email, password)
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ general: 'Email ou mot de passe incorrect' })
        } else {
          setErrors({ general: 'Erreur de connexion: ' + error.message })
        }
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      setErrors({ general: 'Une erreur inattendue s\'est produite' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gradient-to-br from-light-gray to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-electric-blue to-volt-yellow rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">V</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-anthracite">Connexion</h2>
            <p className="mt-2 text-sm text-gray-600">
              Connectez-vous à votre compte Voltura Code
            </p>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {errors.general}
                </div>
              )}

              <Input
                label="Adresse email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="votre@email.com"
                required
              />

              <Input
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="••••••••"
                required
              />

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    href="/auth/forgot-password"
                    className="text-electric-blue hover:text-blue-700 transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
              >
                Se connecter
              </Button>

              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Pas encore de compte ?{' '}
                  <Link
                    href="/auth/register"
                    className="text-electric-blue hover:text-blue-700 font-medium transition-colors"
                  >
                    Inscrivez-vous
                  </Link>
                </span>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </ClientLayout>
  )
}

export default LoginPage