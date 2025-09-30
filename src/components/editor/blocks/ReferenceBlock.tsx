'use client';

import React from 'react';
import { Block } from '@/types/editor';

interface ReferenceBlockProps {
  block: Block;
  isEditing: boolean;
}

export function ReferenceBlock({ block }: ReferenceBlockProps) {
  const projects = block.content.projects || [];

  return (
    <div className="w-full h-full bg-white rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        {block.content.title || 'Naše reference'}
      </h3>

      {projects.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-2">🏗️</div>
          <p>Žádné reference zatím</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900">{project.title || `Projekt ${index + 1}`}</h4>
              <p className="text-sm text-gray-600 mt-1">{project.description || 'Popis projektu...'}</p>
              {project.image && (
                <div className="mt-2">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}