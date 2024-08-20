document.getElementById("fetch-button").addEventListener("click", createUser);
let countdown;
let timeLeft = 10;

function startTimer() {
  const timerElement = document.getElementById("timer");
  timerElement.textContent = `⏳ Tiempo restante: ${timeLeft}s`;

  countdown = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `⏳ Tiempo restante: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      alert("¡Se acabó el tiempo! No se seleccionó ningún movimiento.");
      disableButtons();
    }
  }, 1000);
}

function disableButtons() {
  document.querySelectorAll('.icons button').forEach(button => {
    button.disabled = true;
  });
}

async function createUser() {
  const playerName = document.getElementById("player-name").value;
  const selectedButton = document.querySelector('.icons button.selected');
  const playerChoice = selectedButton ? selectedButton.getAttribute('data-move') : '';

  if (!playerName || !playerChoice) {
    alert("Ingresa tu nombre y selecciona una opción.");
    renderErrorState("Nombre o elección no válidos.");
    return;
  }

  const player = {
    name: playerName,
    choice: playerChoice,
  };

  try {
    const response = await fetch("http://localhost:5050/player", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(player),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    clearInterval(countdown); // Detener el temporizador cuando seleccione
    renderData(`Player ${playerName} ha elegido ${playerChoice}`);
  } catch (error) {
    renderErrorState();
  }
}

document.querySelectorAll('.icons button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.icons button').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
  });
});

startTimer();

function renderErrorState() {
  const container = document.getElementById("data-container");
  container.innerHTML = "";
  container.innerHTML = "<p>Failed to load data</p>";
  console.log("Failed to load data");
}

function renderLoadingState() {
  const container = document.getElementById("data-container");
  container.innerHTML = "";
  container.innerHTML = "<p>Cargando</p>";
  console.log("Cargando...");
}

function renderData(data) {
  const container = document.getElementById("data-container");
  container.innerHTML = "";
  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = "Player created";
  container.appendChild(div);
}
