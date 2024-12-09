//Appel des différents Projets
const appelApiProjets = await fetch("http://localhost:5678/api/works/");
const projets = await appelApiProjets.json();

//Appel des différentes Catégories pour les filtres
const appelApiCategories = await fetch("http://localhost:5678/api/categories/");
const categories = await appelApiCategories.json();

//Récupération du token en localStorage
const token = localStorage.getItem("token");

//Ajout de l'élément Tous dans le tableau & tri des filtres
categories.push({id: 0, name: "Tous"});
categories.sort(function (a, b) {
  return a.id - b.id;
});

// *** Token ***//
//Fonction pour vérifier le token
function IsTokenValide(token){
  try{
      //Découpe du token en 3 élément, et sélection du payload
    const tokenPayload = token.split(".")[1];
    const payload = JSON.parse(atob(tokenPayload));
    //Déclaration d'une const  qui est le temps actuel en secondes
    const temps = Math.floor(Date.now()/1000);
    //Vérification du payload par rapport au temps
    if(payload.exp && payload.exp < temps){
      return false;
    }
    return true;
  }
  //En cas d'erreur dans la vérification du token retourne un null
  catch(error){
    return false;
  }
}

//Suppression du token en cas de click sur logout
const logSupprToken = document.querySelector(".log");
logSupprToken.addEventListener("click", function(event){
  token = localStorage.removeItem("token");
})

// *** Contenu générer en cas de présence du token ***//
//Fonction pour générer le bouton modifier
function boutonModifier(){
  const selectionModifier = document.querySelector("#portfolio");
  const divTitre = document.createElement("div");
  divTitre.classList.add("div-titre")
  const titrePortfolio = document.querySelector("#portfolio h2");
  selectionModifier.insertBefore(divTitre, document.querySelector(".gallery"));
  divTitre.appendChild(titrePortfolio);
  const btnModifier = document.createElement("a");
  btnModifier.setAttribute("href", "#")
  divTitre.appendChild(btnModifier);
  let iconeModification = document.createElement("i");
  iconeModification.classList.add("fa-regular", "fa-pen-to-square");
  btnModifier.appendChild(iconeModification);
  const txtModifier = document.createElement("p");
  txtModifier.innerText = "modifier";
  btnModifier.appendChild(txtModifier);
}

//Fonction pour générer la barre édition
function barreEdition(){
  const barreEdition = document.querySelector("body");
  let divBarreEdition = document.createElement("div");
  const texteEdition = document.createElement("p");
  let iconeEdition = document.createElement("i");
  iconeEdition.classList.add("fa-regular", "fa-pen-to-square", "white");
  texteEdition.classList.add("white");
  texteEdition.innerText = "Mode édition";
  divBarreEdition.classList.add("mode-edition");
  divBarreEdition = barreEdition.insertBefore(
    divBarreEdition,
    document.querySelector("header")
  );
  divBarreEdition.appendChild(iconeEdition);
  divBarreEdition.appendChild(texteEdition);
}

//If qui permet avec la vérification du token l'affichage spécifique
if (IsTokenValide(token) === true) {
  //Transformation du mot login en logout
  const logModif = document.querySelector(".log");
  logModif.innerHTML = "logout";
  barreEdition();
  boutonModifier();
}

//Fonction pour générer l'affichage de tous les projets
function projetsGallery(filtre) {
  // Récupération de l'élément DOM qui accueille la figure
  const divProjets = document.querySelector(".gallery");
  divProjets.innerHTML = "";
  for (let i = 0; i < filtre.length; i++) {
    const travaux = filtre[i];
    // Création d'une figure dédiée aux projets
    const figuresProjet = document.createElement("figure");
    figuresProjet.dataset.id = travaux.id;
    //Création des éléments de la figure
    const imgProjet = document.createElement("img");
    imgProjet.src = travaux.imageUrl;
    const titreProjet = document.createElement("figcaption");
    titreProjet.innerText = travaux.title;
    divProjets.appendChild(figuresProjet);
    figuresProjet.appendChild(imgProjet);
    figuresProjet.appendChild(titreProjet);
  }
}

//Fonction pour générer les boutons filtres de tous les projets
function filtresCategories() {
  //Permet de ne pas générer les filtres si on a un token Vérifié
  if (IsTokenValide(token) === true){
    return;
  }
  const filtresNav = document.createElement("nav");
  for (let i = 0; i < categories.length; i++) {
      //Barre de navigation Filtres des projets
      const filtresProjet = document.querySelector("#portfolio h2");
      const categoriesFiltres = categories[i];
      const filtres = document.createElement("div");
      filtres.dataset.id = categoriesFiltres.id;
      const filtresTitre = document.createElement("p");
      filtresTitre.innerText = categoriesFiltres.name;
      filtresProjet.appendChild(filtresNav);
      filtresNav.appendChild(filtres);
      filtres.appendChild(filtresTitre);
    }
}

//Fonction pour Filtrer les projets
function filtrerProjets(){
  const btnTri = document.querySelectorAll("div[data-id]");
  btnTri.forEach((btn) => {
    btn.addEventListener("click", function(){
      const idProjet = btn.getAttribute("data-id");
      let projetFiltre;
      if (idProjet === "0") {
        projetFiltre = projets
      }
      else{
      projetFiltre = projets.filter((projet) => projet.category.id === parseInt(idProjet));
    }
      projetsGallery(projetFiltre);
    })
  });
}

//Lancement des fonctions pour la galerie et les filtres en mode  visiteur
projetsGallery(projets);
filtresCategories(categories);
filtrerProjets();

// *** Modale ***//
//Initialisation de valeurs
const fondModale = document.querySelector(".fond-modale");
const modale = document.querySelector(".modale");
const btnModification = document.querySelector(".div-titre a");
const ajoutPhoto = document.querySelector(".ajout-photo");
const depotPhoto = document.getElementById("depot-photo");
const btnAjoutPhoto = document.querySelector(".envoi");

//Fonction pour générer l'affichage de tous les projets dans la modale
function projetsModale(projet) {
  // Récupération de l'élément DOM qui accueille la figure
  const divProjets = document.querySelector(".galerie-photo");
  divProjets.innerHTML = "";
  for (let i = 0; i < projet.length; i++) {
    const travaux = projet[i];
    // Création d'une figure dédiée aux projets
    const figuresProjet = document.createElement("figure");
    figuresProjet.dataset.id = travaux.id;
    //Création des éléments de la figure
    const imgProjet = document.createElement("img");
    imgProjet.src = travaux.imageUrl;
    imgProjet.classList.add("photo-modale");
    const corbeille = document.createElement("i");
    corbeille.classList.add("fa-solid", "fa-trash-can", "fa-corbeille");
    divProjets.appendChild(figuresProjet);
    figuresProjet.appendChild(imgProjet);
    figuresProjet.appendChild(corbeille);
  }
}

//Fonction qui génére la modale galerie photo
function modaleGalerie(){
  //Initialiser les différents éléments dans la modale
  const divModale = document.querySelector(".modale");
  const placementModale = document.querySelector(".form-photo");
  //Vérifier que le contenu n'existe pas déjà
  if(divModale.querySelector("h3")){
    //S'assurer de réafficher la galerie sur la modale
    const galeriePhoto = document.querySelector(".galerie-photo");
    galeriePhoto.classList.remove("cacher");
    const inputPhoto = document.querySelector(".form-photo");
    inputPhoto.classList.add("cacher");
    return;
  }
  else{
 //Générer le contenu
 const titreModale = document.createElement("h3");
 titreModale.innerText = "Galerie photo";
 const divGalerie = document.createElement("div");
 divGalerie.classList.add("galerie-photo");
 const inputPhoto = document.querySelector(".form-photo");
 inputPhoto.classList.add("cacher");
 //Attribution des éléments
 divModale.insertBefore(titreModale, placementModale);
 divModale.insertBefore(divGalerie, placementModale);
  }
}

//Permet l'affichage de la modale au click sur modifier
btnModification.addEventListener("click", function(event){
  event.preventDefault();
  fondModale.classList.add("active");
  modale.classList.add("active");
  btnAjoutPhoto.classList.add("cacher")
  modaleGalerie();
  projetsModale(projets);
  SupprimerTravaux();
})

//Fonction qui clôt la modale
function fermerModale(){
  const titreModale =  document.querySelector(".modale h3");
  titreModale.innerText = "Galerie photo";
  ajoutPhoto.innerText = "Ajouter une photo";
  btnAjoutPhoto.classList.remove("activation");
  ajoutPhoto.classList.remove("cacher");
  const fleche = document.querySelector(".fa-arrow-left");
  fleche.classList.remove("visible");
  fondModale.classList.remove("active");
  modale.classList.remove("active");
  viderFormulaire();
}

//Permet le désaffichage de la modale en cliquant sur l'arrière plan
fondModale.addEventListener("click", fermerModale);

//Permet le désaffichage de la modale en cliquant sur la croix
const croixFermer = document.querySelector(".fa-xmark");
croixFermer.addEventListener("click", fermerModale);

//Permet le retour en arrière avec la fleche sur la modale
const flecheRetour = document.querySelector(".fa-arrow-left");
flecheRetour.addEventListener("click", function(){
  const fleche = document.querySelector(".fa-arrow-left");
  fleche.classList.remove("visible");
  const titreModale =  document.querySelector(".modale h3");
  titreModale.innerText = "Galerie photo";
  ajoutPhoto.innerText = "Ajouter une photo";
  const galeriePhoto = document.querySelector(".galerie-photo");
  galeriePhoto.classList.remove("cacher");
  const inputPhoto = document.querySelector(".form-photo");
  inputPhoto.classList.add("cacher");
  btnAjoutPhoto.classList.remove("activation");
  btnAjoutPhoto.classList.add("cacher")
  ajoutPhoto.classList.remove("cacher");
});

//Fonction pour ajouter en option les catégories
function selectCategorie(){
  const barreSelect = document.querySelector("#categorie");
  barreSelect.innerHTML = '<option value=""></option>';
  for (let i = 1; i < categories.length; i++){
    const optionFiltre = categories[i];
    const option = document.createElement("option");
    option.value =  optionFiltre.id;
    option.innerText =  optionFiltre.name;
    barreSelect.appendChild(option);
  }
}

// Vider le formulaire après envoi
function viderFormulaire(){
  const formulaire = document.querySelector(".form-photo");
  if (formulaire) {
    formulaire.reset();
    const photoInput = formulaire.querySelector(".affichage-photo");
    photoInput.src = "";
    photoInput.classList.add("cacher");
    const faImage = document.querySelector(".fa-image");
    const labelSpan = document.querySelector(".zone-depot span");
    const labelP = document.querySelector(".zone-depot p");
    faImage.classList.remove("cacher");
    labelSpan.classList.remove("cacher");
    labelP.classList.remove("cacher");
  }
}

//***Fonction Modifications Travaux ***//
//Fonction pour supprimer les travaux
function SupprimerTravaux(){
  const suppression = document.querySelectorAll(".fa-corbeille");
  //Récupère pour chaque i fa-corbeille le data id de sa fig
  suppression.forEach(corbeille => {
    corbeille.addEventListener("click",async (event)=>{
      //Remonter l'arbre DOM pour trouver le  parent le plus proche de la corbeille
      const figSuppression =  event.target.closest("figure");
      //Récupère le data-id de la figure sélectionnée, ? permet d'éviter une erreur dans le  cas où  il n'y a pas de parent
      const idSuppression = figSuppression?.getAttribute("data-id");
      //Vérification du token avant de lancer le try/catch
      if (IsTokenValide(token) === true){
        //Envoyer la requêtre DELETE pour supprimer l'élément
        try{
        const reponse = await fetch(`http://localhost:5678/api/works/${idSuppression}`, {
          method: "DELETE",
          headers: {Authorization: `Bearer ${token}`},
        });
        if (reponse.ok){
          figSuppression.remove();
          const figGallery = document.querySelector(`.gallery figure[data-id="${idSuppression}"]`);
          figGallery.remove();

        } else{
          alert("Travail non supprimé", reponse.statusText, reponse.status);
        }
        }
        catch(error){
        console.error("Problème rencontré", error);
        }
      }
    });   
  });
}

//Fonction qui récupère les  informations
function recupererTravail(){
//Récupération informations formulaire au click du bouton valider
  //Récupération PHOTO
  let photo = document.getElementById("depot-photo").files[0];
  //Récupération TITRE
  const titre = document.querySelector("#titre-travail");
  const titreEnvoyer = titre.value.trim();
  if (titreEnvoyer === "") {
    alert("Votre titre n'est pas valide");
  }
  //Récupération SELECT
  const selectChoix = document.getElementById("categorie");
  //Récupérer l'index du select
  const choixIndex = selectChoix.selectedIndex;
  //Attribution value option choisie
  const choix = selectChoix.options[choixIndex].value;
  const choixInt = parseInt(choix, 10);

  //Déclaration du FormData pour  envoi à l'API
  const nouveauTravail = new FormData();
  nouveauTravail.append("image", photo);
  nouveauTravail.append("title", titreEnvoyer);
  nouveauTravail.append("category", choixInt);
  return nouveauTravail
}

//Fonction qui gère l'envoi du travail
async function envoyerTravail(){
  const nouveauTravail = recupererTravail();
  if(IsTokenValide(token) === true){
    //Envoi via Fetch API
    try{
    const reponse = await fetch("http://localhost:5678/api/works/", {
          method: "POST",
          headers: {Authorization: `Bearer ${token}`},
          body: nouveauTravail,
        });
    if(!reponse.ok){
      const message = `${reponse.status}: ${reponse.statusText}`;
      alert(message)
      return null;
    }
    //Réponse en JSON
    const reponseValide = await reponse.json();
    //Renvoie la valeur de la réponse
    return reponseValide;
    }catch(error){
      alert("Problème rencontré : "+ error.message);
      return null;
    }
  }
};

//Passage de  la modale en mode Ajout Photo
ajoutPhoto.addEventListener("click", function(){
  //Changer  le h3
  const titreModale =  document.querySelector(".modale h3");
  titreModale.innerText = "Ajout photo";
  //Changer le bouton
  ajoutPhoto.classList.add("cacher");
  btnAjoutPhoto.classList.remove("cacher")
  //Cacher la galerie photo
  const galeriePhoto = document.querySelector(".galerie-photo");
  galeriePhoto.classList.add("cacher");
  //Afficher  input, titre, catégorie
  const inputPhoto = document.querySelector(".form-photo");
  inputPhoto.classList.remove("cacher");
  //Apparition élément  FA flèche
  const fleche = document.querySelector(".fa-arrow-left");
  fleche.classList.add("visible");
  //Ajout effet grisé sur la  barre Valider
  btnAjoutPhoto.classList.add("activation");
  //Générer les catégories dans le select
  selectCategorie(categories);
  verifierFormulaire();
});

//Fonction pour vérifier la complétion correcte du formulaire
function verifierFormulaire(){
  const formulaire = document.querySelector(".form-photo");
  //Déclaration d'une fonction fléchée pour confirmer la validité du formulaire
  const verificationForm = () => {
    const valide = formulaire.checkValidity();
    if(valide){
      btnAjoutPhoto.classList.remove("activation");
    } else{
      btnAjoutPhoto.classList.add("activation");
    }
  };
  formulaire.addEventListener("input",verificationForm);
  //Vérification initiale
  verificationForm();
}

//Afficher l'image ajoutée en input
depotPhoto.addEventListener("change", function (event) {
  //Récupérer l'image envoyée
  const photoAjoutee = event.target;
  const photo = photoAjoutee.files[0];
  if (photo) {
    // Crée une URL temporaire pour le fichier
    const photoURL = URL.createObjectURL(photo); 
    const imageAffichage = document.querySelector(".affichage-photo");
    // Cache les différents éléments
    const faImage = document.querySelector(".fa-image");
    const labelSpan = document.querySelector(".zone-depot span");
    const labelP = document.querySelector(".zone-depot p");
    faImage.classList.add("cacher");
    labelSpan.classList.add("cacher");
    labelP.classList.add("cacher");
    //Ajout d'une source à l'image
    imageAffichage.classList.remove("cacher");
    imageAffichage.src = photoURL;
    // Libère l'URL temporaire lorsque l'image n'est plus nécessaire
    imageAffichage.onload = () => URL.revokeObjectURL(photoURL);
  } else {
    // Si aucun fichier sélectionné, on cache l'image
    imageAffichage.classList.add("cacher");
    const imageAffichage = document.querySelector(".affichage-photo");
    imageAffichage.src = "";
    const faImage = document.querySelector(".fa-image");
    const labelSpan = document.querySelector(".zone-depot span");
    const labelP = document.querySelector(".zone-depot p");
    faImage.classList.remove("cacher");
    labelSpan.classList.remove("cacher");
    labelP.classList.remove("cacher");
  }
});

//*** Envoi des informations à  l'API ***//
btnAjoutPhoto.addEventListener("click",async function(event){
  event.preventDefault();
  const reponse = await envoyerTravail();
  if (reponse){
    const nvlFigure = document.createElement("figure");
    nvlFigure.dataset.id = reponse.id;
    const nvlImg = document.createElement("img");
    nvlImg.src = reponse.imageUrl;
    const  nvTitre = document.createElement("figcaption");
    nvTitre.innerText = reponse.title;
    document.querySelector(".gallery").appendChild(nvlFigure);
    nvlFigure.appendChild(nvlImg);
    nvlFigure.appendChild(nvTitre);
  }
  fermerModale();
})