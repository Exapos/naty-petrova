'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useEditorStore } from '@/stores/editorStore';
import { BlockRenderer } from './index';
import { motion } from 'framer-motion';
import { Section, Row, Column } from '@/types/editor';
import { PlusIcon, DocumentTextIcon, Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Resize Handle Component
function ResizeHandle({
  onResize,
  className = ""
}: {
  onResize: (delta: number) => void;
  className?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number>(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startXRef.current = e.clientX;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startXRef.current;
      onResize(delta);
      startXRef.current = e.clientX;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onResize]);

  return (
    <div
      className={`absolute right-0 top-0 bottom-0 w-1 bg-gray-300 hover:bg-blue-400 cursor-col-resize transition-colors z-10 ${className} ${
        isDragging ? 'bg-blue-500' : ''
      }`}
      onMouseDown={handleMouseDown}
    >
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-6 bg-white border border-gray-300 rounded shadow-sm flex items-center justify-center">
        <div className="flex flex-col space-y-0.5">
          <div className="w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
          <div className="w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
          <div className="w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

function SectionRenderer({ section }: { section: Section }) {
  const { selectedSection, selectSection, addRow } = useEditorStore();

  const isSelected = selectedSection === section.id;

  return (
    <motion.div
      layout
      className={`relative group mb-8 bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 overflow-hidden ${
        isSelected
          ? 'border-blue-400 shadow-blue-100'
          : 'border-gray-100 hover:border-gray-200 hover:shadow-xl'
      }`}
      onClick={() => selectSection(section.id)}
    >
      {/* Section Header with Inline Toolbar */}
      <div className={`px-6 py-4 border-b transition-colors ${
        isSelected ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full transition-colors ${
              isSelected ? 'bg-blue-500' : 'bg-gray-400'
            }`} />
            <h3 className="text-sm font-medium text-gray-900">Sekce</h3>
          </div>

          {/* Section Toolbar */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                addRow(section.id);
              }}
              className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs font-medium"
            >
              <PlusIcon className="w-3 h-3" />
              <span>Přidat řádek</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Open section settings (background, padding, etc.)
              }}
              className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
              title="Nastavení sekce"
            >
              <Cog6ToothIcon className="w-3 h-3" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div className="p-6">
        {section.rows.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DocumentTextIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">Žádné řádky v této sekci</p>
            <p className="text-gray-400 text-xs mt-1">Klikněte na &quot;Přidat řádek&quot; pro začátek</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {section.rows.map((row) => (
              <RowRenderer key={row.id} sectionId={section.id} row={row} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function RowRenderer({ sectionId, row }: { sectionId: string; row: Row }) {
  const { selectedRow, selectRow, selectColumn, addColumn, deleteColumn, resizeColumn } = useEditorStore();

  const isSelected = selectedRow === row.id;

  const handleResize = useCallback((columnIndex: number, delta: number) => {
    const containerWidth = 800; // Approximate container width
    const deltaPercent = (delta / containerWidth) * 100;

    // Resize current column and adjust the next one
    const currentColumn = row.columns[columnIndex];
    const nextColumn = row.columns[columnIndex + 1];

    if (currentColumn && nextColumn) {
      const newCurrentWidth = Math.max(10, Math.min(90, currentColumn.width + deltaPercent));
      const newNextWidth = Math.max(10, Math.min(90, nextColumn.width - deltaPercent));

      resizeColumn(sectionId, row.id, currentColumn.id, newCurrentWidth);
      resizeColumn(sectionId, row.id, nextColumn.id, newNextWidth);
    }
  }, [sectionId, row, resizeColumn]);

  const handleDeleteColumn = useCallback((columnId: string) => {
    deleteColumn(sectionId, row.id, columnId);
  }, [sectionId, row.id, deleteColumn]);

  return (
    <motion.div
      layout
      className={`relative group rounded-xl border-2 transition-all duration-300 overflow-hidden ${
        isSelected
          ? 'border-purple-400 bg-purple-50/50'
          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/30'
      }`}
      onClick={() => selectRow(row.id)}
      style={{ zIndex: isSelected ? 20 : undefined }}
    >
      {/* Row Header with Inline Toolbar */}
      <div className={`px-4 py-3 border-b transition-colors ${isSelected ? 'bg-purple-100 border-purple-200' : 'bg-gray-50 border-gray-100'}`} style={{ position: 'relative', zIndex: 30 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full transition-colors ${isSelected ? 'bg-purple-500' : 'bg-gray-400'}`} />
            <span className="text-xs font-medium text-gray-700">Řádek</span>
          </div>

          {/* Row Toolbar */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                addColumn(sectionId, row.id);
              }}
              className="flex items-center space-x-1 px-2 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-xs"
              style={{ zIndex: 40, position: 'relative' }}
            >
              <PlusIcon className="w-3 h-3" />
              <span>Sloupec</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Open row settings
              }}
              className="p-1 text-gray-500 hover:text-purple-600 hover:bg-purple-100 rounded transition-colors"
              title="Nastavení řádku"
            >
              <Cog6ToothIcon className="w-3 h-3" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Row Content - Flexbox with resizable columns */}
      <div className="p-4">
        <div className="flex gap-0 min-h-[200px] relative">
          {row.columns.map((column, index) => (
            <React.Fragment key={column.id}>
              <div
                className="flex-1 relative"
                style={{ flexBasis: `${column.width}%` }}
              >
                <ColumnRenderer
                  sectionId={sectionId}
                  rowId={row.id}
                  column={column}
                  columnIndex={index}
                  totalColumns={row.columns.length}
                  onDelete={() => handleDeleteColumn(column.id)}
                />
              </div>

              {/* Resize Handle - not on last column */}
              {index < row.columns.length - 1 && (
                <ResizeHandle
                  onResize={(delta) => handleResize(index, delta)}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ColumnRenderer({
  sectionId,
  rowId,
  column,
  columnIndex,
  totalColumns,
  onDelete
}: {
  sectionId: string;
  rowId: string;
  column: Column;
  columnIndex: number;
  totalColumns: number;
  onDelete?: () => void;
}) {
  const { selectedColumn, selectColumn } = useEditorStore();

  const isSelected = selectedColumn === column.id;

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: {
      type: 'column',
      sectionId,
      rowId,
      columnId: column.id,
    },
  });

  return (
    <motion.div
      layout
      className={`relative group min-h-32 rounded-lg border-2 transition-all duration-300 overflow-hidden ${
        isSelected
          ? 'border-green-400 bg-green-50/50 ring-2 ring-green-200'
          : 'border-gray-200 hover:border-green-300 hover:bg-green-50/30'
      } ${isOver ? 'ring-2 ring-blue-300 bg-blue-50/30' : ''}`}
      onClick={() => selectColumn(column.id)}
      ref={setNodeRef}
    >
      {/* Column Header with Toolbar */}
      <div className={`px-3 py-2 border-b transition-colors flex items-center justify-between ${
        isSelected ? 'bg-green-100 border-green-200' : 'bg-gray-50 border-gray-100'
      }`}>
        <div className="flex items-center space-x-2">
          <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
            isSelected ? 'bg-green-500' : 'bg-gray-400'
          }`} />
          <span className="text-xs font-medium text-gray-700">Sloupec</span>
        </div>

        {/* Column Toolbar */}
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-500">{column.width}%</span>
          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Smazat sloupec"
            >
              <XMarkIcon className="w-3 h-3" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Column Content with Snap Grid */}
      <div className="p-3 relative min-h-[150px]">
        {/* Snap Grid Background */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #6b7280 1px, transparent 1px),
              linear-gradient(to bottom, #6b7280 1px, transparent 1px)
            `,
            backgroundSize: '16px 16px',
          }}
        />

        {column.blocks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center relative z-10"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <PlusIcon className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">Přetáhněte bloky sem</p>
            <p className="text-gray-400 text-xs mt-1">nebo použijte postranní panel</p>
          </motion.div>
        ) : (
          <div className="space-y-3 relative z-10">
            {column.blocks.map((block) => {
              const columnSpan = block.columnSpan || 1;
              const maxAvailableColumns = totalColumns - columnIndex;
              const actualSpan = Math.min(columnSpan, maxAvailableColumns);

              return (
                <div
                  key={block.id}
                  className="relative"
                  style={{
                    width: actualSpan > 1 ? `calc(${actualSpan * 100}% + ${(actualSpan - 1) * 1}rem)` : '100%', // Account for gap
                    marginRight: actualSpan > 1 ? `-${(actualSpan - 1) * 1}rem` : '0', // Negative margin to span gaps
                    zIndex: actualSpan > 1 ? 10 : 'auto', // Higher z-index for spanning blocks
                  }}
                >
                  <BlockRenderer
                    block={block}
                    columnSpan={actualSpan}
                    onColumnSpanChange={(newSpan) => {
                      // Update block's columnSpan
                      const { updateBlock } = useEditorStore.getState();
                      updateBlock(block.id, { columnSpan: newSpan });
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function EditorCanvas() {
  const { sections, isPreviewMode, addSection } = useEditorStore();

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });

  if (isPreviewMode) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {sections.map((section) => (
          <div key={section.id} className="space-y-6" style={section.styles}>
            {section.rows.map((row) => {
              // Collect all blocks with their positions
              const allBlocks: Array<{ block: any; columnIndex: number; localBlockIndex: number }> = [];
              row.columns.forEach((column, columnIndex) => {
                column.blocks.forEach((block, blockIndex) => {
                  allBlocks.push({ block, columnIndex, localBlockIndex: blockIndex });
                });
              });

              // Calculate grid positions to avoid overlaps
              const gridPositions: Array<{ row: number; col: number; span: number }> = [];
              let currentRow = 1;

              allBlocks.forEach(({ block, columnIndex }) => {
                const span = Math.min(block.columnSpan || 1, row.columns.length - columnIndex);

                // Find a row where this block can fit
                let placed = false;
                while (!placed) {
                  // Check if this position conflicts with existing blocks
                  const conflicts = gridPositions.some(pos =>
                    pos.row === currentRow &&
                    pos.col < columnIndex + span &&
                    pos.col + pos.span > columnIndex
                  );

                  if (!conflicts) {
                    gridPositions.push({ row: currentRow, col: columnIndex, span });
                    placed = true;
                  } else {
                    currentRow++;
                  }
                }
              });

              // Calculate grid template columns
              const gridTemplateColumns = row.columns.map(col => `${col.width}%`).join(' ');

              return (
                <div key={row.id} className="grid gap-4" style={{
                  ...row.styles,
                  gridTemplateColumns,
                  gridAutoRows: 'minmax(100px, auto)'
                }}>
                  {allBlocks.map(({ block, columnIndex }, index) => {
                    const span = Math.min(block.columnSpan || 1, row.columns.length - columnIndex);
                    const position = gridPositions[index];

                    return (
                      <div
                        key={block.id}
                        className="w-full"
                        style={{
                          gridColumn: `span ${span}`,
                          gridRow: position.row,
                        }}
                      >
                        <BlockRenderer
                          block={block}
                          columnSpan={span}
                          onColumnSpanChange={(newSpan) => {
                            // Update the block's columnSpan
                            const { updateBlock } = useEditorStore.getState();
                            updateBlock(block.id, { columnSpan: newSpan });
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div
        ref={setNodeRef}
        className={`min-h-full p-8 transition-all duration-300 ${
          isOver ? 'bg-blue-50/50' : ''
        }`}
      >
        {sections.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <DocumentTextIcon className="w-12 h-12 text-blue-500" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Začněte vytvářet článek</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Klikněte na tlačítko &quot;+&quot; v pravém dolním rohu pro přidání první sekce
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addSection()}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Vytvořit první sekci</span>
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {sections.map((section) => (
              <SectionRenderer key={section.id} section={section} />
            ))}
          </div>
        )}

        {/* Drop Indicator */}
        {isOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-8 border-4 border-dashed border-blue-400 bg-blue-50/20 rounded-3xl pointer-events-none flex items-center justify-center"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
              <p className="text-blue-700 font-medium">Pusťte blok zde</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}