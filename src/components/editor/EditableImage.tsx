"use client";
import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface EditableImageProps {
  value: string;
  onChange: (value: string) => void;
  alt?: string;
  className?: string;
  isEditMode: boolean;
}

/**
 * Composant pour éditer une image
 * Permet de changer l'URL de l'image en mode édition
 */
export default function EditableImage({ 
  value, 
  onChange, 
  alt = 'Image',
  className = '',
  isEditMode 
}: EditableImageProps) {
  const [showInput, setShowInput] = useState(false);
  const [tempUrl, setTempUrl] = useState(value);

  const handleSave = () => {
    onChange(tempUrl);
    setShowInput(false);
  };

  const handleCancel = () => {
    setTempUrl(value);
    setShowInput(false);
  };

  return (
    <div className="relative group">
      <img 
        src={value} 
        alt={alt} 
        className={`${className} ${isEditMode ? 'ring-2 ring-yellow-400' : ''}`}
      />
      
      {isEditMode && (
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => setShowInput(true)}
            className="bg-white text-anthracite px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100"
          >
            <Upload size={18} />
            Changer l'image
          </button>
        </div>
      )}

      {showInput && (
        <div className="absolute top-0 left-0 right-0 bg-white p-4 shadow-lg rounded-lg z-10">
          <label className="block text-sm font-medium mb-2">URL de l'image:</label>
          <input
            type="text"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
            placeholder="https://exemple.com/image.jpg"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              ✓ Valider
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              ✗ Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
