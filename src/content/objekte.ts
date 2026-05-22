// TODO: Echte Objekt-Daten in src/content/objekte.ts pflegen
// TODO: Echte Objekt-Bilder von Oliver einsetzen

export type ObjektKategorie = 'wohn' | 'gewerbe';

export interface ObjektStat {
  icon: 'flaeche' | 'zimmer' | 'baujahr';
  label: string;
  value: string;
}

export interface AktivesObjekt {
  id: string;
  badge: string;
  typLabel: string;
  preis: number;
  kategorie: ObjektKategorie;
  beschreibung: string;
  stats: ObjektStat[];
}

export interface ReferenzObjekt {
  id: string;
  badge: string;
  typLabel: string;
  beschreibung: string;
  ergebnis: string;
}

export const aktiveObjekte: AktivesObjekt[] = [
  {
    id: 'mfh-elbvororte',
    badge: 'OFF-MARKET',
    typLabel: 'MEHRFAMILIENHAUS · ELBVORORTE',
    preis: 2_400_000,
    kategorie: 'wohn',
    beschreibung:
      'Vollvermietetes Gründerzeithaus in bevorzugter Lage. Solide Mietrendite, Potenzial zur Wertsteigerung.',
    stats: [
      { icon: 'flaeche', label: 'Wohnfläche', value: '580 m²' },
      { icon: 'zimmer', label: 'Einheiten', value: '8' },
      { icon: 'baujahr', label: 'Baujahr', value: '1928' },
    ],
  },
  {
    id: 'ew-harvestehude',
    badge: 'EXKLUSIV',
    typLabel: 'EIGENTUMSWOHNUNG · HARVESTEHUDE',
    preis: 980_000,
    kategorie: 'wohn',
    beschreibung:
      'Hochwertig sanierte Altbauwohnung mit Originalstuckelementen. Ruhige Seitenstraße, gehobene Nachbarschaft.',
    stats: [
      { icon: 'flaeche', label: 'Wohnfläche', value: '145 m²' },
      { icon: 'zimmer', label: 'Zimmer', value: '4' },
      { icon: 'baujahr', label: 'Baujahr', value: '1905' },
    ],
  },
  {
    id: 'buero-hafencity',
    badge: 'OFF-MARKET',
    typLabel: 'BÜROGEBÄUDE · HAFENCITY',
    preis: 4_200_000,
    kategorie: 'gewerbe',
    beschreibung:
      'Modernes Geschäftshaus mit langfristigen Mietverträgen. Institutioneller Mieter, bonitätsstark.',
    stats: [
      { icon: 'flaeche', label: 'Fläche', value: '1.200 m²' },
      { icon: 'zimmer', label: 'Etagen', value: '6' },
      { icon: 'baujahr', label: 'Baujahr', value: '2008' },
    ],
  },
  {
    id: 'grundstueck-sued',
    badge: 'EXKLUSIV',
    typLabel: 'GRUNDSTÜCK · HAMBURGER SÜDEN',
    preis: 650_000,
    kategorie: 'gewerbe',
    beschreibung:
      'Erschlossenes Gewerbegrundstück mit genehmigtem Bebauungsplan. Ideal für Logistik oder Produktion.',
    stats: [
      { icon: 'flaeche', label: 'Grundstück', value: '2.400 m²' },
      { icon: 'zimmer', label: 'Status', value: 'Baurecht' },
      { icon: 'baujahr', label: 'Planung', value: 'vorhanden' },
    ],
  },
];

export const referenzObjekte: ReferenzObjekt[] = [
  {
    id: 'ref-elbvorort',
    badge: 'Verkauft',
    typLabel: 'OFF-MARKET VERKAUF · ELBVORORT · EINFAMILIENHAUS',
    beschreibung: 'Diskrete Vermittlung ohne Portal-Inserat. Käufer aus Privatnetzwerk.',
    ergebnis: 'Verkauft in 6 Wochen · 4% über Erwartung',
  },
  {
    id: 'ref-eppendorf',
    badge: 'Verkauft',
    typLabel: 'ERBSCHAFT · MEHRFAMILIENHAUS · EPPENDORF',
    beschreibung: 'Komplexe Eigentümerstruktur, drei Erben. Einvernehmliche Lösung gefunden.',
    ergebnis: 'Verkauft an Investoren-Mandanten',
  },
  {
    id: 'ref-portfolio',
    badge: 'Verkauft',
    typLabel: 'PORTFOLIO-EXIT · GEWERBE · HAMBURG SÜD',
    beschreibung: 'Drei Gewerbeobjekte gebündelt abgegeben.',
    ergebnis: 'Gesamtvolumen mittlerer zweistelliger Millionenbereich',
  },
];

export function formatPreis(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}
