// Types for the blog editor
export interface Block {
  id: string;
  type: BlockType;
  content: any;
  styles: BlockStyles;
  columnSpan?: number; // How many columns this block spans (default: 1)
  responsive: {
    desktop: BlockStyles & { columnSpan?: number };
    tablet: BlockStyles & { columnSpan?: number };
    mobile: BlockStyles & { columnSpan?: number };
  };
}

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
  | 'table';

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
}

export interface Column {
  id: string;
  width: number; // percentage (0-100)
  blocks: Block[];
  styles: {
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    alignment?: 'left' | 'center' | 'right';
  };
  responsive: {
    desktop: { width: number };
    tablet: { width: number };
    mobile: { width: number };
  };
}

export interface Row {
  id: string;
  columns: Column[];
  styles: {
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    minHeight?: string;
  };
}

export interface Section {
  id: string;
  rows: Row[];
  styles: {
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
  };
}

export interface EditorState {
  sections: Section[];
  selectedBlock: string | null;
  selectedColumn: string | null;
  selectedRow: string | null;
  selectedSection: string | null;
  isPreviewMode: boolean;
  history: Section[][];
  historyIndex: number;
  gridSize: 8 | 16 | 32;
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
}

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

export interface DragItem {
  type: 'block' | 'new-block' | 'column-resize';
  blockType?: BlockType;
  block?: Block;
  columnId?: string;
  sectionId?: string;
  rowId?: string;
  id?: string;
}