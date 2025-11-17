// ======================================================================
// Marianumopoly – Vollautomatische Spiel-Engine
// Entwickelt für das browserbasierte Marianumopoly-Spiel (HTML/JS)
// Enthält: Spielerlogik, Würfeln, Felder, Karten, Besitz, Nachsitzen
// ======================================================================

(function() {

  // =============================
  // UI-Referenzen
  // =============================
  const logEl = document.getElementById('game-log');
  const playersEl = document.getElementById('game-players');
  const currentEl = document.getElementById('game-current');
  const rollBtn = document.getElementById('roll-btn');
  const startBtn = document.getElementById('start-game-btn');

  // =============================
  // GAME STATE
  // =============================
  const game = {
    players: [],
    currentIndex: 0,
    started: false,
    finished: false,
    board: [],
    pot: 0,            // Geldtopf für Freihof
    eventDeck: [],
    dolinarDeck: []
  };

  // =============================
  // UI-Hilfsfunktionen
  // =============================
  function log(message) {
    if (!logEl) return;
    const div = document.createElement("div");
    div.className = "log-entry";
    div.textContent = message;
    logEl.appendChild(div);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function renderPlayers() {
    if (!playersEl) return;

    playersEl.innerHTML = "";

    game.players.forEach((p, idx) => {
      const card = document.createElement("div");
      card.className = "player-card";
      if (idx === game.currentIndex) card.classList.add("active");

      const nameEl = document.createElement("div");
      nameEl.className = "player-name";
      nameEl.textContent = p.name;

      const moneyEl = document.createElement("div");
      moneyEl.className = "player-money";
      moneyEl.textContent = `Geld: ${p.money} €`;

      const posEl = document.createElement("div");
      posEl.className = "player-pos";
      const tile = game.board[p.position];
      posEl.textContent = `Feld: ${p.position} – ${tile ? tile.name : "?"}`;

      const statusEl = document.createElement("div");
      statusEl.className = "player-status";
      if (p.bankrupt) statusEl.textContent = "Status: bankrott";
      else if (p.inJail) statusEl.textContent = `Nachsitzen (${p.jailTurns} Runden)`;
      else if (p.skipTurns > 0) statusEl.textContent = `setzt ${p.skipTurns} Runde(n) aus`;
      else statusEl.textContent = "Status: aktiv";

      card.appendChild(nameEl);
      card.appendChild(moneyEl);
      card.appendChild(posEl);
      card.appendChild(statusEl);

      playersEl.appendChild(card);
    });
  }

  function updateCurrentDisplay() {
    if (!currentEl) return;

    if (!game.started) {
      currentEl.textContent = "Klicke auf „Spiel starten“, um zu beginnen.";
      return;
    }
    if (game.finished) {
      currentEl.textContent = "Spiel beendet.";
      return;
    }

    const p = game.players[game.currentIndex];
    currentEl.textContent = `Am Zug: ${p.name}`;
  }

  function updateUI() {
    renderPlayers();
    updateCurrentDisplay();
    if (rollBtn) rollBtn.disabled = (!game.started || game.finished);
  }

  // =============================
  // FELDER – KOMPLETTES BRETT
  // =============================
  function initBoard() {

    game.board = [
      { index: 0, type: "start", name: "START" },

      { index: 1, type: "property", name: "Eingangshof", group: "brown", price: 80, rent: 20 },
      { index: 2, type: "event", name: "Verspätetes Shuttle" },
      { index: 3, type: "property", name: "Bussteig", group: "brown", price: 80, rent: 20 },
      { index: 4, type: "tax", name: "Kaution", amount: 100 },

      { index: 5, type: "station", name: "Straßenbahn", price: 200, baseRent: 25 },

      { index: 6, type: "property", name: "Lehrerzimmer", group: "lightblue", price: 100, rent: 30 },
      { index: 7, type: "event", name: "Impro-Stunde" },
      { index: 8, type: "property", name: "Nordflügel", group: "lightblue", price: 100, rent: 30 },
      { index: 9, type: "property", name: "Ostflügel", group: "lightblue", price: 120, rent: 40 },

      { index:10, type: "jail", name: "Nachsitzen" },

      { index:11, type: "property", name: "Schlaftrakt", group: "pink", price: 140, rent: 50 },
      { index:12, type: "property", name: "Innenflur", group: "pink", price: 140, rent: 50 },
      { index:13, type: "event", name: "Tag der offenen Tür" },
      { index:14, type: "property", name: "Süd-Hof", group: "pink", price: 160, rent: 60 },

      { index:15, type: "station", name: "Bahnhof", price: 200, baseRent: 25 },

      { index:16, type: "dolinar", name: "Klassenbuch-Eintrag" },

      { index:17, type: "property", name: "Informatikraum", group: "orange", price: 180, rent: 70 },
      { index:18, type: "event", name: "Regen über Wien" },
      { index:19, type: "property", name: "Musiksaal", group: "orange", price: 200, rent: 80 },

      { index:20, type: "free", name: "Frei-Hof" },

      { index:21, type: "property", name: "Innenhof", group: "red", price: 220, rent: 90 },
      { index:22, type: "event", name: "Stille in der Bibliothek" },
      { index:23, type: "property", name: "Waldweg zur Mauer", group: "red", price: 220, rent: 90 },
      { index:24, type: "property", name: "Grünfläche", group: "red", price: 240, rent: 100 },

      { index:25, type: "station", name: "Busparkplatz", price: 200, baseRent: 25 },

      { index:26, type: "property", name: "Hallenbad", group: "yellow", price: 260, rent: 110 },
      { index:27, type: "event", name: "Busfahrt zum Skikurs" },
      { index:28, type: "property", name: "Sporthalle", group: "yellow", price: 260, rent: 110 },

      { index:29, type: "tax", name: "Internatsbeitrag", amount: 150 },

      { index:30, type: "visit", name: "Nur zu Besuch" },

      { index:31, type: "property", name: "Mensa", group: "green", price: 300, rent: 130 },
      { index:32, type: "event", name: "Chaos am Buffet" },
      { index:33, type: "property", name: "Aula", group: "green", price: 320, rent: 140 },
      { index:34, type: "property", name: "Eingangsbereich", group: "green", price: 330, rent: 150 },

      { index:35, type: "station", name: "Shuttle-Haltestelle", price: 200, baseRent: 25 },

      { index:36, type: "event", name: "Sportfest" },
      { index:37, type: "dolinar", name: "Dolinars Klassenzimmer" },

      { index:38, type: "property", name: "Bibliothek", group: "darkblue", price: 350, rent: 170 },
      { index:39, type: "property", name: "Informatik (oben)", group: "darkblue", price: 400, rent: 200 }
    ];

    game.board.forEach(t => {
      if (t.type === "property" || t.type === "station") {
        t.owner = null;
      }
    });
  }

// --- END OF PART 1 ---
// ======================================================================
// ENGINE.JS – TEIL 2
// ======================================================================

// =============================
// KARTEN-DECKS INITIALISIEREN
// =============================
function initDecks() {

  // -------------------------
  // Ereignis-Karten
  // -------------------------
  game.eventDeck = [
    {
      name: "Busfahrt zum Skikurs",
      effect: (player) => {
        log(`${player.name} erlebt die Busfahrt: +50 € und 3 Felder vor.`);
        changeMoney(player, 50);
        movePlayer(player, 3);
      }
    },

    {
      name: "Chaos am Buffet",
      effect: (player) => {
        log(`${player.name} steht im Buffet-Chaos: -20 €.`);
        changeMoney(player, -20);
      }
    },

    {
      name: "Sportfest",
      effect: (player) => {
        log(`${player.name} ist beim Sportfest. Alle zahlen 30 € in die Mitte.`);
        let total = 0;
        game.players.forEach(p => {
          if (!p.bankrupt) {
            const paid = payUpTo(p, 30);
            total += paid;
          }
        });
        game.pot += total;
        log(`Im Frei-Hof-Topf liegen jetzt ${game.pot} €.`);
      }
    },

    {
      name: "Stille in der Bibliothek",
      effect: (player) => {
        log(`${player.name} findet Ruhe in der Bibliothek: +80 €.`);
        changeMoney(player, 80);
      }
    },

    {
      name: "Regen über Wien",
      effect: (player) => {
        const roll = rollDie();
        log(`${player.name} erlebt Regen über Wien (Wurf: ${roll}).`);
        if (roll % 2 === 0) {
          log("Gerade Zahl: 4 Felder vor.");
          movePlayer(player, 4);
        } else {
          log("Ungerade Zahl: bleibt stehen.");
        }
      }
    },

    {
      name: "Improvisierte Stunde",
      effect: (player) => {
        log(`${player.name} erlebt eine improvisierte Stunde: +50 €.`);
        changeMoney(player, 50);
      }
    },

    {
      name: "Verspätetes Shuttle",
      effect: (player) => {
        log(`${player.name} wartet auf das Shuttle: setzt eine Runde aus, erhält aber 50 €.`);
        changeMoney(player, 50);
        player.skipTurns += 1;
      }
    },

    {
      name: "Tag der offenen Tür",
      effect: (player) => {
        const gain = 50 * (game.players.length - 1);
        log(`${player.name} profitiert vom Tag der offenen Tür: +${gain} €.`);
        game.players.forEach(p => {
          if (p !== player && !p.bankrupt) {
            changeMoney(p, -50);
          }
        });
        changeMoney(player, gain);
      }
    },

    {
      name: "Hallenbad-Stunde",
      effect: (player) => {
        log(`${player.name} geht ins Hallenbad: -40 €.`);
        changeMoney(player, -40);
      }
    },

    {
      name: "Verspätetes Shuttle (nochmal)",
      effect: (player) => {
        log(`${player.name} steckt erneut im Shuttle fest: setzt eine Runde aus.`);
        player.skipTurns += 1;
      }
    }
  ];

  // -------------------------
  // DOLINAR-KARTEN
  // -------------------------
  game.dolinarDeck = [
    {
      name: "Nachsitzen mit Aufsatz",
      effect: (player) => {
        log(`${player.name} bekommt Nachsitzen mit Aufsatz. Direkt ins Nachsitzen.`);
        sendToJail(player);
      }
    },

    {
      name: "Falsche Anrede",
      effect: (player) => {
        log(`${player.name} sagt das Falsche: -50 € und 1 Runde aussetzen.`);
        changeMoney(player, -50);
        player.skipTurns += 1;
      }
    },

    {
      name: "Korrektur in Rot",
      effect: (player) => {
        log(`${player.name} bekommt eine Korrektur in Rot: -20 € pro Besitz.`);
        const owned = countOwnedFields(player);
        changeMoney(player, -20 * owned);
      }
    },

    {
      name: "Sprachregel",
      effect: (player) => {
        log(`${player.name} erhält eine Sprachregel: ein zufälliger Mitspieler zahlt 50 € an dich.`);
        const others = game.players.filter(p => p !== player && !p.bankrupt);
        if (others.length > 0) {
          const victim = others[Math.floor(Math.random() * others.length)];
          changeMoney(victim, -50);
          changeMoney(player, +50);
        }
      }
    },

    {
      name: "Unerwartetes Lob",
      effect: (player) => {
        log(`${player.name} erhält unerwartetes Lob: +100 € und eine Extraaktion.`);
        changeMoney(player, 100);
        player.extraRolls += 1;
      }
    },

    {
      name: "Klassenbuch-Eintrag",
      effect: (player) => {
        log(`${player.name} steht im Klassenbuch: -10 € pro Besitz.`);
        const owned = countOwnedFields(player);
        changeMoney(player, -10 * owned);
      }
    },

    {
      name: "Gruber mischt sich ein",
      effect: (player) => {
        log(`Gruber mischt sich ein: nächste Dolinar-Karte ignoriert.`);
        player.protectDolinar += 1;
      }
    },

    {
      name: "Peinlicher Kommentar",
      effect: (player) => {
        log(`${player.name} erhält einen peinlichen Kommentar: -50 € in die Mitte.`);
        const paid = payUpTo(player, 50);
        game.pot += paid;
      }
    },

    {
      name: "Der Blick im Gang",
      effect: (player) => {
        log(`${player.name} spürt den Blick im Gang: setzt eine Runde aus und bekommt Mietschutz.`);
        player.skipTurns += 1;
        player.noRentTurns += 1;
      }
    },

    {
      name: "Aufsatz als Chance",
      effect: (player) => {
        log(`${player.name} nutzt den Aufsatz als Chance: +80 € + gehe zum nächsten Bibliotheks/Informatik-Feld.`);
        changeMoney(player, 80);
        moveToNextSpecial(player, ["Bibliothek", "Informatikraum", "Informatik"]);
      }
    }
  ];

  shuffle(game.eventDeck);
  shuffle(game.dolinarDeck);
}


// ======================================================================
// Karten mischen
// ======================================================================
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// --- END OF PART 2 ---
// ======================================================================
// ENGINE.JS – TEIL 3
// ======================================================================


// =============================
// SPIELER-SETUP
// =============================
function setupPlayers() {
  let num = parseInt(prompt("Wie viele Spieler:innen? (2–6)", "2") || "2", 10);
  if (isNaN(num)) num = 2;
  num = Math.max(2, Math.min(6, num));

  game.players = [];

  for (let i = 0; i < num; i++) {
    let name = prompt(`Name von Spieler:in ${i + 1}?`, `Spieler ${i + 1}`);
    if (!name || !name.trim()) name = `Spieler ${i + 1}`;

    game.players.push({
      name,
      money: 1000,
      position: 0,
      inJail: false,
      jailTurns: 0,
      skipTurns: 0,
      extraRolls: 0,
      noRentTurns: 0,
      protectDolinar: 0,
      bankrupt: false
    });
  }

  log("Spieler:innen im Spiel: " + game.players.map(p => p.name).join(", "));
}


// =============================
// GELD-MANAGEMENT
// =============================
function changeMoney(player, amount) {
  if (player.bankrupt) return;

  player.money += amount;
  log(`${player.name} hat jetzt ${player.money} €.`);

  if (player.money < 0) {
    log(`${player.name} ist bankrott! Sein Besitz geht zurück an die Bank.`);
    player.bankrupt = true;

    game.board.forEach(tile => {
      if (tile.owner === player) {
        tile.owner = null;
      }
    });

    checkGameEnd();
  }
}

// bezahlt bis max. verfügbar
function payUpTo(player, amount) {
  if (player.bankrupt) return 0;
  const paid = Math.min(player.money, amount);
  player.money -= paid;

  if (player.money < 0) {
    player.bankrupt = true;
  }
  return paid;
}

// Felder im Besitz zählen
function countOwnedFields(player) {
  return game.board.filter(t => t.owner === player).length;
}

// Stationsbesitz zählen
function ownedStations(player) {
  return game.board.filter(t => t.type === "station" && t.owner === player).length;
}


// =============================
// SPIELER BEWEGEN
// =============================
function movePlayer(player, steps) {
  if (player.bankrupt) return;

  let oldPos = player.position;
  let newPos = (oldPos + steps) % game.board.length;

  if (oldPos + steps >= game.board.length) {
    log(`${player.name} überquert START und erhält 200 €.`);
    changeMoney(player, 200);
  }

  player.position = newPos;
  const tile = game.board[newPos];
  log(`${player.name} landet auf Feld ${newPos}: ${tile.name}`);

  resolveTile(player, tile);
}

function moveTo(player, index) {
  if (player.bankrupt) return;

  let oldPos = player.position;
  player.position = index;

  if (index < oldPos) {
    log(`${player.name} überquert START und erhält 200 €.`);
    changeMoney(player, 200);
  }

  const tile = game.board[index];
  log(`${player.name} landet auf ${tile.name}.`);
  resolveTile(player, tile);
}

function moveToNextSpecial(player, targetNames) {
  let pos = player.position;

  for (let i = 1; i < game.board.length; i++) {
    const idx = (pos + i) % game.board.length;
    const t = game.board[idx];

    if (targetNames.some(n => t.name.includes(n))) {
      moveTo(player, idx);
      return;
    }
  }
}


// =============================
// NACHsitzen
// =============================
function sendToJail(player) {
  player.inJail = true;
  player.jailTurns = 0;
  player.position = 10;
  log(`${player.name} landet im Nachsitzen.`);
}


// =============================
// KARTENZIEHEN
// =============================
function drawEventCard(player) {
  if (game.eventDeck.length === 0) {
    initDecks();
    log("Ereignis-Stapel neu gemischt.");
  }

  const card = game.eventDeck.shift();
  log(`Ereignis-Karte: ${card.name}`);
  card.effect(player);
}

function drawDolinarCard(player) {
  if (player.protectDolinar > 0) {
    log(`${player.name} ignoriert diese Dolinar-Karte dank Schutz.`);
    player.protectDolinar -= 1;
    return;
  }

  if (game.dolinarDeck.length === 0) {
    initDecks();
    log("Dolinar-Stapel neu gemischt.");
  }

  const card = game.dolinarDeck.shift();
  log(`Dolinar-Karte: ${card.name}`);
  card.effect(player);
}


// =============================
// FELDER-AKTIONEN
// =============================
function resolveTile(player, tile) {

  if (player.bankrupt) return;

  switch (tile.type) {

    case "start":
      break;

    case "property":
      handleProperty(player, tile);
      break;

    case "station":
      handleStation(player, tile);
      break;

    case "tax":
      log(`${player.name} zahlt ${tile.amount} € (${tile.name}).`);
      changeMoney(player, -tile.amount);
      break;

    case "event":
      drawEventCard(player);
      break;

    case "dolinar":
      drawDolinarCard(player);
      break;

    case "jail":
      log(`${player.name} ist beim Nachsitzen-Feld.`);
      break;

    case "free":
      if (game.pot > 0) {
        log(`${player.name} erhält den Frei-Hof-Topf mit ${game.pot} €.`);
        changeMoney(player, game.pot);
        game.pot = 0;
      } else {
        log(`${player.name} ist auf dem Frei-Hof.`);
      }
      break;

    case "visit":
      log(`${player.name} ist nur zu Besuch.`);
      break;

    default:
      break;
  }
}


// =============================
// PROPERTIES
// =============================
function handleProperty(player, tile) {
  if (!tile.owner) {

    if (player.money >= tile.price) {
      const buy = confirm(`${player.name}, möchtest du ${tile.name} für ${tile.price} € kaufen?`);
      if (buy) {
        changeMoney(player, -tile.price);
        tile.owner = player;
        log(`${player.name} kauft ${tile.name}.`);
      }
    } else {
      log(`${player.name} kann ${tile.name} nicht kaufen.`);
    }

  } else if (tile.owner === player) {

    log(`${player.name} ist auf eigenem Feld ${tile.name}.`);

  } else {

    if (player.noRentTurns > 0) {
      log(`${player.name} müsste Miete zahlen, ist aber geschützt.`);
      return;
    }

    const rent = tile.rent;
    log(`${player.name} zahlt ${rent} € an ${tile.owner.name} für ${tile.name}.`);
    changeMoney(player, -rent);
    changeMoney(tile.owner, rent);
  }
}


// =============================
// STATIONEN
// =============================
function handleStation(player, tile) {
  if (!tile.owner) {

    if (player.money >= tile.price) {
      const buy = confirm(`${player.name}, Station ${tile.name} für ${tile.price} € kaufen?`);
      if (buy) {
        changeMoney(player, -tile.price);
        tile.owner = player;
        log(`${player.name} kauft ${tile.name}.`);
      }
    }

  } else if (tile.owner === player) {
    log(`${player.name} ist auf eigener Station.`);
  }

  else {
    if (player.noRentTurns > 0) {
      log(`${player.name} müsste Stationsmiete zahlen, ist aber geschützt.`);
      return;
    }

    const count = ownedStations(tile.owner);
    const rent = tile.baseRent * count;

    log(`${player.name} zahlt ${rent} € Stationsmiete an ${tile.owner.name}.`);
    changeMoney(player, -rent);
    changeMoney(tile.owner, rent);
  }
}


// --- END OF PART 3 ---
// ======================================================================
// ENGINE.JS – TEIL 4
// ======================================================================


// =============================
// WÜRFELN
// =============================
function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}


// =============================
// SPIELER-WECHSEL
// =============================
function nextPlayer() {

  const current = game.players[game.currentIndex];

  // Mietschutz abbauen
  if (current.noRentTurns > 0) {
    current.noRentTurns -= 1;
  }

  const total = game.players.length;

  // Suche nächsten nicht-bankrotten Spieler
  for (let i = 1; i <= total; i++) {
    const idx = (game.currentIndex + i) % total;
    const p = game.players[idx];

    if (p.bankrupt) continue;

    // Spieler muss aussetzen?
    if (p.skipTurns > 0) {
      log(`${p.name} setzt eine Runde aus.`);
      p.skipTurns -= 1;
      continue;
    }

    game.currentIndex = idx;
    break;
  }

  updateUI();
}


// =============================
// SPIELENDE PRÜFEN
// =============================
function checkGameEnd() {
  const alive = game.players.filter(p => !p.bankrupt);

  if (alive.length <= 1) {
    game.finished = true;
    if (rollBtn) rollBtn.disabled = true;

    if (alive.length === 1) {
      log(`🎉 Spielende! ${alive[0].name} gewinnt Marianaumopoly!`);
      currentEl.textContent = `Spielende – Sieger: ${alive[0].name}`;
    } else {
      log(`Niemand hat überlebt – System zusammengebrochen.`);
      currentEl.textContent = `Spielende – niemand gewinnt.`;
    }
  }
}


// =============================
// EINEN ZUG AUSFÜHREN
// =============================
function handleRoll() {

  if (!game.started || game.finished) return;

  const player = game.players[game.currentIndex];
  if (player.bankrupt) {
    nextPlayer();
    return;
  }

  // NACHSITZEN / JAIL
  if (player.inJail) {

    player.jailTurns += 1;
    log(`${player.name} ist im Nachsitzen (Runde ${player.jailTurns}).`);

    if (player.jailTurns >= 1) {
      log(`${player.name} kommt aus dem Nachsitzen frei.`);
      player.inJail = false;
      player.jailTurns = 0;
    }

    nextPlayer();
    return;
  }

  // Würfeln
  const d1 = rollDie();
  const d2 = rollDie();
  const sum = d1 + d2;

  log(`${player.name} würfelt ${d1} und ${d2} (gesamt: ${sum}).`);

  movePlayer(player, sum);

  // Extra-Wurf aus Karte
  if (player.extraRolls > 0) {
    player.extraRolls -= 1;
    log(`${player.name} erhält einen zusätzlichen Wurf.`);
    updateUI();
    return;
  }

  checkGameEnd();

  if (!game.finished) {
    nextPlayer();
  }
}


// =============================
// SPIEL STARTEN
// =============================
function startGame() {

  game.started = false;
  game.finished = false;
  game.pot = 0;

  initBoard();
  initDecks();
  setupPlayers();

  game.currentIndex = 0;
  game.started = true;

  if (rollBtn) rollBtn.disabled = false;

  log("🎲 Das Spiel beginnt!");
  updateUI();
}


// =============================
// BUTTON-EVENTS
// =============================
if (startBtn && rollBtn) {

  startBtn.addEventListener("click", () => {
    if (logEl) logEl.innerHTML = "";
    startGame();
  });

  rollBtn.addEventListener("click", () => {
    handleRoll();
    updateUI();
  });
}


// Initiales UI
updateUI();


// Abschluss der IIFE
})();
// ======================================================================
// ENGINE.JS – TEIL 5 / 5
// ======================================================================
//
// 🎉 Die Engine ist vollständig geladen.
//
// STRUKTURPRÜFUNG:
// ----------------
// Die vollständige Datei muss folgende Hauptblöcke enthalten:
//
// 1. IIFE-Start:   (function() {
// 2. UI-Referenzen
// 3. Game State Definition
// 4. UI-Helperfunktionen
// 5. initBoard()
// 6. initDecks()
// 7. Karteneffekte (Event & Dolinar)
// 8. Utility-Funktionen (shuffle, etc.)
// 9. setupPlayers()
// 10. Geldfunktionen
// 11. Bewegung / Position / Spezialbewegung
// 12. Nachsitzen
// 13. Karten ziehen
// 14. resolveTile()
// 15. handleProperty()
// 16. handleStation()
// 17. rollDie()
// 18. nextPlayer()
// 19. checkGameEnd()
// 20. handleRoll()
// 21. startGame()
// 22. Event Listener für Buttons
// 23. updateUI()
// 24. IIFE-Ende:   })();
//
// ALLE diese Teile sind nun in deiner engine.js enthalten.
//
// ======================================================================
//
// HASH DER VOLLSTÄNDIGKEIT:
// (Diese Zeichenfolge dient nur dazu, deine Datei auf Vollständigkeit zu prüfen.
// Wenn du sie am Ende der Datei findest, wurde nichts abgeschnitten.)
//
// ENGINE_JS_COMPLETE_SIGNATURE = 
// "MOPOLY-ENGINE-V1.0-FULL-AUTO-FINAL";
//
// ======================================================================
//
// Ende von Marianumopoly – Vollautomatische Spielengine
// ======================================================================
