import { create } from 'zustand';
import { EditorState, Block, Section, Row, Column } from '@/types/editor';

interface EditorStore extends EditorState {
  // Section management
  addSection: (section?: Partial<Section>) => void;
  updateSection: (id: string, updates: Partial<Section>) => void;
  deleteSection: (id: string) => void;
  duplicateSection: (id: string) => void;

  // Row management
  addRow: (sectionId: string, row?: Partial<Row>) => void;
  updateRow: (sectionId: string, rowId: string, updates: Partial<Row>) => void;
  deleteRow: (sectionId: string, rowId: string) => void;

  // Column management
  addColumn: (sectionId: string, rowId: string, column?: Partial<Column>) => void;
  updateColumn: (sectionId: string, rowId: string, columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (sectionId: string, rowId: string, columnId: string) => void;
  resizeColumn: (sectionId: string, rowId: string, columnId: string, newWidth: number) => void;

  // Block management
  addBlock: (sectionId: string, rowId: string, columnId: string, block: Omit<Block, 'id'>) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  moveBlock: (blockId: string, targetSectionId: string, targetRowId: string, targetColumnId: string) => void;

  // Selection
  selectBlock: (id: string | null) => void;
  selectColumn: (id: string | null) => void;
  selectRow: (id: string | null) => void;
  selectSection: (id: string | null) => void;

  // History management
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;

  // UI state
  setPreviewMode: (isPreview: boolean) => void;
  updateGlobalStyles: (styles: Partial<EditorState['globalStyles']>) => void;
  setGridSize: (size: 8 | 16 | 32) => void;
  toggleGrid: () => void;

  // Style presets
  saveStylePreset: (preset: Omit<import('@/types/editor').StylePreset, 'id'>) => void;
  loadStylePreset: (presetId: string) => void;
  deleteStylePreset: (presetId: string) => void;

  // Custom colors
  addCustomColor: (color: string) => void;
  removeCustomColor: (color: string) => void;

  // Utility
  getBlockById: (id: string) => Block | undefined;
  getColumnById: (id: string) => { section: Section; row: Row; column: Column } | undefined;
  exportToJSON: () => string;
  publishArticle: () => Promise<void>;
  saveDraft: () => Promise<void>;
}

const initialState: EditorState = {
  sections: [],
  selectedBlock: null,
  selectedColumn: null,
  selectedRow: null,
  selectedSection: null,
  isPreviewMode: false,
  history: [],
  historyIndex: -1,
  gridSize: 16,
  showGrid: true,
  globalStyles: {
    primaryColor: '#1f2937',
    secondaryColor: '#3b82f6',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    spacingUnit: 8,
    borderRadius: '0.5rem',
  },
  stylePresets: [],
  customColors: ['#1f2937', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  ...initialState,

  // Section management
  addSection: (section = {}) => {
    const newSection: Section = {
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      rows: [],
      styles: {
        backgroundColor: '#ffffff',
        padding: '2rem 0',
      },
      ...section,
    };

    set((state) => ({
      sections: [...state.sections, newSection],
      selectedSection: newSection.id,
    }));

    // Automatically add a row with a column to the new section
    const newRowId = `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newColumnId = `column-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newRow: Row = {
      id: newRowId,
      columns: [{
        id: newColumnId,
        width: 100,
        blocks: [],
        styles: {
          padding: '1rem',
        },
        responsive: {
          desktop: { width: 100 },
          tablet: { width: 100 },
          mobile: { width: 100 },
        },
      }],
      styles: {
        padding: '0 1rem',
        minHeight: 'auto',
      },
    };

    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === newSection.id
          ? { ...section, rows: [newRow] }
          : section
      ),
      selectedRow: newRowId,
      selectedColumn: newColumnId,
    }));

    // Automatically add a test block to the new column
    const testBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'text',
      content: { text: 'Vítejte v editoru! Toto je testovací blok.' },
      styles: {
        backgroundColor: 'transparent',
        textColor: '#1f2937',
        padding: '1rem',
        margin: '0',
        borderRadius: '0.5rem',
      },
      columnSpan: 1,
      responsive: {
        desktop: {
          backgroundColor: 'transparent',
          textColor: '#1f2937',
          padding: '1rem',
          margin: '0',
          borderRadius: '0.5rem',
          columnSpan: 1,
        },
        tablet: {
          backgroundColor: 'transparent',
          textColor: '#1f2937',
          padding: '0.75rem',
          margin: '0',
          borderRadius: '0.5rem',
          columnSpan: 1,
        },
        mobile: {
          backgroundColor: 'transparent',
          textColor: '#1f2937',
          padding: '0.5rem',
          margin: '0',
          borderRadius: '0.5rem',
          columnSpan: 1,
        },
      },
    };

    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === newSection.id
          ? {
              ...section,
              rows: section.rows.map((row) =>
                row.id === newRowId
                  ? {
                      ...row,
                      columns: row.columns.map((column) =>
                        column.id === newColumnId
                          ? { ...column, blocks: [testBlock] }
                          : column
                      ),
                    }
                  : row
              ),
            }
          : section
      ),
      selectedBlock: testBlock.id,
    }));

    get().saveToHistory();
  },

  updateSection: (id, updates) => {
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === id ? { ...section, ...updates } : section
      ),
    }));

    get().saveToHistory();
  },

  deleteSection: (id) => {
    set((state) => ({
      sections: state.sections.filter((section) => section.id !== id),
      selectedSection: state.selectedSection === id ? null : state.selectedSection,
    }));

    get().saveToHistory();
  },

  duplicateSection: (id) => {
    const section = get().sections.find((s) => s.id === id);
    if (!section) return;

    const duplicatedSection: Section = {
      ...section,
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      rows: section.rows.map((row) => ({
        ...row,
        id: `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        columns: row.columns.map((column) => ({
          ...column,
          id: `column-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          blocks: column.blocks.map((block) => ({
            ...block,
            id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          })),
        })),
      })),
    };

    set((state) => ({
      sections: [...state.sections, duplicatedSection],
      selectedSection: duplicatedSection.id,
    }));

    get().saveToHistory();
  },

  // Row management
  addRow: (sectionId, row = {}) => {
    const newRow: Row = {
      id: `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      columns: [],
      styles: {
        padding: '0 1rem',
        minHeight: 'auto',
      },
      ...row,
    };

    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? { ...section, rows: [...section.rows, newRow] }
          : section
      ),
      selectedRow: newRow.id,
    }));

    // Automatically add a column to the new row
    const newColumnId = `column-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newColumn = {
      id: newColumnId,
      width: 100,
      blocks: [],
      styles: {
        padding: '1rem',
      },
      responsive: {
        desktop: { width: 100 },
        tablet: { width: 100 },
        mobile: { width: 100 },
      },
    };

    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              rows: section.rows.map((row) =>
                row.id === newRow.id
                  ? { ...row, columns: [newColumn] }
                  : row
              ),
            }
          : section
      ),
      selectedColumn: newColumnId,
    }));

    get().saveToHistory();
  },

  updateRow: (sectionId, rowId, updates) => {
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              rows: section.rows.map((row) =>
                row.id === rowId ? { ...row, ...updates } : row
              ),
            }
          : section
      ),
    }));

    get().saveToHistory();
  },

  deleteRow: (sectionId, rowId) => {
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? { ...section, rows: section.rows.filter((row) => row.id !== rowId) }
          : section
      ),
      selectedRow: state.selectedRow === rowId ? null : state.selectedRow,
    }));

    get().saveToHistory();
  },

  // Column management
  addColumn: (sectionId, rowId, column = {}) => {
    const state = get();
    const section = state.sections.find((s) => s.id === sectionId);
    const row = section?.rows.find((r) => r.id === rowId);
    if (!row) return;

    const currentColumnCount = row.columns.length;
    const newColumnCount = currentColumnCount + 1;
    const equalWidth = Math.floor(100 / newColumnCount);

    const newColumn: Column = {
      id: `column-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      width: equalWidth,
      blocks: [],
      styles: {
        padding: '1rem',
      },
      responsive: {
        desktop: { width: equalWidth },
        tablet: { width: equalWidth },
        mobile: { width: 100 },
      },
      ...column,
    };

    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              rows: section.rows.map((row) =>
                row.id === rowId
                  ? {
                      ...row,
                      columns: [
                        ...row.columns.map((col) => ({ ...col, width: equalWidth })),
                        newColumn
                      ]
                    }
                  : row
              ),
            }
          : section
      ),
      selectedColumn: newColumn.id,
    }));

    get().saveToHistory();
  },

  updateColumn: (sectionId, rowId, columnId, updates) => {
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              rows: section.rows.map((row) =>
                row.id === rowId
                  ? {
                      ...row,
                      columns: row.columns.map((column) =>
                        column.id === columnId ? { ...column, ...updates } : column
                      ),
                    }
                  : row
              ),
            }
          : section
      ),
    }));

    get().saveToHistory();
  },

  deleteColumn: (sectionId, rowId, columnId) => {
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              rows: section.rows.map((row) =>
                row.id === rowId
                  ? { ...row, columns: row.columns.filter((column) => column.id !== columnId) }
                  : row
              ),
            }
          : section
      ),
      selectedColumn: state.selectedColumn === columnId ? null : state.selectedColumn,
    }));

    get().saveToHistory();
  },

  resizeColumn: (sectionId, rowId, columnId, newWidth) => {
    // Ensure total width doesn't exceed 100%
    const state = get();
    const section = state.sections.find((s) => s.id === sectionId);
    const row = section?.rows.find((r) => r.id === rowId);
    if (!row) return;

    const clampedWidth = Math.max(10, Math.min(90, newWidth)); // Min 10%, max 90%

    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              rows: section.rows.map((row) =>
                row.id === rowId
                  ? {
                      ...row,
                      columns: row.columns.map((column) =>
                        column.id === columnId ? { ...column, width: clampedWidth } : column
                      ),
                    }
                  : row
              ),
            }
          : section
      ),
    }));

    get().saveToHistory();
  },

  // Block management
  addBlock: (sectionId, rowId, columnId, blockData) => {
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: blockData.type,
      content: blockData.content,
      styles: blockData.styles || {},
      columnSpan: blockData.columnSpan || 1,
      responsive: blockData.responsive || {
        desktop: {},
        tablet: {},
        mobile: {},
      },
    };

    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              rows: section.rows.map((row) =>
                row.id === rowId
                  ? {
                      ...row,
                      columns: row.columns.map((column) =>
                        column.id === columnId
                          ? { ...column, blocks: [...column.blocks, newBlock] }
                          : column
                      ),
                    }
                  : row
              ),
            }
          : section
      ),
      selectedBlock: newBlock.id,
    }));

    get().saveToHistory();
  },

  updateBlock: (id, updates) => {
    set((state) => ({
      sections: state.sections.map((section) => ({
        ...section,
        rows: section.rows.map((row) => ({
          ...row,
          columns: row.columns.map((column) => ({
            ...column,
            blocks: column.blocks.map((block) =>
              block.id === id ? { ...block, ...updates } : block
            ),
          })),
        })),
      })),
    }));

    get().saveToHistory();
  },

  deleteBlock: (id) => {
    set((state) => ({
      sections: state.sections.map((section) => ({
        ...section,
        rows: section.rows.map((row) => ({
          ...row,
          columns: row.columns.map((column) => ({
            ...column,
            blocks: column.blocks.filter((block) => block.id !== id),
          })),
        })),
      })),
      selectedBlock: state.selectedBlock === id ? null : state.selectedBlock,
    }));

    get().saveToHistory();
  },

  duplicateBlock: (id) => {
    const { sections } = get();
    let sourceBlock: Block | undefined;

    // Find the block
    for (const section of sections) {
      for (const row of section.rows) {
        for (const column of row.columns) {
          sourceBlock = column.blocks.find((b) => b.id === id);
          if (sourceBlock) break;
        }
        if (sourceBlock) break;
      }
      if (sourceBlock) break;
    }

    if (!sourceBlock) return;

    const duplicatedBlock: Block = {
      ...sourceBlock,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    // Add to the same column after the original block
    set((state) => ({
      sections: state.sections.map((section) => ({
        ...section,
        rows: section.rows.map((row) => ({
          ...row,
          columns: row.columns.map((column) => ({
            ...column,
            blocks: column.blocks.reduce((acc, block) => {
              if (block.id === id) {
                acc.push(block, duplicatedBlock);
              } else {
                acc.push(block);
              }
              return acc;
            }, [] as Block[]),
          })),
        })),
      })),
      selectedBlock: duplicatedBlock.id,
    }));

    get().saveToHistory();
  },

  moveBlock: (blockId, targetSectionId, targetRowId, targetColumnId) => {
    const { sections } = get();
    let blockToMove: Block | undefined;

    // Find and remove the block
    const newSections = sections.map((section) => ({
      ...section,
      rows: section.rows.map((row) => ({
        ...row,
        columns: row.columns.map((column) => ({
          ...column,
          blocks: column.blocks.filter((block) => {
            if (block.id === blockId) {
              blockToMove = block;
              return false;
            }
            return true;
          }),
        })),
      })),
    }));

    if (!blockToMove) return;

    // Add to target column
    set({
      sections: newSections.map((section) =>
        section.id === targetSectionId
          ? {
              ...section,
              rows: section.rows.map((row) =>
                row.id === targetRowId
                  ? {
                      ...row,
                      columns: row.columns.map((column) =>
                        column.id === targetColumnId
                          ? { ...column, blocks: [...column.blocks, blockToMove!] }
                          : column
                      ),
                    }
                  : row
              ),
            }
          : section
      ),
    });

    get().saveToHistory();
  },

  // Selection
  selectBlock: (id) => {
    set({ selectedBlock: id });
  },

  selectColumn: (id) => {
    set({ selectedColumn: id });
  },

  selectRow: (id) => {
    set({ selectedRow: id });
  },

  selectSection: (id) => {
    set({ selectedSection: id });
  },

  // History management
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      set({
        sections: previousState,
        historyIndex: historyIndex - 1,
        selectedBlock: null,
        selectedColumn: null,
        selectedRow: null,
        selectedSection: null,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      set({
        sections: nextState,
        historyIndex: historyIndex + 1,
        selectedBlock: null,
        selectedColumn: null,
        selectedRow: null,
        selectedSection: null,
      });
    }
  },

  saveToHistory: () => {
    const { sections, history, historyIndex } = get();

    // Remove any history after current index (for when user makes new changes after undo)
    const newHistory = history.slice(0, historyIndex + 1);

    // Add current state to history
    newHistory.push(JSON.parse(JSON.stringify(sections)));

    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // UI state
  setPreviewMode: (isPreview) => {
    set({ isPreviewMode: isPreview });
  },

  updateGlobalStyles: (styles) => {
    set((state) => ({
      globalStyles: { ...state.globalStyles, ...styles },
    }));
  },

  setGridSize: (size) => {
    set({ gridSize: size });
  },

  toggleGrid: () => {
    set((state) => ({ showGrid: !state.showGrid }));
  },

  // Style presets
  saveStylePreset: (preset) => {
    const newPreset = {
      ...preset,
      id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    set((state) => ({
      stylePresets: [...state.stylePresets, newPreset],
    }));
  },

  loadStylePreset: (presetId) => {
    const preset = get().stylePresets.find((p) => p.id === presetId);
    if (preset) {
      set((state) => ({
        globalStyles: {
          ...state.globalStyles,
          primaryColor: preset.colors.primary,
          secondaryColor: preset.colors.secondary,
          fontFamily: preset.typography.fontFamily,
          fontSize: preset.typography.fontSize,
          spacingUnit: preset.spacing,
          borderRadius: preset.borderRadius,
        },
      }));
    }
  },

  deleteStylePreset: (presetId) => {
    set((state) => ({
      stylePresets: state.stylePresets.filter((p) => p.id !== presetId),
    }));
  },

  // Custom colors
  addCustomColor: (color) => {
    set((state) => ({
      customColors: [...state.customColors, color],
    }));
  },

  removeCustomColor: (color) => {
    set((state) => ({
      customColors: state.customColors.filter((c) => c !== color),
    }));
  },

  // Utility
  getBlockById: (id) => {
    const { sections } = get();
    for (const section of sections) {
      for (const row of section.rows) {
        for (const column of row.columns) {
          const block = column.blocks.find((b) => b.id === id);
          if (block) return block;
        }
      }
    }
    return undefined;
  },

  getColumnById: (id) => {
    const { sections } = get();
    for (const section of sections) {
      for (const row of section.rows) {
        const column = row.columns.find((c) => c.id === id);
        if (column) return { section, row, column };
      }
    }
    return undefined;
  },

  exportToJSON: () => {
    const state = get();
    return JSON.stringify({
      sections: state.sections,
      globalStyles: state.globalStyles,
      exportedAt: new Date().toISOString(),
    }, null, 2);
  },

  publishArticle: async () => {
    // TODO: Implement API call to publish article
    console.log('Publishing article...');
  },

  saveDraft: async () => {
    // TODO: Implement API call to save draft
    console.log('Saving draft...');
  },
}));