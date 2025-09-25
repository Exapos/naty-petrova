export type ProjectCategory = 'Rezidenční' | 'Komerční' | 'Interiéry' | 'Rekonstrukce';

export interface Project {
  id: string;
  title: string;
  location: string;
  description: string;
  category: ProjectCategory;
  image: string;
  slug: string;
}

export const projects: Project[] = [
  {
    id: 'p1',
    title: 'Rodinný dům u lesa',
    location: 'Brno, ČR',
    description: 'Návrh moderního rodinného domu s ohledem na pasivní standard a napojení na okolní přírodu.',
    category: 'Rezidenční',
    image: '/hero-building.jpg',
    slug: 'rodinny-dum-u-lesa'
  },
  {
    id: 'p2',
    title: 'Kancelářský komplex Panorama',
    location: 'Praha, ČR',
    description: 'Komerční výstavba s důrazem na flexibilní dispozice a energetickou efektivitu.',
    category: 'Komerční',
    image: '/hero-building2.jpg',
    slug: 'kancelarsky-komplex-panorama'
  },
  {
    id: 'p3',
    title: 'Interiéry rodinného bytu',
    location: 'Ostrava, ČR',
    description: 'Komplexní řešení interiéru s důrazem na denní světlo a kvalitní materiály.',
    category: 'Interiéry',
    image: '/hero-building3.jpg',
    slug: 'interiery-rodinneho-bytu'
  }
];

export const categories: ProjectCategory[] = ['Rezidenční', 'Komerční', 'Interiéry', 'Rekonstrukce'];
