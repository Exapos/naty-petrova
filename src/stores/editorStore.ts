import { create } from 'zustand';
import { EditorState, Block, BlockStyles, MediaAsset } from '@/types/editor';

interface EditorStore extends EditorState {
  // Block management
  addBlock: (block: Omit<Block, 'id'>, index?: number) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  moveBlock: (blockId: string, newIndex: number) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;

  // Selection
  selectBlock: (id: string | null) => void;

  // History management
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;

  // UI state
  setPreviewMode: (isPreview: boolean) => void;
  setResponsiveMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  updateGlobalStyles: (styles: Partial<EditorState['globalStyles']>) => void;
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
  exportToJSON: () => string;
  importFromJSON: (json: string) => void;
  publishArticle: () => Promise<void>;
  saveDraft: () => Promise<void>;
  setTitle: (title: string) => void;
  setSlug: (slug: string) => void;
  setFeaturedImage: (url: string | null) => void;
  loadMediaAssets: () => Promise<void>;
  mediaAssets: MediaAsset[];
  setState: (state: Partial<EditorState>) => void;
}

const initialState: EditorState = {
  blocks: [],
  selectedBlock: null,
  isPreviewMode: false,
  responsiveMode: 'desktop',
  history: [],
  historyIndex: -1,
  showGrid: true,
  globalStyles: {
    primaryColor: '#1f2937',
    secondaryColor: '#3b82f6',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    spacingUnit: 8,
    borderRadius: '0.5rem',
    logo: undefined,
    brandFont: undefined,
  },
  stylePresets: [],
  customColors: ['#1f2937', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  mediaAssets: [],
  title: '',
  slug: '',
  featuredImage: null,
  isSaving: false,
  lastSavedAt: null,
  status: 'draft',
  versions: [],
  lastError: null,
  postId: null,
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const getDefaultStyles = (): BlockStyles => ({
  backgroundColor: 'transparent',
  textColor: '#1f2937',
  padding: '1rem',
  margin: '0.5rem 0',
  borderRadius: '0.5rem',
});

async function postArticle({ state, published }: { state: EditorState; published: boolean }) {
  const body = {
    title: state.title || 'Bez názvu',
    slug: state.slug || slugify(state.title || 'bez-nazvu'),
    featuredImage: state.featuredImage,
    content: JSON.stringify({ blocks: state.blocks, globalStyles: state.globalStyles }),
    published,
    editorMode: 'block' as const,
  };

  const hasId = Boolean(state.postId);
  const url = hasId ? `/api/blog/${state.postId}` : '/api/blog';
  const method = hasId ? 'PUT' : 'POST';

  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.error || 'Failed to persist article');
  }

  return response.json();
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  ...initialState,

  addBlock: (blockData, index) => {
    const newBlock: Block = {
      id: generateId(),
      type: blockData.type,
      layout: blockData.layout,
      content: blockData.content,
      subBlocks: blockData.subBlocks,
      styles: blockData.styles || getDefaultStyles(),
      responsive: blockData.responsive || {
        desktop: {},
        tablet: {},
        mobile: {},
      },
    };

    set((state) => {
      const newBlocks = [...state.blocks];
      if (index !== undefined && index >= 0 && index <= state.blocks.length) {
        newBlocks.splice(index, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }
      return {
        blocks: newBlocks,
        selectedBlock: newBlock.id,
      };
    });

    get().saveToHistory();
  },

  updateBlock: (id, updates) => {
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      ),
    }));
    get().saveToHistory();
  },

  deleteBlock: (id) => {
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== id),
      selectedBlock: state.selectedBlock === id ? null : state.selectedBlock,
    }));
    get().saveToHistory();
  },

  duplicateBlock: (id) => {
    const block = get().blocks.find((b) => b.id === id);
    if (!block) return;

    const duplicatedBlock: Block = {
      ...JSON.parse(JSON.stringify(block)),
      id: generateId(),
    };

    set((state) => {
      const index = state.blocks.findIndex((b) => b.id === id);
      const newBlocks = [...state.blocks];
      newBlocks.splice(index + 1, 0, duplicatedBlock);
      return {
        blocks: newBlocks,
        selectedBlock: duplicatedBlock.id,
      };
    });

    get().saveToHistory();
  },

  moveBlock: (blockId, newIndex) => {
    set((state) => {
      const blocks = [...state.blocks];
      const currentIndex = blocks.findIndex((b) => b.id === blockId);
      if (currentIndex === -1) return state;
      const [block] = blocks.splice(currentIndex, 1);
      blocks.splice(newIndex, 0, block);
      return { blocks };
    });
    get().saveToHistory();
  },

  reorderBlocks: (startIndex, endIndex) => {
    set((state) => {
      const blocks = [...state.blocks];
      const [removed] = blocks.splice(startIndex, 1);
      blocks.splice(endIndex, 0, removed);
      return { blocks };
    });
    get().saveToHistory();
  },

  selectBlock: (id) => {
    set({ selectedBlock: id });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      set({
        blocks: previousState,
        historyIndex: historyIndex - 1,
        selectedBlock: null,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      set({
        blocks: nextState,
        historyIndex: historyIndex + 1,
        selectedBlock: null,
      });
    }
  },

  saveToHistory: () => {
    const { blocks, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(blocks)));
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  setPreviewMode: (isPreview) => {
    set({ isPreviewMode: isPreview });
  },

  setResponsiveMode: (mode) => {
    set({ responsiveMode: mode });
  },

  updateGlobalStyles: (styles) => {
    set((state) => ({
      globalStyles: { ...state.globalStyles, ...styles },
    }));
  },

  toggleGrid: () => {
    set((state) => ({ showGrid: !state.showGrid }));
  },

  saveStylePreset: (preset) => {
    const newPreset = {
      ...preset,
      id: generateId(),
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

  getBlockById: (id) => {
    return get().blocks.find((b) => b.id === id);
  },

  exportToJSON: () => {
    const state = get();
    return JSON.stringify({
      blocks: state.blocks,
      globalStyles: state.globalStyles,
      exportedAt: new Date().toISOString(),
    }, null, 2);
  },

  importFromJSON: (json) => {
    try {
      const data = JSON.parse(json);
      if (data.blocks && Array.isArray(data.blocks)) {
        set({
          blocks: data.blocks,
          selectedBlock: null,
        });
        get().saveToHistory();
      }
    } catch (error) {
      console.error('Failed to import JSON:', error);
    }
  },

  async publishArticle() {
    try {
      set({ isSaving: true, status: 'published', lastError: null });
      const state = get();
      const data = await postArticle({ state, published: true });
      set((prev) => ({
        lastSavedAt: new Date().toISOString(),
        postId: data?.id ?? prev.postId ?? null,
        versions: [
          {
            id: generateId(),
            title: state.title || 'Bez názvu',
            status: 'published' as const,
            savedAt: new Date().toISOString(),
            blocks: JSON.parse(JSON.stringify(state.blocks)),
          },
          ...prev.versions,
        ].slice(0, 10),
      }));
    } catch (error) {
      console.error('publishArticle error', error);
      set({ lastError: error instanceof Error ? error.message : 'Chyba při publikaci' });
    } finally {
      set({ isSaving: false });
    }
  },

  async saveDraft() {
    try {
      set({ isSaving: true, status: 'draft', lastError: null });
      const state = get();
      const data = await postArticle({ state, published: false });
      set((prev) => ({
        lastSavedAt: new Date().toISOString(),
        postId: data?.id ?? prev.postId ?? null,
        versions: [
          {
            id: generateId(),
            title: state.title || 'Bez názvu',
            status: 'draft' as const,
            savedAt: new Date().toISOString(),
            blocks: JSON.parse(JSON.stringify(state.blocks)),
          },
          ...prev.versions,
        ].slice(0, 10),
      }));
    } catch (error) {
      console.error('saveDraft error', error);
      set({ lastError: error instanceof Error ? error.message : 'Chyba při ukládání' });
    } finally {
      set({ isSaving: false });
    }
  },

  setTitle: (title) => {
    set((state) => {
      const nextSlug = state.slug || slugify(title);
      return {
        title,
        slug: nextSlug,
      };
    });
  },

  setSlug: (slug) => {
    set({ slug: slugify(slug) });
  },

  async loadMediaAssets() {
    try {
      const response = await fetch('/api/admin/media');
      if (!response.ok) {
        throw new Error('Failed to load media assets');
      }
      const data: MediaAsset[] = await response.json();
      set({ mediaAssets: data });
    } catch (error) {
      console.error('loadMediaAssets error', error);
    }
  },

  setFeaturedImage: (url) => {
    set({ featuredImage: url });
  },

  setState: (newState) => {
    set(newState);
  },
}));
