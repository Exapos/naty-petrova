import { Extension } from '@tiptap/core';

export const EnterHandler = Extension.create({
  name: 'enterHandler',
  
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        
        // Pokud jsme v seznamu, zachováme seznam
        if ($from.parent.type.name === 'listItem') {
          // Kontrolujeme, jestli je aktuální item prázdný
          if ($from.parent.textContent.trim() === '') {
            // Prázdný item - opustíme seznam
            return editor.chain().liftListItem('listItem').run();
          }
          // Neprázdný item - vytvoříme nový
          return editor.chain().splitListItem('listItem').run();
        }
        
        // Pro normální text použijeme standardní chování
        return false;
      },
    };
  },
});