const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

const voiture = new Image();
voiture.src = "voiture.png";

const barriere = new Image();
barriere.src = "barriere.png";

const camera = new Image();
camera.src = "camera.png";

const borne = new Image();
borne.src = "borne.png";

let voitureY = 400; 
let barriereOuverte = false;
let afficherTicket = false;
let voiturePasse = false;
let voitureEnMarche = false;

let ticketInfos = {
  immatriculation: "123-TN-456",
  date: "" ,
  nom:"MHADHBI SALSABIL"
};

let plaqueCapturee = false;
let ticketPris = false;

function dessinerScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const routeX = 300;
  const routeWidth = 300;

  // === Si la barrière est ouverte, dessiner d'abord (donc en arrière-plan)
  if (barriereOuverte) {
    ctx.save();
    ctx.translate(250, 320); 
    ctx.rotate(-Math.PI / 2); 
    ctx.drawImage(barriere, -70, -40, 620, 300); 
    ctx.restore();
  }

  // === Route noire
  ctx.fillStyle = "#111";
  ctx.fillRect(routeX, 0, routeWidth, canvas.height);

  // === Bordures grises
  ctx.fillStyle = "#666";
  ctx.fillRect(routeX - 10, 0, 8, canvas.height);
  ctx.fillRect(routeX + routeWidth, 0, 8, canvas.height);

  // === Lignes blanches centrales
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 4;
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(routeX + routeWidth / 2, y);
    ctx.lineTo(routeX + routeWidth / 2, y + 20);
    ctx.stroke();
  }

  // === Si barrière est fermée, on la dessine maintenant (devant)
  if (!barriereOuverte) {
    ctx.drawImage(barriere, 80, 20  , 600, 300);
  }

  // === Voiture
  ctx.drawImage(voiture, 380, voitureY, 140, 100);

  // === Caméra et borne
  ctx.drawImage(camera, 600, 110, 80, 60);
  ctx.drawImage(borne, 300, 220, 160, 60);
}



function boucleAnimation() {
  if (voitureEnMarche) {
    // Si la voiture peut avancer
    if ((voitureY + 60 < 250) || (barriereOuverte && ticketPris)) {
      voitureY -= 2;
      if (voitureY <= 150) {
        voiturePasse = true;
      }
    }
  }

  dessinerScene();
  requestAnimationFrame(boucleAnimation);
}

function capturerPlaque() {
  if (!plaqueCapturee) {
    plaqueCapturee = true;
    document.getElementById("immatriculation-box").style.display = "block";
    document.getElementById("immatriculation-text").innerText = ticketInfos.immatriculation;
    afficherMessage("✅ Plaque capturée !");
  } else {
    afficherMessage("ℹ️ Plaque déjà capturée.");
  }
}

function getTicket() {
  if (!plaqueCapturee) {
    afficherMessage("❌ Capture d'abord la plaque !");
    return;
  }

  if (!ticketPris) {
    ticketPris = true;
    afficherTicket = true;

    const now = new Date();
    ticketInfos.date = now.toLocaleTimeString();

    genererTicket();

    document.getElementById("ticket").style.display = "block";

    afficherMessage(`🎟️ Ticket généré pour ${ticketInfos.nom}`);
  } else {
    afficherMessage("🎟️ Ticket déjà généré.");
  }
}

function ouvrirBarriere() {
  if (!plaqueCapturee || !ticketPris) {
    afficherMessage("❌ Tu dois capturer la plaque et générer le ticket.");
    return;
  }

  if (!barriereOuverte) {
    barriereOuverte = true;
    afficherMessage("✅ Barrière ouverte.");
  } else {
    afficherMessage("ℹ️ La barrière est déjà ouverte.");
  }
}

function fermerBarriere(event) {
  if (!voiturePasse) {
    afficherMessage("❌ La voiture n’a pas encore passé la barrière !");
    return;
  }

  barriereOuverte = false;
  afficherMessage("✅ Barrière fermée.");

  // Supprimer la classe active sur tous les boutons
  document.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
  if (event) event.target.classList.add("active");
}

function avancerVoiture() {
  if (!barriereOuverte) {
    afficherMessage("⛔ Ouvre la barrière pour avancer.");
    return;
  }

  voitureEnMarche = true;
  afficherMessage("🚗 La voiture avance.");
}

function arreterVoiture() {
  voitureEnMarche = false;
  afficherMessage("⏸️ La voiture est arrêtée.");
}

function afficherDetails() {
  if (!plaqueCapturee) {
    afficherMessage("❌ Tu dois d'abord capturer la plaque !");
    return;
  }
  if (!ticketPris) {
    afficherMessage("❌ Vous devez d'abord générer un ticket.");
    return;
  }

  // Remplir les infos dans le popup
  document.getElementById("detail-nom").innerText = ticketInfos.nom || "N/A";
  document.getElementById("detail-immatriculation").innerText = ticketInfos.immatriculation || "N/A";
  document.getElementById("detail-date").innerText = ticketInfos.dateEntree || "--/--/----";
  document.getElementById("detail-heure").innerText = ticketInfos.heureEntree || "--:--:--";
  document.getElementById("detail-id").innerText = ticketInfos.id || "----------";
  document.getElementById("detail-marque").innerText = ticketInfos.marque || "Toyota";
  document.getElementById("detail-modele").innerText = ticketInfos.modele || "Corolla";
  document.getElementById("detail-couleur").innerText = ticketInfos.couleur || "Gris";

  // Afficher le popup et l'overlay
  document.getElementById("popup-details").style.display = "block";
  document.getElementById("popup-overlay").style.display = "block";
}


function fermerDetails() {
  const carte = document.getElementById("carte-details");
  if (carte) carte.style.display = "none";
}

function genererTicket() {
  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const heureStr = now.toLocaleTimeString();

  // Générer un ID unique à 11 chiffres
  const ticketID = Math.floor(10000000000 + Math.random() * 90000000000);

  // Enregistre ces infos dans ticketInfos
  ticketInfos.dateEntree = dateStr;
  ticketInfos.heureEntree = heureStr;
  ticketInfos.id = ticketID;

  // Affiche dans le ticket HTML
  document.getElementById("ticket-date").innerText = dateStr;
  document.getElementById("ticket-time").innerText = heureStr;
  document.getElementById("ticket-id").innerText = ticketID;

  // Générer QR code
  const qrData = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=ID:${ticketID}`;
  document.getElementById("qrcode-img").src = qrData;
}

function afficherMessage(msg, color = "#f39c12") {
  const box = document.getElementById("message");
  if (!box) return; // sécurité si message absent
  box.innerText = msg;
  box.style.backgroundColor = color;
  box.style.display = "block";

  // Disparaît après 3 secondes
  setTimeout(() => {
    box.style.display = "none";
  }, 3000);
}

// Chargement et lancement animation
voiture.onload = dessinerScene;
boucleAnimation();
function fermerDetails() {
  document.getElementById("popup-details").style.display = "none";
  document.getElementById("popup-overlay").style.display = "none";
}
