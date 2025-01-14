// src/navigation.ts
import {createSharedPathnamesNavigation} from 'next-intl/navigation';
import {routing} from '@/i18n/routing';
 
export const {Link, redirect, usePathname, useRouter} = createSharedPathnamesNavigation({
  locales: routing.locales,
  localePrefix: routing.localePrefix
});