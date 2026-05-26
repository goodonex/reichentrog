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
    text: 'Norbert Reichentrog begleitet Sie persönlich — von der ersten Einordnung bis zum Notartermin.',
  },
  {
    title: 'Diskret statt laut',
    text: 'Off-Market-Vermittlung ohne Portal-Inserat. Ihr Auftrag bleibt vertraulich.',
  },
  {
    title: 'Bewertung mit Substanz',
    text: 'DEKRA-zertifizierte Einordnung und Banken-Erfahrung als saubere Entscheidungsbasis.',
  },
] as const;

export const geschaeftskundenUsps = [
  {
    title: 'Transaktionsstruktur',
    text: 'Vom Datenraum bis zur parallelen Due Diligence — klar geführt, ohne Reibungsverlust.',
  },
  {
    title: 'Banken-Netzwerk',
    text: 'Finanzierung, Konditionen und Stakeholder-Dialog aus jahrzehntelanger Sparkassen-Praxis.',
  },
  {
    title: 'Off-Market Matching',
    text: 'Vorqualifizierte Käufer und Investoren — diskret, ohne Marktsignal.',
  },
] as const;

export const teamTextBlocks = [
  {
    name: 'Norbert Reichentrog',
    role: 'Geschäftsführer · Sparkassen-Hintergrund',
    text: 'Strukturiert komplexe Verkaufs- und Finanzierungsprozesse — mit dem Anspruch, dass jede Entscheidung nachvollziehbar bleibt.',
    photo: '/images/team/norbert-reichentrog.png',
    photoAlt: 'Norbert Reichentrog — Geschäftsführer Reichentrog & Kollegen',
  },
  {
    name: 'Oliver Alberich',
    role: 'Partner · Transaktionen & Portfolios',
    text: 'Spezialisiert auf institutionelle Mandate, Portfolio-Exits und Off-Market-Transaktionen im mittleren bis großen Volumen.',
    photo: '/images/team/oliver-alberich.png',
    photoAlt: 'Oliver Alberich — Partner Reichentrog & Kollegen',
  },
] as const;
