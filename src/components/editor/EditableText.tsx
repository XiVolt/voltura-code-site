"use client";
import React, { useState } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  isEditMode: boolean;
}

/**
 * Composant pour éditer du texte inline
 * Affiche un input quand on clique en mode édition
 */
export default function EditableText({ 
  value, 
  onChange, 
  tag = 'p', 
  className = '',
  isEditMode 
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const Tag = tag;

  const handleClick = () => {
    if (isEditMode) {
      setIsEditing(true);
      setTempValue(value);
    }
  };

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="relative">
        {tag === 'p' ? (
          <textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} border-2 border-electric-blue rounded px-2 py-1 w-full`}
            autoFocus
            rows={3}
          />
        ) : (
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} border-2 border-electric-blue rounded px-2 py-1 w-full`}
            autoFocus
          />
        )}
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
          >
            ✓ Valider
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
          >
            ✗ Annuler
          </button>
        </div>
      </div>
    );
  }

  return (
    <Tag
      onClick={handleClick}
      className={`${className} ${isEditMode ? 'cursor-pointer hover:bg-yellow-100 hover:outline hover:outline-2 hover:outline-yellow-400 transition-all' : ''}`}
      title={isEditMode ? 'Cliquer pour éditer' : ''}
    >
      {value}
    </Tag>
  );
}
