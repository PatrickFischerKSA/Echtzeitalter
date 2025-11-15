// -------------------------------------------------------
// Marianumopoly – Kartenlogik (Ereignis + Dolinar)
// Steuert das Ziehen der Karten und das Anzeigen des Modals
// -------------------------------------------------------

// ---------------------------
// Karten: Ereignis
// ---------------------------

const eventCards = [
  {
    type: "Ereignis",
    title: "Busfahrt zum Skikurs",
    text: "Im Bus reden Till und Georg über Spiele und Lehrer – draußen zieht die Landschaft vorbei.",
    effect: "Rücke 3 Felder vor und erhalte 50 €."
  },
  {
    type: "Ereignis",
    title: "Chaos am Buffet",
    text: "Die Schlange ist lang, Stimmen überlagern sich, Tabletts klappern.",
    effect: "Bezahle 20 € an die Bank."
  },
  {
    type: "Ereignis",
    title: "Sportfest",
    text: "Auf dem Großen Platz ist alles aufgebaut, Schüler und Lehrer vermischen sich.",
    effect: "Alle zahlen 30 € in die Mitte. Du erhältst 50 € Bonus, wenn du ein Sportfeld besitzt."
  },
  {
    type: "Ereignis",
    title: "Stille in der Bibliothek",
    text: "Zwischen Regalen beruhigt sich dein Atem, die Welt wird leiser.",
    effect: "Erhalte 80 €."
  },
  {
    type: "Ereignis",
    title: "Regen über Wien",
    text: "Der Himmel hängt tief, Wege werden rutschig, Pläne ändern sich.",
    effect: "Würfle erneut. Gerade Zahl: +4 Felder, ungerade: stehen bleiben."
  },
  {
    type: "Ereignis",
    title: "Improvisierte Stunde",
    text: "Ein Lehrer ist krank. Die Stunde läuft anders – fast frei.",
    effect: "Ziehe zum nächsten Unterrichtsraum, den du besitzt, und kassiere doppelte Miete."
  },
  {
    type: "Ereignis",
    title: "Weg zur Mauer",
    text: "Der Blick über die Grenze verändert dein Gefühl für Freiheit.",
    effect: "Rücke zum Feld 'Waldweg zur Mauer'. Falls du es besitzt: +40 €."
  },
  {
    type: "Ereignis",
    title: "Tag der offenen Tür",
    text: "Eltern wandern herum, alles wirkt wie eine Bühne.",
    effect: "Erhalte 50 € von jeder Person."
  },
  {
    type: "Ereignis",
    title: "Hallenbad-Stunde",
    text: "Der Raum verstärkt Geräusche – die Blicke auch.",
    effect: "Bezahle 40 € für Eintritt + vergessene Badekappe."
  },
  {
    type: "Ereignis",
    title: "Verspätetes Shuttle",
    text: "Alle warten, niemand weiß warum – typisch.",
    effect: "Setze eine Runde aus, erhalte aber 50 € Entschädigung."
  }
];

// ---------------------------
// Karten: Dolinar
// ---------------------------

const dolinarCards = [
  {
    type: "Dolinar",
    title: "Nachsitzen mit Aufsatz",
    text: "Du sollst einen Text schreiben, der mehr über Gehorsam als Inhalt sagt.",
    effect: "Gehe direkt ins Nachsitzen. Keine 200 € bei START."
  },
  {
    type: "Dolinar",
    title: "Falsche Anrede",
    text: "Ein einziges Wort genügt – seine Stimmung kippt sofort.",
    effect: "Bezahle 50 € und setze eine Runde aus."
  },
  {
    type: "Dolinar",
    title: "Korrektur in Rot",
    text: "Das Heft ist voller Anmerkungen, die wenig mit Fehlern zu tun haben.",
    effect: "Bezahle 20 € für jedes Haus, das du besitzt."
  },
  {
    type: "Dolinar",
    title: "Sprachregel",
    text: "Ein häufiges Wort darfst du ab jetzt nicht mehr sagen.",
    effect: "Wähle jemanden: Er/Sie zahlt dir 50 € für 'Nachhilfe'."
  },
  {
    type: "Dolinar",
    title: "Unerwartetes Lob",
    text: "Kurz klingt er fast freundlich – der Moment ist selten.",
    effect: "Erhalte 100 € und würfle beim nächsten Zug zweimal."
  },
  {
    type: "Dolinar",
    title: "Klassenbuch-Eintrag",
    text: "Dein Name steht in einer Liste, die Drohung genug ist.",
    effect: "Bezahle 10 € pro Feld, das du besitzt."
  },
  {
    type: "Dolinar",
    title: "Gruber mischt sich ein",
    text: "Ein kurzer Satz von Gruber erspart dir Ärger.",
    effect: "Du darfst eine Dolinar-Karte ignorieren oder sofort aus dem Nachsitzen frei."
  },
  {
    type: "Dolinar",
    title: "Peinlicher Kommentar",
    text: "Er sagt einen Satz, der noch nachhallt, wenn die Stunde vorbei ist.",
    effect: "Bezahle 50 € in die Mitte. Wer auf einem Klassenraum steht, erhält 25 €."
  },
  {
    type: "Dolinar",
    title: "Der Blick im Gang",
    text: "Er sagt nichts, aber alle Signale sind eindeutig.",
    effect: "Setze eine Runde aus. Niemand zahlt dir in dieser Zeit Miete."
  },
  {
    type: "Dolinar",
    title: "Aufsatz als Chance",
