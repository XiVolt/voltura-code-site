'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/supabase'
import { validateEmail, validatePassword } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import ClientLayout from '@/components/ClientLayout'

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const validate = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis'
    }
    
    if (!email) {
      newErrors.email = 'L\'email est requis'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Format d\'email invalide'
    }
    
    if (!password) {
      newErrors.password = 'Le mot de passe est requis'
    } else {
      const passwordValidation = validatePassword(password)
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0]
      }
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
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
      const { data, error } = await signUp(email, password, {
        full_name: fullName.trim()
      })
      
      if (error) {
        if (error.message.includes('User already registered')) {
          setErrors({ email: 'Cet email est déjà utilisé' })
        } else {
          setErrors({ general: 'Erreur d\'inscription: ' + error.message })
        }
      } else {
        // Success - show confirmation message or redirect
        router.push('/auth/confirm-email')
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
            <h2 className="text-3xl font-bold text-anthracite">Inscription</h2>
            <p className="mt-2 text-sm text-gray-600">
              Créez votre compte Voltura Code
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
                label="Nom complet"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
                placeholder="Votre nom complet"
                required
              />

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
                helperText="Au moins 8 caractères, avec majuscule, minuscule et chiffre"
                required
              />

              <Input
                label="Confirmer le mot de passe"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                placeholder="••••••••"
                required
              />

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
              >
                S'inscrire
              </Button>

              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Déjà un compte ?{' '}
                  <Link
                    href="/auth/login"
                    className="text-electric-blue hover:text-blue-700 font-medium transition-colors"
                  >
                    Connectez-vous
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

export default RegisterPage