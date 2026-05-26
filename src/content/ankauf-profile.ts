/** Ankaufsprofile — Inhalte für Privatkunden- und Geschäftskunden-Seiten */

export const ankaufIntro = {
  title: 'Immobilien-Ankaufsprofile',
  lead: 'Wir schätzen das Besondere.',
  body: [
    'Im Auftrag privater und institutioneller Anleger im In- und Ausland sowie für den eigenen Bestand sind wir ständig auf der Suche nach attraktiven Grundstücken, Projekten und Liegenschaften. Zu Ihrer Information haben wir mehrere Ankaufsprofile erstellt. Diese stellen keinen Maklersuchauftrag oder ein Angebot zum Abschluss eines Maklervertrags dar.',
    'Eingehende Immobilienangebote betrachten wir als Angebote zum Abschluss eines Maklervertrags, der im Einzelfall erst durch unsere Annahme zustande kommt.',
  ],
  footnote:
    'Wir bitten um Verständnis dafür, dass die Prüfung von Objektunterlagen und eine Rückmeldung nur erfolgen können, wenn uns die vollständige Objektadresse, immobilienspezifische Angaben in relevantem Umfang sowie ein Hinweis auf die Legitimation des Verkäufers vorliegen.',
};

export type ProfileRow = { label: string; value: string };

export type AnkaufProfile = {
  id: string;
  name: string;
  rows: ProfileRow[];
};

export const ankaufProfiles: AnkaufProfile[] = [
  {
    id: 'a',
    name: 'Profil A',
    rows: [
      { label: 'Nutzung', value: 'Wohnen, Wohn- und Geschäftshaus' },
      { label: 'Standorte', value: 'Metropolregionen' },
      { label: 'Volumina', value: 'ab 0,5 Mio. EUR' },
      { label: 'Objektarten', value: 'Bestandsobjekte, Projektierungen' },
      {
        label: 'Objektanforderungen',
        value:
          'Kein Erbbaurecht · Gerne auch zur Revitalisierung, Sanierung usw. · Freifinanzierter oder geförderter Wohnungsbau',
      },
    ],
  },
  {
    id: 'b',
    name: 'Profil B',
    rows: [
      { label: 'Nutzungsart', value: 'Büro' },
      { label: 'Standorte', value: 'Metropolregionen' },
      { label: 'Volumina', value: 'ab 5 Mio. EUR' },
      { label: 'Objektarten', value: 'Bestandsobjekte, Projektierungen' },
      {
        label: 'Objektanforderungen',
        value:
          'Kein Erbbaurecht · Multi Tenant: WALT > 5 Jahre · Single Tenant: WALT > 7 Jahre · Gerne Umnutzung (z. B. studentisches Wohnen) · Objekte mit Entwicklungspotenzial',
      },
    ],
  },
  {
    id: 'c',
    name: 'Profil C',
    rows: [
      {
        label: 'Nutzungsart',
        value: 'Sozialimmobilien (Senioren, Pflege, betreutes Wohnen)',
      },
      { label: 'Standorte', value: 'Bundesweit bei guter Standortqualität' },
      { label: 'Volumina', value: 'ab 2,5 Mio. EUR' },
      {
        label: 'Objektarten',
        value: 'Bestandsobjekte · Neubauten · schlüsselfertige Projekte',
      },
      {
        label: 'Objektanforderungen',
        value:
          'Bestandsobjekte in technisch einwandfreiem Zustand · Bonitätsstarke Mieter/Pächter',
      },
    ],
  },
  {
    id: 'd',
    name: 'Profil D',
    rows: [
      { label: 'Nutzung', value: 'Wohnen / Gewerbe' },
      { label: 'Standorte', value: 'Metropolregionen' },
      { label: 'Volumina', value: 'ab 10 WE' },
      { label: 'Objektarten', value: 'Grundstücke' },
    ],
  },
];
