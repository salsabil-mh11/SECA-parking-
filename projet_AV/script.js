
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

  // Route noire verticale
  ctx.fillStyle = "#";
  ctx.fillRect(400, 0, 300, canvas.height);

  // Lignes blanches centrales
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 4;
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(410, y);
    ctx.lineTo(410, y + 28);
    ctx.stroke();
  }


  if (barriereOuverte) {
    ctx.save();
ctx.translate(280, 240); 
ctx.rotate(-Math.PI / 2); 
ctx.drawImage(barriere, -90, -20, 350, 180); 
ctx.restore();

  } else {
    ctx.drawImage(barriere, 180, 160, 350, 180 );
  }


  ctx.drawImage(voiture, 350, voitureY, 100, 100);

  
  ctx.drawImage(camera, 600, 125, 70, 50);

  
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
    document.getElementById("capture-btn").style.display = "none";
    const plaqueSpan = document.getElementById("immatriculation");
    plaqueSpan.style.display = "inline-block";
    plaqueSpan.innerText = ticketInfos.immatriculation;
  } 
}


function getTicket() {
  if (!plaqueCapturee) {
    alert("❌ Capture d'abord la plaque !");
    return;
  }

  if (!ticketPris) {
    ticketPris = true;
    afficherTicket = true;

    const now = new Date();
    ticketInfos.date = now.toLocaleTimeString();

    document.getElementById("ticket-html").style.display = "block";




    // Message temporaire
    const popup = document.getElementById("popup-ticket");
    popup.style.display = "block";
    popup.innerText = `🎟️ Ticket généré pour ${ticketInfos.nom}`;

  } else {
    alert("🎟️ Ticket déjà généré.");
  }
  genererTicket();

}



function ouvrirBarriere() {
  if (!plaqueCapturee || !ticketPris) {
    alert("❌ Tu dois capturer la plaque et générer le ticket.");
    return;
  }

  if (!barriereOuverte) {
    barriereOuverte = true;
   }
}


function fermerBarriere(event) {
  if (!voiturePasse) {
    alert("❌ La voiture n’a pas encore passé la barrière !");
    return;
  }

  barriereOuverte = false;

  // Activer le style sur le bouton cliqué
  document.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
  if (event) event.target.classList.add("active");

 
}

function avancerVoiture() {
  if (!barriereOuverte) {
    alert("⛔ Ouvre la barrière pour avancer.");
    return;
  }

  voitureEnMarche = true;
}

function arreterVoiture() {
  voitureEnMarche = false;
}

function afficherDetails() {
  document.getElementById("popup-details").style.display = "block";
}

function fermerDetails() {
  document.getElementById("popup-details").style.display = "none";
}

function afficherMessage(msg, color = "#3498db") {
  const box = document.getElementById("message");
  box.innerText = msg;
  box.style.backgroundColor = color;
}

voiture.onload = dessinerScene;
boucleAnimation();
function genererTicket() {

  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const heureStr = now.toLocaleTimeString();

  const ticketID = Math.floor(10000000000 + Math.random() * 90000000000);

  
  document.getElementById("ticket-date").innerText = dateStr;
  document.getElementById("ticket-heure").innerText = heureStr;
  document.getElementById("ticket-id").innerText = ticketID;

  const qrData = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=ID:${ticketID}`;
  document.getElementById("qr-code").src = qrData;

}

function afficherDetails() {
  const carte = document.getElementById("carte-details");
  carte.style.display = "block";

  const now = new Date();
  const idVehicule = Math.floor(10000000000 + Math.random() * 89999999999); // ID à 11 chiffres

  document.getElementById("detail-nom").innerText = ticketInfos.nom;
  document.getElementById("detail-immatriculation").innerText = ticketInfos.immatriculation;
  document.getElementById("detail-date").innerText = now.toLocaleDateString();
  document.getElementById("detail-heure").innerText = now.toLocaleTimeString();

  // Tu peux remplir les autres infos depuis un objet ticketInfos :
  document.getElementById("detail-marque").innerText = ticketInfos.marque || "Toyota";
  document.getElementById("detail-modele").innerText = ticketInfos.modele || "Corolla";
  document.getElementById("detail-couleur").innerText = ticketInfos.couleur || "Gris";
  document.getElementById("detail-id").innerText = idVehicule;
}

function fermerDetails() {
  document.getElementById("carte-details").style.display = "none";
}
