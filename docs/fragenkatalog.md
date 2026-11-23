# Fragenkatalog zur Anforderungsklärung – Handels GmbH

Vor Beginn der produktiven Umsetzung des Projekts **„Automatisierter Bestelleingangsprozess“** sollten folgende fachliche, technische und sicherheitsrelevante Punkte mit dem Kunden geklärt werden:

## 1. Prozess & Fachlichkeit

1. **Bestellpositionen:** Besteht eine Bestellung immer aus genau einem Artikel, oder können Bestellungen mehrere Positionen enthalten (1:n-Beziehung im Datenmodell)?
2. **Duplikate / Idempotenz:** Können identische Bestellungen doppelt eingehen (z. B. erneuter E-Mail-Versand durch den Kunden)? Anhand welcher Merkmale (z. B. Kunden-Bestellnummer, Nachrichten-ID, Inhaltshash) sollen Duplikate erkannt und abgefangen werden?
3. **Fehlerbehandlung & Eskalation:** Wer bearbeitet Bestellungen mit dem Status `fehlerhaft`? Soll bei Fehlern automatisch eine Benachrichtigung (z. B. per E-Mail oder Microsoft Teams) versendet werden, und gibt es definierte SLA-/Bearbeitungsfristen?

## 2. Eingangsformate & Schnittstellen

4. **E-Mail-Eingang:** Über welches Postfach bzw. welches Protokoll (z. B. Microsoft 365 / Graph API, IMAP) gehen die Bestellungen ein? Wie wird mit weitergeleiteten Mails oder Anhängen außerhalb des Bestellkontexts umgegangen?
5. **Dokumentenformate:** Haben die PDF-Bestellungen wiederkehrende, feste Layouts (z. B. Kundenportale) oder handelt es sich um unstrukturierte Freitext-PDFs und E-Mail-Bodies? Gibt es weitere Formate (z. B. CSV, XML, EDI)?
6. **ERP-System:** Welches ERP-System ist im Einsatz und welche Schnittstelle steht zur Verfügung (REST-API, SOAP, Dateiimport)? Wie sieht das konkrete Ziel-Schema (Feld-Mapping, Artikelnummern-Abgleich, Pflichtfelder) aus?

## 3. Sicherheit, Rollen & Datenschutz

7. **Benutzerrollen & Berechtigungen:** Wer darf das Dashboard einsehen (nur Lesen) und wer darf fehlerhafte Bestellungen korrigieren, freigeben oder den Status manuell ändern?
8. **Authentifizierung:** Ist bereits eine Microsoft-365-Umgebung mit **Microsoft Entra ID** (ehem. Azure AD) vorhanden, über die ein Single Sign-On (SSO) angebunden werden soll?
9. **Datenschutz & Aufbewahrung (DSGVO):** Welche Aufbewahrungs- und Löschfristen gelten für extrahierte Kundendaten sowie die ursprünglichen E-Mails und PDF-Anhänge? Wo müssen die Daten gehostet werden (z. B. EU-Region)?

## 4. Monitoring & Reporting

10. **KPIs & Auswertungen:** Welche Kennzahlen neben „Bestellungen heute“ und „Fehlerquote“ sind für den Betrieb entscheidend (z. B. durchschnittliche Durchlaufzeit, Fehlerursachen-Verteilung)? Wird ein Export (CSV/Excel) benötigt?
