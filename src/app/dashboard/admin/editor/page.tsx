"use client";
import React, { useState, useEffect } from 'react';
import { Lock, Save, Upload as UploadIcon, Eye, EyeOff } from 'lucide-react';
import EditableText from '@/components/editor/EditableText';
import EditableColor from '@/components/editor/EditableColor';
import EditableImage from '@/components/editor/EditableImage';

interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
  };
  services: {
    title: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  about: {
    title: string;
    description: string;
    image: string;
  };
  contact: {
    title: string;
    description: string;
    email: string;
    phone: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

export default function EditorPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [message, setMessage] = useState('');

  // Charger le contenu au démarrage
  useEffect(() => {
    if (isAuthenticated) {
      loadContent();
    }
  }, [isAuthenticated]);

  const loadContent = async () => {
    try {
      const response = await fetch('/api/admin/get-content');
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error('Erreur de chargement:', error);
      setMessage('❌ Erreur de chargement du contenu');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // En production, vérifier le mot de passe côté serveur
    // Pour l'instant, validation simple côté client
    if (password) {
      setIsAuthenticated(true);
      setPassword('');
    }
  };

  const handleSave = async () => {
    if (!content) return;
    
    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/update-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content,
          password: 'admin-password-placeholder' // À remplacer par un vrai système d'auth
        })
      });

      if (response.ok) {
        setMessage('✅ Contenu sauvegardé avec succès !');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('❌ Erreur de connexion');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          password: 'admin-password-placeholder' 
        })
      });

      if (response.ok) {
        setMessage('🚀 Déploiement lancé ! Le site sera mis à jour dans quelques minutes.');
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage('❌ Erreur lors du déploiement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('❌ Erreur de connexion');
    } finally {
      setIsDeploying(false);
    }
  };

  const updateContent = (path: string[], value: string) => {
    if (!content) return;

    const newContent = { ...content };
    let current: any = newContent;

    // Navigation jusqu'à l'avant-dernier niveau
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }

    // Mise à jour de la valeur
    current[path[path.length - 1]] = value;
    setContent(newContent);
  };

  // Interface de connexion
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-anthracite to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <Lock className="text-gold" size={48} />
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">Éditeur de contenu</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mot de passe administrateur</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Entrez le mot de passe"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gold text-white py-3 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Interface d'édition
  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du contenu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre d'outils */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Éditeur de contenu</h1>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isEditMode 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isEditMode ? <EyeOff size={18} /> : <Eye size={18} />}
              {isEditMode ? 'Mode Édition' : 'Mode Aperçu'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {message && (
              <span className="text-sm font-medium">{message}</span>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving || !isEditMode}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <button
              onClick={handleDeploy}
              disabled={isDeploying}
              className="flex items-center gap-2 bg-gold text-white px-4 py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UploadIcon size={18} />
              {isDeploying ? 'Déploiement...' : 'Déployer'}
            </button>
          </div>
        </div>
      </div>

      {/* Contenu éditable */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Section Hero */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-sm font-bold text-gray-500 mb-4 uppercase">Section Hero</h2>
          <EditableText
            value={content.hero.title}
            onChange={(v) => updateContent(['hero', 'title'], v)}
            tag="h1"
            className="text-4xl font-bold mb-4"
            isEditMode={isEditMode}
          />
          <EditableText
            value={content.hero.subtitle}
            onChange={(v) => updateContent(['hero', 'subtitle'], v)}
            tag="p"
            className="text-xl text-gray-600 mb-6"
            isEditMode={isEditMode}
          />
          <EditableText
            value={content.hero.ctaText}
            onChange={(v) => updateContent(['hero', 'ctaText'], v)}
            tag="span"
            className="inline-block bg-gold text-white px-6 py-3 rounded-lg"
            isEditMode={isEditMode}
          />
        </section>

        {/* Section Services */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-sm font-bold text-gray-500 mb-4 uppercase">Section Services</h2>
          <EditableText
            value={content.services.title}
            onChange={(v) => updateContent(['services', 'title'], v)}
            tag="h2"
            className="text-3xl font-bold mb-6"
            isEditMode={isEditMode}
          />
          <div className="grid md:grid-cols-3 gap-6">
            {content.services.items.map((service, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="text-4xl mb-4">{service.icon}</div>
                <EditableText
                  value={service.title}
                  onChange={(v) => {
                    const newItems = [...content.services.items];
                    newItems[index].title = v;
                    setContent({ ...content, services: { ...content.services, items: newItems } });
                  }}
                  tag="h3"
                  className="text-xl font-bold mb-2"
                  isEditMode={isEditMode}
                />
                <EditableText
                  value={service.description}
                  onChange={(v) => {
                    const newItems = [...content.services.items];
                    newItems[index].description = v;
                    setContent({ ...content, services: { ...content.services, items: newItems } });
                  }}
                  tag="p"
                  className="text-gray-600"
                  isEditMode={isEditMode}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Section À propos */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-sm font-bold text-gray-500 mb-4 uppercase">Section À propos</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <EditableText
                value={content.about.title}
                onChange={(v) => updateContent(['about', 'title'], v)}
                tag="h2"
                className="text-3xl font-bold mb-4"
                isEditMode={isEditMode}
              />
              <EditableText
                value={content.about.description}
                onChange={(v) => updateContent(['about', 'description'], v)}
                tag="p"
                className="text-gray-600"
                isEditMode={isEditMode}
              />
            </div>
            <EditableImage
              value={content.about.image}
              onChange={(v) => updateContent(['about', 'image'], v)}
              alt="À propos"
              className="w-full h-64 object-cover rounded-lg"
              isEditMode={isEditMode}
            />
          </div>
        </section>

        {/* Section Contact */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-sm font-bold text-gray-500 mb-4 uppercase">Section Contact</h2>
          <EditableText
            value={content.contact.title}
            onChange={(v) => updateContent(['contact', 'title'], v)}
            tag="h2"
            className="text-3xl font-bold mb-4"
            isEditMode={isEditMode}
          />
          <EditableText
            value={content.contact.description}
            onChange={(v) => updateContent(['contact', 'description'], v)}
            tag="p"
            className="text-gray-600 mb-6"
            isEditMode={isEditMode}
          />
          <div className="space-y-3">
            <EditableText
              value={content.contact.email}
              onChange={(v) => updateContent(['contact', 'email'], v)}
              tag="p"
              className="text-lg"
              isEditMode={isEditMode}
            />
            <EditableText
              value={content.contact.phone}
              onChange={(v) => updateContent(['contact', 'phone'], v)}
              tag="p"
              className="text-lg"
              isEditMode={isEditMode}
            />
          </div>
        </section>

        {/* Section Thème */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-sm font-bold text-gray-500 mb-4 uppercase">Couleurs du Thème</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <EditableColor
              label="Couleur Primaire"
              value={content.theme.primaryColor}
              onChange={(v) => updateContent(['theme', 'primaryColor'], v)}
              isEditMode={isEditMode}
            />
            <EditableColor
              label="Couleur Secondaire"
              value={content.theme.secondaryColor}
              onChange={(v) => updateContent(['theme', 'secondaryColor'], v)}
              isEditMode={isEditMode}
            />
            <EditableColor
              label="Couleur d'Accentuation"
              value={content.theme.accentColor}
              onChange={(v) => updateContent(['theme', 'accentColor'], v)}
              isEditMode={isEditMode}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
