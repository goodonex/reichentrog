/** Dummy-Cases — Struktur final, Inhalte werden ersetzt. */
// TODO: Echte Cases von Oliver Alberich einsetzen.
// Schema pro Case: { kategorie, ort, ausgangslage (2 Sätze), vorgehen (2 Sätze), ergebnis (1 Satz mit Kennzahl) }
// Keine Namen, keine Adressen, keine Objektbilder.
// Anfrage an: o.alberich@reichentrog-finance.de

export interface CaseStudy {
  category: string;
  situation: string;
  action: string;
  result: string;
}

export const caseStudies: CaseStudy[] = [
  {
    category: 'Off-Market Verkauf · Elbvorort',
    situation:
      'Eigentümerpaar wollte diskret verkaufen, ohne Portal-Inserat und ohne Nachbarschaftsgerüchte. Zeitdruck durch geplanten Umzug ins Ausland.',
    action:
      'Gezielte Ansprache aus dem Banken- und Family-Office-Netzwerk. Verhandlung im geschlossenen Kreis, Notar und Finanzierung aus einer Hand koordiniert.',
    result: 'Verkauf innerhalb von 6 Wochen — 4 % über der Erwartung, ohne öffentliche Vermarktung.',
  },
  {
    category: 'Erbschaft · Mehrfamilienhaus · Eppendorf',
    situation:
      'Drei Erben, unterschiedliche Vorstellungen zum Verkaufszeitpunkt. Objekt vermietet, komplexe Eigentümerstruktur.',
    action:
      'Verkehrswertgutachten als gemeinsame Basis, schrittweise Abstimmung der Erben. Vermieterinformationen und Übergabeprotokoll vorbereitet.',
    result: 'Einvernehmlicher Verkauf an einen Investoren-Mandanten aus dem Bestandsnetzwerk.',
  },
  {
    category: 'Portfolio-Exit · Gewerbe · Hamburg Süd',
    situation:
      'Institutioneller Eigentümer wollte drei Gewerbeobjekte gebündelt abgeben — diskret, ohne Marktsignal.',
    action:
      'Strukturiertes Datenraum-Setup, parallele Due-Diligence-Vorbereitung. Matching mit zwei vorqualifizierten Käufergruppen.',
    result: 'Transaktion mit einem Käufer abgeschlossen — Gesamtvolumen im mittleren zweistelligen Millionenbereich.',
  },
];
