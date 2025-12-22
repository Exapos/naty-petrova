'use client';

import React from 'react';
import { Block } from '../../../types/editor';

interface TableBlockProps {
  block: Block;
  isEditing: boolean;
}

export function TableBlock({ block }: TableBlockProps) {
  const {
    rows = [
      ['Nadpis 1', 'Nadpis 2', 'Nadpis 3'],
      ['Řádek 1', 'Data 1', 'Data 2'],
      ['Řádek 2', 'Data 3', 'Data 4'],
    ],
    hasHeader = true,
    borderStyle = 'border',
    cellPadding = '8px',
  } = block.content || {};

  const normalizedRows: string[][] = Array.isArray(rows)
    ? rows.map((row: any) => (Array.isArray(row) ? row.map((cell: any) => String(cell ?? '')) : [String(row ?? '')]))
    : [];

  return (
    <div className="w-full overflow-x-auto">
      <table
        className={`w-full ${borderStyle === 'border' ? 'border border-gray-300' : ''}`}
        style={{ borderCollapse: 'collapse' }}
      >
        <tbody>
          {normalizedRows.map((row: string[], rowIndex: number) => (
            <tr key={rowIndex} className={borderStyle === 'border' ? 'border-b border-gray-300' : ''}>
              {row.map((cell: string, cellIndex: number) => {
                const isHeader = hasHeader && rowIndex === 0;
                const CellTag = isHeader ? 'th' : 'td';

                return (
                  <CellTag
                    key={cellIndex}
                    className={`${
                      borderStyle === 'border' ? 'border-r border-gray-300 last:border-r-0' : ''
                    } ${
                      isHeader
                        ? 'bg-gray-50 font-semibold text-gray-900'
                        : 'text-gray-700'
                    }`}
                    style={{
                      padding: cellPadding,
                      textAlign: 'left',
                    }}
                  >
                    {cell || '\u00A0'}
                  </CellTag>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}