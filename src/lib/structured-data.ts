export function generateArchitectStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Maxprojekty",
    "alternateName": "Maxprojekty s.r.o.",
    "legalName": "Maxprojekty s.r.o.",
    "slogan": "Vaše vize, naše odbornost",
    "description": "Profesionální architektonické a projekční služby v České republice. Specializujeme se na architektonické návrhy, projektovou dokumentaci a stavební dozor.",
    "url": "https://maxprojekty.cz",
    "logo": "https://maxprojekty.cz/logo.png",
    "image": "https://maxprojekty.cz/hero-building.jpg",
    "foundingDate": "2013",
    "founders": [
      {
        "@type": "Person",
        "name": "Maxprojekty Team"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Zemská 818",
      "addressLocality": "Teplice",
      "addressRegion": "Ústecký kraj",
      "postalCode": "415 01",
      "addressCountry": "CZ"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+420-775-312-614",
      "email": "info@maxprojekty.cz",
      "contactType": "customer service",
      "availableLanguage": ["Czech", "English", "German"],
      "contactOption": "TollFree"
    },
    "sameAs": [
      "https://www.facebook.com/maxprojekty",
      "https://www.instagram.com/maxprojekty.cz/"
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Autorizovaný inženýr",
        "credentialCategory": "degree"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Licence pro projektování staveb",
        "credentialCategory": "license"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Architektonické služby",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Architektonické návrhy",
            "description": "Kreativní návrhy moderních a funkčních budov, které splňují vaše požadavky a harmonicky zapadají do okolního prostředí.",
            "serviceType": "Architectural Design",
            "areaServed": "Czech Republic",
            "provider": {
              "@type": "Organization",
              "name": "Maxprojekty"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Projektová dokumentace",
            "description": "Profesionální projektová dokumentace pro stavební povolení podle všech platných norem a předpisů.",
            "serviceType": "Project Documentation",
            "areaServed": "Czech Republic",
            "provider": {
              "@type": "Organization",
              "name": "Maxprojekty"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Stavební dozor",
            "description": "Technický dozor stavebníka během realizace projektu s důrazem na kvalitu a dodržování termínů.",
            "serviceType": "Construction Supervision",
            "areaServed": "Czech Republic",
            "provider": {
              "@type": "Organization",
              "name": "Maxprojekty"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Interiérový design",
            "description": "Komplexní návrhy interiérů s ohledem na funkčnost, estetiku a požadavky klientů.",
            "serviceType": "Interior Design",
            "areaServed": "Czech Republic",
            "provider": {
              "@type": "Organization",
              "name": "Maxprojekty"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "3D vizualizace",
            "description": "Fotorealistické vizualizace a 3D modely pro lepší představu o vašem budoucím projektu.",
            "serviceType": "3D Visualization",
            "areaServed": "Czech Republic",
            "provider": {
              "@type": "Organization",
              "name": "Maxprojekty"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Rekonstrukce",
            "description": "Odborné řešení přestaveb, modernizací a rekonstrukcí objektů včetně památkově chráněných budov.",
            "serviceType": "Building Reconstruction",
            "areaServed": "Czech Republic",
            "provider": {
              "@type": "Organization",
              "name": "Maxprojekty"
            }
          }
        }
      ]
    },
    "knowsAbout": [
      "Architektura",
      "Projektování budov",
      "Stavební dokumentace",
      "Interiérový design",
      "Stavební dozor",
      "Moderní architektura",
      "Funkční design",
      "Stavební povolení",
      "Architektonické návrhy",
      "Projektová dokumentace"
    ],
    "areaServed": [
      {
        "@type": "Country",
        "name": "Czech Republic"
      },
      {
        "@type": "State",
        "name": "Ústecký kraj"
      },
      {
        "@type": "City",
        "name": "Teplice"
      }
    ],
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    }
  };
}

export function generateLocalBusinessStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://maxprojekty.cz/#organization",
    "name": "Maxprojekty",
    "alternateName": "Maxprojekty s.r.o.",
    "foundingDate": "2013",
    "image": "https://maxprojekty.cz/hero-building.jpg",
    "description": "Profesionální architektonické a projekční služby v Teplicích a okolí",
    "url": "https://maxprojekty.cz",
    "telephone": "+420-775-312-614",
    "email": "info@maxprojekty.cz",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Zemská 818",
      "addressLocality": "Teplice",
      "addressRegion": "Ústecký kraj",
      "postalCode": "415 01",
      "addressCountry": "CZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "50.6404",
      "longitude": "13.8245"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
    "currenciesAccepted": "CZK",
    "hasMap": "https://maps.google.com/?q=Zemská 818, Teplice",
    "isAccessibleForFree": true
  };
}

export function generateWebSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Maxprojekty",
    "alternateName": "Maxprojekty s.r.o.",
    "url": "https://maxprojekty.cz",
    "description": "Profesionální architektonické a projekční služby v České republice. Specializujeme se na architektonické návrhy, projektovou dokumentaci a stavební dozor.",
    "inLanguage": ["cs", "en", "de"],
    "publisher": {
      "@type": "Organization",
      "name": "Maxprojekty",
      "url": "https://maxprojekty.cz"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://maxprojekty.cz/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
}