'use client';

import React from 'react';
import { Block } from '@/types/editor';

interface ContactBlockProps {
  block: Block;
  isEditing: boolean;
}

export function ContactBlock({ block }: ContactBlockProps) {
  return (
    <div className="w-full h-full bg-gray-50 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {block.content.title || 'Kontaktujte nás'}
      </h3>

      {block.content.showForm && (
        <form className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Vaše jméno"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Váš email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <textarea
              placeholder="Vaše zpráva"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Odeslat
          </button>
        </form>
      )}

      <div className="mt-6 space-y-2 text-sm text-gray-600">
        <p>📞 +420 123 456 789</p>
        <p>📧 info@naty-petrova.cz</p>
        <p>📍 Praha, Česká republika</p>
      </div>
    </div>
  );
}