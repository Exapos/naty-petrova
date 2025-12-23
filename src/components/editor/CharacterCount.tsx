'use client';

import React from 'react';
import { FileText, Hash, Clock } from 'lucide-react';

interface CharacterCountProps {
  characters: number;
  words: number;
  limit?: number;
}

export function CharacterCount({ characters, words, limit }: CharacterCountProps) {
  const percentage = limit ? Math.round((characters / limit) * 100) : 0;
  const isNearLimit = limit && percentage > 80;
  const isOverLimit = limit && percentage > 100;

  // Estimate reading time (average 200 words per minute)
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
      <div className="flex items-center gap-1.5">
        <Hash size={14} />
        <span>{characters.toLocaleString('cs-CZ')} znaků</span>
        {limit && (
          <span className={`${isOverLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : ''}`}>
            / {limit.toLocaleString('cs-CZ')}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-1.5">
        <FileText size={14} />
        <span>{words.toLocaleString('cs-CZ')} slov</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <Clock size={14} />
        <span>~{readingTime} min čtení</span>
      </div>

      {limit && (
        <div className="flex-1 flex justify-end">
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                isOverLimit
                  ? 'bg-red-500'
                  : isNearLimit
                  ? 'bg-yellow-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CharacterCount;
