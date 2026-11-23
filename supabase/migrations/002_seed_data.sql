-- supabase/migrations/002_seed_data.sql
-- Initiale Beispieldaten für den Proof of Concept

insert into public.bestellungen (
  kundenname, artikelnummer, menge, bestelldatum, lieferadresse, status, fehlergrund, erp_id, erstellt_am
) values
  (
    'Müller Maschinenbau GmbH',
    'ART-10042',
    12,
    current_date,
    'Industriestraße 14, 70565 Stuttgart',
    'uebermittelt',
    null,
    'ERP-2026-0891',
    now() - interval '2 hours'
  ),
  (
    'Nordwind Logistik AG',
    'ART-20410',
    150,
    current_date,
    'Hafenstraße 88, 20457 Hamburg',
    'in_pruefung',
    null,
    null,
    now() - interval '45 minutes'
  ),
  (
    'Bäckerei Schmidt OHG',
    'ART-30900',
    0,
    current_date,
    'Marktplatz 3, 80331 München',
    'fehlerhaft',
    'Validierungsfehler: Menge muss größer als 0 sein.',
    null,
    now() - interval '20 minutes'
  ),
  (
    'Alpenwerk Technik KG',
    'ART-10555',
    5,
    current_date - interval '1 day',
    'Bergweg 7, 87435 Kempten',
    'uebermittelt',
    null,
    'ERP-2026-0884',
    now() - interval '1 day'
  ),
  (
    'Unbekannter Absender',
    null,
    null,
    null,
    null,
    'fehlerhaft',
    'Validierungsfehler: Artikelnummer fehlt; Bestellmenge fehlt; Bestelldatum fehlt.',
    null,
    now() - interval '1 day'
  );