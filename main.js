console.log("JS chargé correctement");

// ---------- Variables ----------
let score = 0;
let tempsRestant = 30;
let motCourant = "";
let timerInterval;

// ---------- Couleurs ----------
const couleurs = ["Rouge","Bleu","Vert","Jaune","Orange","Violet","Rose","Cyan","Marron","Gris"];
const codesCouleurs = {
  Rouge:"red", Bleu:"blue", Vert:"green", Jaune:"gold",
  Orange:"orange", Violet:"purple", Rose:"pink", Cyan:"cyan",
  Marron:"brown", Gris:"grey"
};

// ---------- Jeu ----------
function demarrerCompteARebours() {
  document.getElementById("accueil").classList.remove("active");
  document.getElementById("compteARebours").classList.add("active");

  let cpt = 3;
  document.getElementById("compte").textContent = cpt;

  const interval = setInterval(() => {
    cpt--;
    if (cpt > 0) {
      document.getElementById("compte").textContent = cpt;
    } else {
      clearInterval(interval);
      document.getElementById("compteARebours").classList.remove("active");
      document.getElementById("jeu").classList.add("active");
      startGame();
    }
  }, 1000);
}

function startGame() {
  score = 0;
  tempsRestant = 30;
  document.getElementById("score").textContent = "Score : 0";
  document.getElementById("timer").textContent = "Temps : 30s";
  timerInterval = setInterval(updateTimer, 1000);
  nouveauMot();
}

function updateTimer() {
  tempsRestant--;
  document.getElementById("timer").textContent = "Temps : " + tempsRestant + "s";
  if (tempsRestant <= 0) {
    clearInterval(timerInterval);
    finDePartie();
  }
}

function nouveauMot() {
  motCourant = couleurs[Math.floor(Math.random()*couleurs.length)];
  const couleurTexte = couleurs[Math.floor(Math.random()*couleurs.length)];

  const mot = document.getElementById("mot");
  mot.textContent = motCourant;
  mot.style.color = codesCouleurs[couleurTexte];

  const boutons = document.getElementById("boutons");
  boutons.innerHTML = "";

  couleurs.forEach(c => {
    const btn = document.createElement("button");
    btn.textContent = c;
    btn.className = "btn-couleur";
    btn.style.backgroundColor = codesCouleurs[c];
    btn.onclick = () => verifierReponse(c);
    boutons.appendChild(btn);
  });
}

function verifierReponse(c) {
  if (c === motCourant) {
    score++;
    document.getElementById("score").textContent = "Score : " + score;
  }
  nouveauMot();
}

function finDePartie() {
  document.getElementById("jeu").classList.remove("active");
  document.getElementById("fin").classList.add("active");
  document.getElementById("scoreFinal").textContent =
    "Partie terminée ! Score : " + score;
}

// ---------- Score local ----------
function validerNom() {
  const nom = document.getElementById("nomJoueur").value.trim();
  if (!nom) return;

  const scores = JSON.parse(localStorage.getItem("scores") || "[]");
  scores.push({ nom, score });
  scores.sort((a,b)=>b.score-a.score);
  localStorage.setItem("scores", JSON.stringify(scores));

  document.getElementById("fin").classList.remove("active");
  afficherClassement();
}

function afficherClassement() {
  document.getElementById("classement").classList.add("active");
  document.getElementById("accueil").classList.remove("active");

  const liste = document.getElementById("listeScores");
  liste.innerHTML = "";

  const scores = JSON.parse(localStorage.getItem("scores") || "[]");

  scores.forEach((s,i)=>{
    const div = document.createElement("div");
    div.textContent = `${i+1}. ${s.nom} — ${s.score}`;
    liste.appendChild(div);
  });
}

function retourAccueil() {
  document.getElementById("classement").classList.remove("active");
  document.getElementById("accueil").classList.add("active");
}

// ---------- Exposer ----------
window.demarrerCompteARebours = demarrerCompteARebours;
window.validerNom = validerNom;
window.afficherClassement = afficherClassement;
window.retourAccueil = retourAccueil;
