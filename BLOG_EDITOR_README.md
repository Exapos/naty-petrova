# Blog Editor - Drag & Drop Editor pro stavební firmu

Moderní vizuální editor pro vytváření blogových článků a landing pages s drag-and-drop funkcionalitou.

## Funkce

### 🎨 Drag & Drop Interface
- **Přetahovatelné bloky**: Nadpis, text, obrázek, galerie, video, reference, kontakt, mapa, tlačítko
- **Grid systém**: Magnetické zarovnání s 20px mřížkou
- **Snap-to-grid**: Automatické přichytávání bloků k mřížce
- **Visual feedback**: Modré indikátory při přetahování

### 🔧 Bloky a komponenty
- **Heading**: H1-H3 s inline editací
- **Text**: Rich text s formátováním
- **Image**: Obrázky s popisky a URL editací
- **Gallery**: Galerie obrázků v gridu
- **Video**: YouTube/Vimeo embed
- **Button**: Klikatelná tlačítka s různými styly
- **Contact**: Kontaktní formulář
- **Reference**: Zobrazení projektů/reference
- **Map**: Interaktivní mapa (placeholder)

### 🎛️ Ovládací prvky
- **Block Toolbar**: Inline nástroje pro každý blok (duplicate, delete, settings)
- **Resize handles**: Změna velikosti pomocí drag handles
- **Selection**: Modré ohraničení vybraných bloků
- **Hover effects**: Animace při najetí myší

### 📱 Responzivita
- **Preview mode**: Náhled bez editačních prvků
- **Responsive controls**: Základ pro desktop/tablet/mobile nastavení
- **Mobile-friendly**: Optimalizované pro dotykové ovládání

### ⏪ Historie a undo/redo
- **History panel**: Časová osa změn
- **Undo/Redo**: Ctrl+Z / Ctrl+Y
- **Auto-save**: Automatické ukládání do historie

### 🎨 Globální styly
- **Color scheme**: Primární a sekundární barvy
- **Typography**: Výběr písma a velikosti
- **Theme consistency**: Aplikace stylů na všechny bloky

### ⌨️ Klávesové zkratky
- **Delete/Backspace**: Smazání vybraného bloku
- **Ctrl+Z**: Undo
- **Ctrl+Y**: Redo
- **Escape**: Zrušení editace

## Technické detaily

### Architektura
- **Zustand store**: State management pro editor
- **@dnd-kit**: Drag & drop funkcionalita
- **Framer Motion**: Animace a přechody
- **TypeScript**: Typová bezpečnost
- **Tailwind CSS**: Stylování

### Struktura souborů
```
src/
├── app/admin/blog/editor/
│   └── page.tsx                 # Hlavní editor komponenta
├── components/editor/
│   ├── EditorCanvas.tsx         # Canvas s grid systémem
│   ├── BlockRenderer.tsx        # Renderer pro všechny bloky
│   ├── BlockToolbar.tsx         # Inline nástroje pro bloky
│   ├── DragMenu.tsx            # Menu s přetahovatelnými bloky
│   ├── HistoryPanel.tsx        # Panel historie změn
│   ├── GlobalStylesPanel.tsx   # Globální nastavení stylů
│   ├── PreviewToggle.tsx       # Přepínač náhledu
│   └── blocks/                 # Jednotlivé bloky
│       ├── HeadingBlock.tsx
│       ├── TextBlock.tsx
│       ├── ImageBlock.tsx
│       ├── ButtonBlock.tsx
│       └── ...
├── stores/
│   └── editorStore.ts          # Zustand store
└── types/
    └── editor.ts               # TypeScript typy
```

### State management
```typescript
interface EditorState {
  blocks: Block[];
  selectedBlock: string | null;
  isPreviewMode: boolean;
  history: Block[][];
  historyIndex: number;
  globalStyles: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    fontSize: string;
  };
}
```

## Jak používat

1. **Přístup k editoru**: `/admin/blog/editor`
2. **Přidání bloku**: Přetáhněte blok z pravého menu na canvas
3. **Úprava bloku**: Klikněte na blok pro výběr, použijte toolbar
4. **Změna velikosti**: Uchopte rohy bloku a táhněte
5. **Undo/Redo**: Ctrl+Z / Ctrl+Y nebo tlačítka v history panelu
6. **Náhled**: Klikněte na tlačítko "Náhled" v horním panelu
7. **Uložení**: Klikněte na "Uložit článek"

## Roadmap

### Plánované funkce
- [ ] Responzivní controls pro každý breakpoint
- [ ] Rich text editor s Tiptap
- [ ] Template systém
- [ ] Auto-save do localStorage
- [ ] Export do HTML/PDF
- [ ] Collaboration features
- [ ] Custom CSS možnosti
- [ ] Animace bloků
- [ ] SEO optimalizace

### Vylepšení
- [ ] Google Maps integrace
- [ ] Obrázek upload s Cloudinary
- [ ] Video upload
- [ ] Form builder pro contact bloky
- [ ] Analytics integrace
- [ ] A/B testing
- [ ] Version control

### Version workflow & review
- [ ] Workflow states: draft → review → published
- [ ] Reviewer assignment & approval queue
- [ ] Version timeline with diff view / restore
- [ ] Commenting & change requests per block
- [ ] Publication audit log (who/when)

### Templates & theming
- [ ] Export/import templates as JSON bundles
- [ ] Block presets library with thumbnails
- [ ] Theme overrides (colors, typography, spacing) per article
- [ ] Shared sections (hero, CTA) with reuse tracking

### SEO & accessibility checks
- [ ] Alt-text reminders on images
- [ ] Heading hierarchy validation (H1/H2 order)
- [ ] Color contrast warnings for text/background
- [ ] Metadata checklist (title length, meta description, keywords)
- [ ] Internal/external link health monitor

### Testing strategy
- [ ] Drag/drop integration tests (block reorder, layout sub-blocks)
- [ ] Keyboard navigation suite (selection, shortcuts)
- [ ] Autosave & publish API contract tests
- [ ] Visual regression snapshots for key blocks
- [ ] Performance budgets (load blocks, render layout)

## Instalace a spuštění

```bash
# Development
npm run dev

# Build
npm run build

# Start
npm start
```

Editor je dostupný na `/admin/blog/editor`.