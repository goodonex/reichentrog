export const privatkundenServices = [
  'Immobilienbewertung & Verkehrswert',
  'Diskrete Vermittlung & Off-Market',
  'Verkaufsstrategie & Vermarktung',
  'Kaufberatung & Objektprüfung',
  'Begleitung bei Finanzierung & Banken',
] as const;

export const geschaeftskundenServices = [
  'Projektentwicklung & Exit-Strategien',
  'Portfolio-Transaktionen',
  'Finanzierungs- und Banken-Dialog',
  'Off-Market Matching',
  'Due-Diligence-Struktur',
  'Stakeholder-Koordination',
] as const;

export const privatkundenUsps = [
  {
    title: 'Ein Ansprechpartner',
    text: 'Von der ersten Einordnung bis zur Schlüsselübergabe — kein Übergeben, kein Weiterschicken, keine Schnittstellen. Sie sprechen einmal, wir übernehmen den Rest.',
  },
  {
    title: 'Kein Alleinauftrag',
    text: 'Sie müssen sich nicht binden, um professionell betreut zu werden. Wir stimmen das Mandat mit Ihnen individuell ab — und haben trotzdem die höchste Abschlussquote im Privatkundenbereich, die wir kennen.',
  },
  {
    title: 'Bewertung auf Bankenniveau',
    text: 'DEKRA-zertifiziert, nachvollziehbar, bankbelastbar. Unsere Bewertungen sind keine Schätzung — sie halten auch dann stand, wenn Ihre Bank genau hinschaut.',
  },
] as const;

export const geschaeftskundenUsps = [
  {
    title: 'Transaktionsstruktur',
    text: 'Jede Transaktion wird so aufgebaut, dass sie standhält — Datenraum, Due Diligence, Käufer-Matching und Beurkundung aus einer Hand. Keine losen Enden, keine Überraschungen beim Notar.',
  },
  {
    title: 'Banken-Netzwerk',
    text: 'Direkter Zugang zu Hamburger Privatbanken, Vermögensverwaltern und Family Offices — nicht über Türsteher, sondern über gewachsene Beziehungen. Kapitalnachweis und Finanzierungsbestätigung prüfen wir, bevor ein Termin stattfindet.',
  },
  {
    title: 'Aktive Betreuung',
    text: 'Jeder Mandant wird wöchentlich informiert — Investor wie Eigentümer. Wir haben mehrere Mandate von namhaften Wettbewerbern übernommen, weil die aufgehört hatten, sich zu melden. Das passiert bei uns nicht.',
  },
] as const;

export const teamTextBlocks = [
  {
    name: 'Norbert Reichentrog',
    role: 'Geschäftsführer · Finanzierung · Projektentwicklung',
    text: 'Strukturiert Verkaufs- und Finanzierungsprozesse mit dem Anspruch, dass jede Entscheidung bankbelastbar und nachvollziehbar bleibt.',
    photo: '/images/team/norbert-reichentrog.png',
    photoAlt: 'Norbert Reichentrog — Geschäftsführer Reichentrog & Kollegen',
  },
  {
    name: 'Oliver Alberich',
    role: 'Partner · Transaktionen · Vermietung · Investoren',
    text: 'Spezialisiert auf institutionelle Mandate, Vermietung und Portfolio-Transaktionen — vom Erstkontakt bis zum Abschluss, ohne unnötige Zwischenstufen.',
    photo: '/images/team/oliver-alberich.png',
    photoAlt: 'Oliver Alberich — Partner Reichentrog & Kollegen',
  },
] as const;
