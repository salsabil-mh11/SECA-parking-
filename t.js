// Objet contenant chaque voiture avec sa position
const voitures = {
  voiture1: { el: document.getElementById('voiture1'), x: 100, y: 100 ,angle: 0},
  voiture2: { el: document.getElementById('voiture2'), x: 100, y: 200 ,angle: 0},
  voiture3: { el: document.getElementById('voiture3'), x: 100, y: 300 ,angle: 0}
};
const obstacle = document.getElementById('obstacle');

// Liste des voitures activées
let activeCars = ['voiture1', 'voiture2']; // Par défaut : voiture1 et voiture2

// Initialiser les positions
function setInitialPositions() {
  activeCars.forEach(id => {
    const car = voitures[id];
    car.el.style.left = car.x + 'px';
    car.el.style.top = car.y + 'px';
  });
}
setInitialPositions();

// Changer les voitures activées avec les cases à cocher
function toggleCar(id) {
  const index = activeCars.indexOf(id);
  if (index === -1) {
    activeCars.push(id);
  } else {
    activeCars.splice(index, 1);
  }
  setInitialPositions();
}

// Mouvement
let interval = null;


js
Copier
Modifier
function bouger(dx, dy, angle) {
  if (interval) return;

  interval = setInterval(() => {
    activeCars.forEach(id => {
      const car = voitures[id];
      const el = car.el;

      const maxX = window.innerWidth - el.offsetWidth;
      const maxY = window.innerHeight - el.offsetHeight;

      const newX = car.x + dx;
      const newY = car.y + dy;

      if (newX >= 0 && newX <= maxX && newY >= 0 && newY <= maxY) {
        car.x = newX;
        car.y = newY;
        car.angle = angle;  // تحديث زاوية السيارة
        el.style.left = car.x + 'px';
        el.style.top = car.y + 'px';
        el.style.transform = `rotate(${car.angle}deg)`;  // تطبيق الدوران
      }
    });
  }, 30);
}

function arreter() {
  clearInterval(interval);
  interval = null;
}

function Haut() { bouger(0, -5, -90); }
function Bas() { bouger(0, 5, 90); }
function Gauche() { bouger(-5, 0, 180); }
function Droite() { bouger(5, 0, 0); }
function hGauche() { bouger(-5, -5, -135); }
function hDroite() { bouger(5, -5, -45); }
function bGauche() { bouger(-5, 5, 135); }
function bDroite() { bouger(5, 5, 45); }

// Fonction sauter
function sauter() {
  activeCars.forEach(id => {
    const el = voitures[id].el;
    el.style.transform = 'translateY(-150px)';
    setTimeout(() => {
      el.style.transform = 'translateY(0)';
    }, 300);
  });
}
function detectCarCollision(currentId, currentEl) {
  const currentRect = currentEl.getBoundingClientRect();

  for (let otherId of activeCars) {
    if (otherId !== currentId) {
      const otherEl = voitures[otherId].el;
      const otherRect = otherEl.getBoundingClientRect();

      const collision = !(
        currentRect.right < otherRect.left ||
        currentRect.left > otherRect.right ||
        currentRect.bottom < otherRect.top ||
        currentRect.top > otherRect.bottom
      );

      if (collision) {
        return true; 
    }
    }
  }

  return false; // ما فماش تصادم
}