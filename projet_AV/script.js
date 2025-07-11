const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

const voiture = new Image();
voiture.src = "voiture.png";


const kio = new Image();
kio.src = "kio.png";

const barriere = new Image();
barriere.src = "barriere.png";

const camera = new Image();
camera.src = "camera.png";

const borne = new Image();
borne.src = "borne.png";

let voitureY = 350; 
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

  if (barriereOuverte) {
    ctx.save();
    ctx.translate(240, 320); 
    ctx.rotate(-Math.PI / 2); 
    ctx.drawImage(barriere, -70, -70, 650, 300); 
    ctx.restore();
  }

  ctx.fillStyle = "#111";
  ctx.fillRect(routeX, 0, routeWidth, canvas.height);

 
  ctx.fillStyle = "#666";
  ctx.fillRect(routeX - 10, 0, 8, canvas.height);
  ctx.fillRect(routeX + routeWidth, 0, 8, canvas.height);


  


  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 4;
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(routeX + routeWidth / 2, y);
    ctx.lineTo(routeX + routeWidth / 2, y + 20);
    ctx.stroke();
  }
  ctx.drawImage(voiture, 380, voitureY, 140, 110);

  if (!barriereOuverte) {
    ctx.drawImage(barriere, 80, 10  , 600, 300);
  }

  

   ctx.drawImage(kio, 190, 250, 100, 250); 

  ctx.drawImage(camera, 600, 80, 80, 60);
  ctx.drawImage(borne, 0, 1, 1, 1);
}



function boucleAnimation() {
  if (voitureEnMarche) {
    voitureY -= 2;
    if (voitureY <= 150) {
      voiturePasse = true;
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
  } else {
    afficherMessage("Plaque déjà capturée.");
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
  } 
}

function fermerBarriere(event) {
  if (!voiturePasse) {
    afficherMessage("❌ La voiture n’a pas encore passé la barrière !");
    return;
  }

  barriereOuverte = false;



  document.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
  if (event) event.target.classList.add("active");
}

function avancerVoiture() {
  if (!barriereOuverte) {
    afficherMessage("⛔ Ouvre la barrière pour avancer.");
    return;
  }

  voitureEnMarche = true;
}

function arreterVoiture() {
  voitureEnMarche = false;
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

  document.getElementById("detail-nom").innerText = ticketInfos.nom || "N/A";
  document.getElementById("detail-immatriculation").innerText = ticketInfos.immatriculation || "N/A";
  document.getElementById("detail-date").innerText = ticketInfos.dateEntree || "--/--/----";
  document.getElementById("detail-heure").innerText = ticketInfos.heureEntree || "--:--:--";
  document.getElementById("detail-id").innerText = ticketInfos.id || "----------";
  document.getElementById("detail-marque").innerText = ticketInfos.marque || "BMW";
  document.getElementById("detail-modele").innerText = ticketInfos.modele || "cccc";
  document.getElementById("detail-couleur").innerText = ticketInfos.couleur || "Gris";



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


  const ticketID = Math.floor(10000000000 + Math.random() * 90000000000);

  ticketInfos.dateEntree = dateStr;
  ticketInfos.heureEntree = heureStr;
  ticketInfos.id = ticketID;


  document.getElementById("ticket-date").innerText = dateStr;
  document.getElementById("ticket-time").innerText = heureStr;
  document.getElementById("ticket-id").innerText = ticketID;


  const qrData = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=ID:${ticketID}`;
  document.getElementById("qrcode-img").src = qrData;
}

function afficherMessage(msg, color = "#999999") {
  const box = document.getElementById("message");
  if (!box) return; 
  box.innerText = msg;
  box.style.backgroundColor = color;
  box.style.display = "block";

 
  setTimeout(() => {
    box.style.display = "none";
  }, 3000);
}


voiture.onload = dessinerScene;
boucleAnimation();
function fermerDetails() {
  document.getElementById("popup-details").style.display = "none";
  document.getElementById("popup-overlay").style.display = "none";
}
