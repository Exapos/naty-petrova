// src/components/Footer.tsx
import {useTranslations} from 'next-intl';
import Link from 'next/link'

export default function Footer() {
  const t = useTranslations('Footer');
  
  return (
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MaxProjekty</h3>
            <p>Projekční kancelář pro vaše stavební plány</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
            <p>info@maxprojekty.cz</p>
            <p>+420 XXX XXX XXX</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Sledujte nás</h4>
            <div className="flex gap-4">
              <Link href="#">LinkedIn</Link>
              <Link href="#">Facebook</Link>
            </div>
          </div>
        </div>
      </footer>
    )
  }
  