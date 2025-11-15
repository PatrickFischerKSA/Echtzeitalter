document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("cardModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");
  const modalEffect = document.getElementById("modalEffect");
  const closeBtn = document.getElementById("closeModal");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  const eventFields = document.querySelectorAll(".event-field");
  eventFields.forEach(field => {
    field.addEventListener("click", () => {
      drawCard("event", modal, modalTitle, modalText, modalEffect);
    });
  });

  const dolinarFields = document.querySelectorAll(".dolinar-field");
  dolinarFields.forEach(field => {
    field.addEventListener("click", () => {
      drawCard("dolinar", modal, modalTitle, modalText, modalEffect);
    });
  });
});

function drawCard(type, modal, modalTitle, modalText, modalEffect) {
  const cards = window.MarianumCards;

  if (!cards) {
    console.error("MarianumCards ist nicht geladen.");
    return;
  }

  let cardList = type === "event" ? cards.eventCards : cards.dolinarCards;

  const card = cardList[Math.floor(Math.random() * cardList.length)];

  modalTitle.textContent = `${card.type}: ${card.title}`;
  modalText.textContent = card.text;
  modalEffect.textContent = card.effect;
  modal.style.display = "block";
}
