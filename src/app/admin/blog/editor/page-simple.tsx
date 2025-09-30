'use client';

import React from 'react';

export default function BlogEditorPage() {
  return (
    <div className="h-screen flex bg-gray-50">
      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-gray-900">Blog Editor</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Uložit článek
          </button>
        </div>

        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 min-h-[600px]">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Nový článek</h2>
              <p className="text-gray-600 mb-8">
                Zde bude drag-and-drop editor pro tvorbu článků.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">📄</div>
                <p className="text-gray-500">Přetáhněte bloky sem</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}