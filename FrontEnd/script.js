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

// *** Mode Edition & Token ***//
//Affichage page selon présence du token  - PENSER A DELETE DU STORAGE LE TOKEN  QUAND ON FERME/QUITTE OU LOGOUT
//Fonction qui vérifie localement l'expiration du token
function tokenValidation(token){
  const payload = tokenExpiration(token);
  if(!payload){
    return null;
  }
  return payload
}

function tokenExpiration(token){
  try{
      //Découpe du token en 3 élément, et sélection du payload
    const tokenPayload = token.split(".")[1];
    const payload = JSON.parse(atob(tokenPayload));
    //Déclaration d'une const  qui est le temps actuel en secondes
    const temps = Math.floor(Date.now()/1000);
    //Vérification du payload par rapport au temps
    if(payload.exp && payload.exp < temps){
      return null;
    }
    return payload;
  }
  //En cas d'erreur dans la vérification du token retourne un null
  catch(error){
    return null;
  }
}

const tokenVerifie = tokenValidation(token);

//If qui permet avec la vérification du token l'affichage spécifique
if (tokenVerifie !== null) {
  //Transformation du mot login en logout
  const logModif = document.querySelector(".log");
  logModif.innerHTML = "logout";

  //Création de la barre mode édition
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
  
  //Bouton modifier
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
  if (tokenVerifie !== null){
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

//Lancement des fonctions
projetsGallery(projets);

filtresCategories(categories);

filtrerProjets();

//Modale

const fondModale = document.querySelector(".fond-modale");
const modale = document.querySelector(".modale");
const btnModification = document.querySelector(".div-titre a");

//Fonction pour générer l'affichage de tous les projets en modale
function projetsModale(filtre) {
  // Récupération de l'élément DOM qui accueille la figure
  const divProjets = document.querySelector(".galerie-photo");
  divProjets.innerHTML = "";
  for (let i = 0; i < filtre.length; i++) {
    const travaux = filtre[i];
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

//Permet l'affichage de la modale
btnModification.addEventListener("click", function(event){
  event.preventDefault();
  fondModale.classList.add("active");
  modale.classList.add("active");
  modaleGalerie();
  projetsModale(projets);
  SupprimerTravaux();
})

//Fonction qui clôt la modale
function fermerModale(){
  fondModale.classList.remove("active");
  modale.classList.remove("active");
}

//Permet le désaffichage de la modale en cliquant sur l'arrière plan
fondModale.addEventListener("click", fermerModale);

//Permet le désaffichage de la modale en cliquant sur la croix
const croixFermer = document.querySelector(".fa-xmark");
croixFermer.addEventListener("click", fermerModale);

//Switch affichage modale au click sur "Ajouter une photo"
const switchModale = document.querySelector(".ajout-photo");
switchModale.addEventListener("click", function(){
  modale.classList
})

function SupprimerTravaux(){
  const suppression = document.querySelectorAll(".fa-corbeille");
  //Récupère pour chaque i fa-corbeille le data id de sa fig
  suppression.forEach(corbeille => {
    corbeille.addEventListener("click",async (event)=>{
      //Remonter l'arbre DOM pour trouver le  parent le plus proche de la corbeille
      const figSuppression =  event.target.closest("figure");
      //Récupère le data-id de la figure sélectionnée, ? permet d'éviter une erreur dans le  cas où  il n'y a pas de parent
      const idSuppression = figSuppression?.getAttribute("data-id");
      console.log(idSuppression);
 
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
    });
  });
}

////////EN COURS
//Fonction pour ajouter en option les catégories
function selectCategorie(){
  categories
}


//Passage de  la modale en mode Ajout Photo
const ajoutPhoto = document.querySelector(".ajout-photo")
ajoutPhoto.addEventListener("click", function(){
  const divModale = document.querySelector(".modale");
  //Changer  le h3
  const titreModale =  document.querySelector(".modale h3");
  titreModale.innerText = "Ajout photo";
  //Cacher la galerie photo
  const galeriePhoto = document.querySelector(".galerie-photo");
  galeriePhoto.classList.add("cacher");
  //Afficher  input, titre, catégorie
  const inputPhoto = document.querySelector(".form-photo");
  inputPhoto.classList.remove("cacher");

  //Générer les catégories dans le select

})
////////

