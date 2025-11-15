// -------------------------------------------------------
// Marianumopoly – Spiellogik
// Diese Datei enthält KEINE Kartendaten!
// Karten stehen in cards.js und werden hier nur verwendet.
// -------------------------------------------------------

// ---------------------------
// Modal-Elemente referenzieren
// ---------------------------

let modal = null;
let modalTitle = null;
let modalText = null;
let modalEffect = null;

// Wird erst ausgeführt, wenn DOM geladen ist
document.addEventListener("DOMContentLoaded", () => {
    modal = document.getElementById("cardModal");
    modalTitle = document.getElementById("modalTitle");
    modalText = document.getElementById("modalText");
    modalEffect = document.getElementById("modalEffect");

    // Schließen-Button
    const closeBtn = document.getElementById("closeModal");
    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    // Ereignisfelder anklickbar machen
    const eventFields = document.querySelectorAll(".event-field");
    eventFields.forEach(field => {
        field.addEventListener("click", () => drawCard("event"));
    });

    // Dolinarfelder anklickbar machen
    const dolinarFields = document.querySelectorAll(".dolinar-field");
    dolinarFields.forEach(field => {
        field.addEventListener("click", () => drawCard("dolinar"));
    });
});

// ---------------------------
// Karte ziehen je nach Typ
// ---------------------------

function drawCard(type) {
    if (!window.MarianumCards) {
        console.error("MarianumCards wurde nicht geladen.");
        return;
    }

    let cardList = null;

    if (type === "event") {
        cardList = window.MarianumCards.eventCards;
    } else if (type === "dolinar") {
        cardList = window.MarianumCards.dolinarCards;
    }

    if (!cardList) {
        console.error("Keine Kartenliste gefunden für Typ:", type);
        return;
    }

    // Zufällige Karte auswählen
    const card = cardList[Math.floor(Math.random() * cardList.length)];

    showModal(card);
}

// ---------------------------
// Modal mit Kartendaten füllen
// ---------------------------

function showModal(card) {
    if (!modal) return;

    modalTitle.textContent = `${card.type}: ${card.title}`;
    modalText.textContent = card.text;
    modalEffect.textContent = card.effect;

    modal.style.display = "block";
}

// ---------------------------
// Modal schließen
// ---------------------------

function closeModal() {
    if (modal) {
        modal.style.display = "none";
    }
}
