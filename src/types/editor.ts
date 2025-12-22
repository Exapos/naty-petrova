// Simplified types for the blog editor

// Layout types for blocks
export type LayoutType =
  | 'single'           // Jeden sloupec (default)
  | 'two-column-equal' // 50/50
  | 'two-column-left'  // 70/30 (text vlevo, obrázek vpravo)
  | 'two-column-right' // 30/70 (obrázek vlevo, text vpravo)
  | 'three-column';    // 33/33/33

// Block types
export type BlockType =
  | 'heading'
  | 'text'
  | 'image'
  | 'gallery'
  | 'video'
  | 'reference'
  | 'contact'
  | 'map'
  | 'button'
  | 'divider'
  | 'icon'
  | 'table'
  | 'layout';  // Nový typ pro layout bloky

// Sub-block pro layout bloky (image + text kombinace)
export interface SubBlock {
  id: string;
  type: BlockType;
  content: any;
  styles: BlockStyles;
}

// Hlavní blok
export interface Block {
  id: string;
  type: BlockType;
  layout?: LayoutType; // Pro layout bloky
  content: any;
  subBlocks?: SubBlock[]; // Pro layout bloky (např. [image, text])
  styles: BlockStyles;
  responsive?: {
    desktop?: BlockStyles;
    tablet?: BlockStyles;
    mobile?: BlockStyles;
  };
}

// Styly pro bloky
export interface BlockStyles {
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  width?: string;
  height?: string;
  borderColor?: string;
  borderWidth?: string;
  // Image specific styles
  objectFit?: string;
  filter?: string;
  rotate?: string;
  opacity?: number;
  // Layout specific styles
  gap?: string;
  // Animation styles
  animation?: string;
  animationDuration?: string;
  animationDelay?: string;
  hoverEffect?: string;
  // Layout styles
  display?: string;
  flexDirection?: string;
  flexWrap?: string;
  justifyContent?: string;
  alignItems?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  // Table styles
  tableStyle?: string;
  // Icon styles
  color?: string;
  // Responsive styles
  responsive?: {
    mobile?: Partial<BlockStyles>;
    tablet?: Partial<BlockStyles>;
    desktop?: Partial<BlockStyles>;
  };
}

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  width?: number;
  height?: number;
  size?: number;
  type: 'image' | 'video' | 'file';
  alt?: string;
  caption?: string;
  createdAt: string;
}

export type EditorWorkflowStatus = 'draft' | 'review' | 'published';

export interface EditorVersion {
  id: string;
  title: string;
  status: EditorWorkflowStatus;
  savedAt: string;
  author?: string;
  blocks: Block[];
  note?: string;
}

// Zjednodušený editor state - jen pole bloků!
export interface EditorState {
  blocks: Block[]; // ✨ To je všechno!
  selectedBlock: string | null;
  isPreviewMode: boolean;
  responsiveMode: 'desktop' | 'tablet' | 'mobile';
  history: Block[][];
  historyIndex: number;
  showGrid: boolean;
  globalStyles: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    fontSize: string;
    spacingUnit: number;
    borderRadius: string;
    logo?: string;
    brandFont?: string;
  };
  stylePresets: StylePreset[];
  customColors: string[];
  mediaAssets: MediaAsset[];
  title: string;
  slug: string;
  featuredImage?: string | null;
  isSaving: boolean;
  lastSavedAt: string | null;
  status: EditorWorkflowStatus;
  versions: EditorVersion[];
  lastError?: string | null;
  postId?: string | null;
}

// Style presets
export interface StylePreset {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
  };
  spacing: number;
  borderRadius: string;
}

// Drag item data
export interface DragItem {
  type: 'block' | 'new-block';
  blockType?: BlockType;
  layoutType?: LayoutType; // Pro předpřipravené layouty
  block?: Block;
  index?: number;
}

// Layout template pro Block Picker
export interface LayoutTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  blockType: BlockType;
  layoutType?: LayoutType;
  previewImage?: string;
}