/**
 * ROLE-BASED ACCESS CONTROL PŘEHLED
 * ===================================
 * 
 * ADMIN (plné oprávnění):
 * ✅ Dashboard - plný přístup
 * ✅ Blogy - čtení/zápis/mazání
 * ✅ Reference - čtení/zápis/mazání  
 * ✅ Analytics - plný přístup (pouze admin)
 * ✅ Správa uživatelů - vytváření/editace/mazání (pouze admin)
 * ✅ Nastavení - plný přístup (účet, zabezpečení, integrace)
 * 
 * EDITOR (omezené oprávnění):
 * ✅ Dashboard - základní přístup
 * ✅ Blogy - čtení/zápis/mazání
 * ✅ Reference - čtení/zápis/mazání
 * ❌ Analytics - žádný přístup
 * ❌ Správa uživatelů - žádný přístup  
 * ✅ Nastavení - pouze účet a zabezpečení (jméno, email, heslo)
 * 
 * IMPLEMENTACE:
 * - Client-side: permissions.ts - kontrola zobrazení menu
 * - Server-side: server-permissions.ts - API middleware
 * - Component-level: useEffect kontroly v jednotlivých stránkách
 * - API-level: role kontroly v route handlers
 */

// Tento soubor slouží pouze jako dokumentace
export {};