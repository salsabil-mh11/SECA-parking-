const voiture = new Image();
const kio = new Image();
const camera = new Image();
const barriereFermee = new Image();
const barriereOuverture = new Image();
const barriereOuverte = new Image();
const borne = new Image();

let imagesChargees = 0;
const totalImages = 7;

const positionBarriere = {
  fermee: { x: 140, y: 10 },
  ouverture: { x: 140, y: 10 },
  ouverte: { x: 140, y: 10 } 
};


function verifierChargementImages() {
  imagesChargees++;
  if (imagesChargees === totalImages) {
    dessinerScene();
    boucleAnimation();
  }
}

voiture.onload = verifierChargementImages;
kio.onload = verifierChargementImages;
camera.onload = verifierChargementImages;
barriereFermee.onload = verifierChargementImages;
barriereOuverture.onload = verifierChargementImages;
barriereOuverte.onload = verifierChargementImages;
borne.onload = verifierChargementImages;



const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

voiture.src = "voiture.png";
kio.src = "kio2.png";
barriereFermee.src = "barriere_fermee.png";
barriereOuverture.src = "barriere_ouverture.png";
barriereOuverte.src = "barriere_ouverte.png";
camera.src = "camera.png";
borne.src = "borne.png";

const barriereX = 140;
const barriereY = 10;
let currentBarriere = barriereFermee;
let EstbarriereOuverte = false;
let afficherTicket = false;
let voiturePasse = false;
let voitureEnMarche = false;
let voitureVisible = false;
let voitureY = canvas.height + 50;

let ticketInfos = {
  immatriculation: "123-TN-456",
  date: "" ,
  nom:"MHADHBI SALSABIL"
};
let plaqueCapturee = false;
let ticketPris = false;



function dessinerScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 🛣️ Route
  const routeX = 300;
  const routeWidth = 300;

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

 
  if (voitureVisible) {
    ctx.drawImage(voiture, 375, voitureY, 160, 150);
  }


  if (currentBarriere === barriereFermee) {
    ctx.drawImage(barriereFermee, 140, 10, 500, 300);
  } else if (currentBarriere === barriereOuverture) {
    ctx.drawImage(barriereOuverture, 90,-120, 495, 415); 
  } else if (currentBarriere === barriereOuverte) {
    ctx.drawImage(barriereOuverte, 10, -190, 420, 470); 
  }


  ctx.drawImage(kio, 580, 290, 180, 220);
  ctx.drawImage(camera, 600, 80, 80, 60);
  ctx.drawImage(borne, 0, 1, 1, 1);
}





function boucleAnimation() {
  if (voitureEnMarche) {
    voitureY -= 2;
    if (voitureY <= 50) {
      voiturePasse = true;
    }
  }

  dessinerScene();
  requestAnimationFrame(boucleAnimation);
}



function capturerPlaque() {
  if (!voitureVisible) {
    afficherMessage("aucune voiture apparue");
    return;
  }


  if (!plaqueCapturee) {
    plaqueCapturee = true;

    document.getElementById("immatriculation-box").style.display = "block";
    document.getElementById("scene-container").classList.add("transition-gauche");

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


    afficherMessage(` Ticket généré pour ${ticketInfos.nom}`);
  } else {
    afficherMessage(" Ticket déjà généré.");
  }
}

function ouvrirBarriere() {
  if (!plaqueCapturee || !ticketPris) {
    afficherMessage("Tu dois capturer la plaque et générer le ticket.");
    return;
  }

  currentBarriere = barriereFermee;
  dessinerScene();

  setTimeout(() => {
    currentBarriere = barriereOuverture;  
    dessinerScene();

    setTimeout(() => {
      currentBarriere = barriereOuverte;  
      dessinerScene();
      EstbarriereOuverte = true;          
    }, 500);
  }, 500);
}


function fermerBarriere(event) {
  if (!voiturePasse) {
    afficherMessage(" La voiture n’a pas encore passé la barrière !");
    return;
  }

  currentBarriere = barriereOuverture;
  dessinerScene();

  setTimeout(() => {
    currentBarriere = barriereFermee;
    dessinerScene();
    EstbarriereOuverte = false;
  }, 500);

  document.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
  if (event) event.target.classList.add("active");
}


function avancerVoiture() {
  if (!EstbarriereOuverte) {
    afficherMessage(" Ouvre la barrière pour avancer.");
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






function resetSimulation() {
  voitureY = canvas.height + 50;
  EstbarriereOuverte = false;
  voitureVisible = false;  
  afficherTicket = false;
  voiturePasse = false;
  voitureEnMarche = false;
  ticketPris = false;
  plaqueCapturee = false;
  currentBarriere = barriereFermee;

  ticketInfos = {
    immatriculation: "123-TN-456",
    date: "",
    nom: "MHADHBI SALSABIL"
  };

  document.getElementById("ticket").style.display = "none";
  document.getElementById("immatriculation-box").style.display = "none";
  fermerDetails();
  dessinerScene();
  afficherMessage("🔄 Simulation réinitialisée.");
}

function apparaitre(){
  if(voitureVisible) return ;
  voitureVisible = true;

  
  const interval=setInterval(()=>{
    if (voitureY <=350){
      voitureY=350;
      
      clearInterval(interval);
    }
    else{
      voitureY-=2;
    }
  },16);
}




