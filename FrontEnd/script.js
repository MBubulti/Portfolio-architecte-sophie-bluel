//Appel des différents Projets
const appelApiProjets = await fetch("http://localhost:5678/api/works/");
const projets = await appelApiProjets.json();

//Appel des différentes Catégories pour les filtres
const appelApiCategories = await fetch("http://localhost:5678/api/categories/");
const categories = await appelApiCategories.json();

//Affichage page selon présence du token  - PENSER A DELETE DU STORAGE LE TOKEN  QUAND ON FERME/QUITTE OU LOGOUT
//Récupération du token en localStorage
const token = localStorage.getItem("token");

//Ajout de l'élément Tous dans le tableau & tri des filtres
categories.push({id: 0, name: "Tous"});
categories.sort(function (a, b) {
  return a.id - b.id;
});

//Fonction qui vérifie localement l'expiration du token
function tokenExpiration(token){
  if(!token){
    return null;
  }
  //Découpe du token en 3 élément, et sélection du payload
  try{
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

const tokenVerifie = tokenExpiration(token);

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