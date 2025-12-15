// Couleurs
const couleurs = ["Rouge","Bleu","Vert","Jaune","Orange","Violet","Rose","Cyan","Marron","Gris"];
const codesCouleurs = {
  "Rouge":"red","Bleu":"blue","Vert":"green","Jaune":"gold",
  "Orange":"orange","Violet":"purple","Rose":"pink","Cyan":"cyan",
  "Marron":"brown","Gris":"grey"
};

// Variables
let score = 0;
let tempsRestant = 30;
let motCourant = "";
let couleurTexte = "";
let timerInterval;

// Afficher le meilleur score
function afficherBestScore() {
  const scores = JSON.parse(localStorage.getItem("scores")||"[]");
  if(scores.length>0){
    const best = scores.reduce((a,b)=>a.score>b.score?a:b);
    document.getElementById("bestScore").textContent = `Meilleur score : ${best.nom} — ${best.score}`;
  } else document.getElementById("bestScore").textContent = "";
}

// Compte à rebours avant le jeu
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

// Démarrer le jeu
function startGame() {
  score = 0;
  tempsRestant = 30;
  document.getElementById('score').textContent = "Score : " + score;
  afficherBestScore();
  timerInterval = setInterval(updateTimer, 1000);
  nouveauMot();
}

// Timer
function updateTimer() {
  tempsRestant--;
  document.getElementById('timer').textContent = "Temps : " + tempsRestant + "s";
  if(tempsRestant<=0){
    clearInterval(timerInterval);
    finDePartie();
  }
}

// Nouveau mot
function nouveauMot() {
  motCourant = couleurs[Math.floor(Math.random()*couleurs.length)];
  couleurTexte = couleurs[Math.floor(Math.random()*couleurs.length)];
  const motDiv = document.getElementById('mot');
  motDiv.textContent = motCourant;
  motDiv.style.color = codesCouleurs[couleurTexte];

  const boutonsDiv = document.getElementById('boutons');
  boutonsDiv.innerHTML = "";

  // Créer 10 boutons aléatoires
  let couleursBoutons = [...couleurs];
  couleursBoutons = couleursBoutons.sort(()=>Math.random()-0.5).slice(0,10);
  if(!couleursBoutons.includes(motCourant)){ couleursBoutons[0]=motCourant; couleursBoutons.sort(()=>Math.random()-0.5); }

  // Ajouter boutons au DOM
  couleursBoutons.forEach(c=>{
    const btn = document.createElement('button');
    btn.textContent = c;
    btn.className = "btn-couleur";
    btn.style.backgroundColor = codesCouleurs[c];
    btn.style.color = (c==="Jaune" || c==="Rose" || c==="Cyan") ? "black" : "white"; // texte lisible
    btn.addEventListener('click', ()=>verifierReponse(c));
    boutonsDiv.appendChild(btn);
  });
}

// Vérifier réponse
function verifierReponse(couleurChoisie){
  if(couleurChoisie===motCourant){
    score++;
    document.getElementById('score').textContent = "Score : " + score;
  }
  nouveauMot();
}

// Fin de partie
function finDePartie(){
  document.getElementById('jeu').classList.remove("active");
  document.getElementById('fin').classList.add("active");
  document.getElementById('scoreFinal').textContent = `Partie terminée ! Score final : ${score}`;
}

// Valider nom et sauvegarder score
function validerNom(){
  const nom = document.getElementById('nomJoueur').value.trim();
  if(!nom) return;
  let scores = JSON.parse(localStorage.getItem("scores")||"[]");
  scores.push({nom:nom,score:score});
  scores.sort((a,b)=>b.score-a.score);
  localStorage.setItem("scores",JSON.stringify(scores));
  document.getElementById('fin').classList.remove("active");
  afficherClassement();
}

// Classement
function afficherClassement(){
  document.getElementById('classement').classList.add("active");
  document.getElementById('accueil').classList.remove("active");
  const listeDiv = document.getElementById('listeScores');
  listeDiv.innerHTML = "";
  const scores = JSON.parse(localStorage.getItem("scores")||"[]");
  if(scores.length===0){ listeDiv.textContent="Aucun score enregistré."; return; }
  scores.forEach((s,i)=>{
    const div=document.createElement('div');
    div.textContent=`${i+1}. ${s.nom} — ${s.score}`;
    listeDiv.appendChild(div);
  });
}

// Retour accueil
function retourAccueil(){
  document.getElementById('classement').classList.remove("active");
  document.getElementById('accueil').classList.add("active");
}
