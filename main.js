console.log("JS chargé correctement");

// ---------- Firebase ----------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_PROJET.firebaseapp.com",
  projectId: "VOTRE_PROJET",
  storageBucket: "VOTRE_PROJET.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ---------- Couleurs ----------
const couleurs = ["Rouge","Bleu","Vert","Jaune","Orange","Violet","Rose","Cyan","Marron","Gris"];
const codesCouleurs = {
  "Rouge":"red","Bleu":"blue","Vert":"green","Jaune":"gold",
  "Orange":"orange","Violet":"purple","Rose":"pink","Cyan":"cyan",
  "Marron":"brown","Gris":"grey"
};

// ---------- Variables ----------
let score = 0;
let tempsRestant = 30;
let motCourant = "";
let couleurTexte = "";
let timerInterval;

// ---------- Fonctions ----------
function afficherBestScore() {
  const scores = JSON.parse(localStorage.getItem("scores")||"[]");
  if(scores.length>0){
    const best = scores.reduce((a,b)=>a.score>b.score?a:b);
    document.getElementById("bestScore").textContent = `Meilleur score : ${best.nom} — ${best.score}`;
  } else document.getElementById("bestScore").textContent = "";
}

function demarrerCompteARebours() {
  document.getElementById("accueil").classList.remove("active");
  document.getElementById("compteARebours").classList.add("active");
  let cpt = 3;
  document.getElementById("compte").textContent = cpt;
  const compteInterval = setInterval(()=>{
    cpt--;
    if(cpt>0) document.getElementById("compte").textContent = cpt;
    else{
      clearInterval(compteInterval);
      document.getElementById("compteARebours").classList.remove("active");
      document.getElementById("jeu").classList.add("active");
      startGame();
    }
  },1000);
}

function startGame() {
  score = 0;
  tempsRestant = 30;
  document.getElementById('score').textContent = "Score : " + score;
  afficherBestScore();
  timerInterval = setInterval(updateTimer, 1000);
  nouveauMot();
}

function updateTimer() {
  tempsRestant--;
  document.getElementById('timer').textContent = "Temps : " + tempsRestant + "s";
  if(tempsRestant<=0){
    clearInterval(timerInterval);
    finDePartie();
  }
}

function nouveauMot() {
  motCourant = couleurs[Math.floor(Math.random()*couleurs.length)];
  couleurTexte = couleurs[Math.floor(Math.random()*couleurs.length)];
  const motDiv = document.getElementById('mot');
  motDiv.textContent = motCourant;
  motDiv.style.color = codesCouleurs[couleurTexte];

  const boutonsDiv = document.getElementById('boutons');
  boutonsDiv.innerHTML = "";

  let couleursBoutons = [...couleurs];
  couleursBoutons = couleursBoutons.sort(()=>Math.random()-0.5).slice(0,10);
  if(!couleursBoutons.includes(motCourant)){ couleursBoutons[0]=motCourant; couleursBoutons.sort(()=>Math.random()-0.5); }

  couleursBoutons.forEach(c=>{
    const btn = document.createElement('button');
    btn.textContent = c;
    btn.className = "btn-couleur";
    btn.style.backgroundColor = codesCouleurs[c];
    btn.style.color = (c==="Jaune" || c==="Rose" || c==="Cyan") ? "black" : "white";
    btn.addEventListener('click', ()=>verifierReponse(c));
    boutonsDiv.appendChild(btn);
  });
}

function verifierReponse(couleurChoisie){
  if(couleurChoisie===motCourant){
    score++;
    document.getElementById('score').textContent = "Score : " + score;
  }
  nouveauMot();
}

function finDePartie(){
  document.getElementById('jeu').classList.remove("active");
  document.getElementById('fin').classList.add("active");
  document.getElementById('scoreFinal').textContent = `Partie terminée ! Score final : ${score}`;
}

async function validerNom() {
  const nom = document.getElementById('nomJoueur').value.trim();
  if (!nom) return;

  try {
    await addDoc(collection(db, "scores"), {
      nom: nom,
      score: score,
      date: new Date()
    });
    document.getElementById('fin').classList.remove("active");
    afficherClassement();
  } catch(err) {
    console.error("Erreur en envoyant le score :", err);
  }
}

async function afficherClassement() {
  document.getElementById('classement').classList.add("active");
  document.getElementById('accueil').classList.remove("active");

  const listeDiv = document.getElementById('listeScores');
  listeDiv.innerHTML = "";

  const q = query(
    collection(db, "scores"),
    orderBy("score", "desc"),
    limit(10)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    listeDiv.textContent = "Aucun score enregistré.";
    return;
  }

  let i = 1;
  snapshot.forEach(doc => {
    const s = doc.data();
    const div = document.createElement('div');
    div.textContent = `${i}. ${s.nom} — ${s.score}`;
    listeDiv.appendChild(div);
    i++;
  });
}

function retourAccueil(){
  document.getElementById('classement').classList.remove("active");
  document.getElementById('accueil').classList.add("active");
}

// Exposer les fonctions pour les boutons HTML
window.demarrerCompteARebours = demarrerCompteARebours;
window.validerNom = validerNom;
window.afficherClassement = afficherClassement;
window.retourAccueil = retourAccueil;



