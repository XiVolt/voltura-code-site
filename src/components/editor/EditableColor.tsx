"use client";
import React from 'react';

interface EditableColorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  isEditMode: boolean;
}

/**
 * Composant pour éditer une couleur
 * Affiche un color picker en mode édition
 */
export default function EditableColor({ 
  value, 
  onChange, 
  label = 'Couleur',
  isEditMode 
}: EditableColorProps) {
  
  if (!isEditMode) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 bg-white border border-gray-300 rounded px-3 py-2 shadow-sm">
      <label className="text-sm font-medium text-gray-700">{label}:</label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-8 rounded cursor-pointer border border-gray-300"
      />
      <span className="text-xs text-gray-500 font-mono">{value}</span>
    </div>
  );
}
